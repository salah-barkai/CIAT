import dns from 'dns';
/* Fix DNS SRV pour MongoDB sur Windows — inutile sur Linux/Vercel */
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* Chargement explicite du .env depuis le répertoire du script */
loadEnv({ path: join(__dirname, '.env') });

/* ── Connexion MongoDB ── */
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.error('❌ MongoDB erreur:', err.message));
  mongoose.connection.on('error', err => console.error('⚠️  MongoDB erreur réseau:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB déconnecté'));
} else {
  console.warn('⚠️  MONGODB_URI non définie — base de données désactivée (mode JSON seul)');
}

import Contact from './models/Contact.js';
import Member from './models/Member.js';
import Event from './models/Event.js';
import Project from './models/Project.js';
import Conversation from './models/Conversation.js';

const PORT = process.env.PORT || 3001;

/* ── Vérification clé API au démarrage ── */
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'METS_TA_CLE_ICI') {
  if (process.env.VERCEL) {
    console.warn('⚠️  ANTHROPIC_API_KEY manquante sur Vercel — NIA fonctionnera en mode JSON uniquement');
    console.warn('   → Ajoute ANTHROPIC_API_KEY dans Vercel Dashboard > Settings > Environment Variables');
  } else {
    console.error('\n❌ ANTHROPIC_API_KEY manquante dans server/.env');
    console.error('   → Va sur https://console.anthropic.com → API Keys → Create Key');
    console.error('   → Colle la clé dans server/.env\n');
    process.exit(1);
  }
}

/* ── Chargement des données CIAT ── */
let knowledge = {};
try {
  /* Sur Vercel (bundle esbuild), import.meta.url pointe vers le bundle — on utilise process.cwd() */
  const knowledgePath = process.env.VERCEL
    ? join(process.cwd(), 'server', 'ciat-knowledge.json')
    : join(__dirname, 'ciat-knowledge.json');
  knowledge = JSON.parse(readFileSync(knowledgePath, 'utf-8'));
  console.log('✅ Base de connaissances CIAT chargée');
} catch {
  console.warn('⚠️  ciat-knowledge.json introuvable, NIA fonctionnera sans données CIAT');
}

const client = (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'METS_TA_CLE_ICI')
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/* ── Prompt NIA — MongoDB + JSON simultanément ── */
let promptCache = null;
let promptCachedAt = 0;
const PROMPT_TTL = 30_000;

const buildPrompt = async () => {
  const k = knowledge; // JSON — toujours chargé

  /* ── Lecture MongoDB (best-effort, ne bloque pas si indispo) ── */
  let dbMembers = [], dbEvents = [], dbProjects = [];
  try {
    [dbMembers, dbEvents, dbProjects] = await Promise.all([
      Member.find({ active: true }).sort({ order: 1 }).lean(),
      Event.find({ status: 'upcoming' }).sort({ order: 1 }).lean(),
      Project.find({ active: true }).sort({ order: 1 }).lean(),
    ]);
  } catch {
    console.warn('⚠️  MongoDB indisponible — JSON seul actif pour ce cycle');
  }

  /* ── Section BUREAU : MongoDB (bilingue, live) + JSON (détails : téléphone, rôle complet) ── */
  const jsonBureau = k.bureau_executif ?? [];
  const bureauSection = jsonBureau.map(jm => {
    const db = dbMembers.find(d => d.name === jm.nom);
    const role = db?.role?.fr || jm.poste;
    const bio  = db?.bio?.fr  || jm.role_ciat;
    return `  • ${role} : ${jm.nom} (${jm.profession}, ${jm.age} ans)\n    → ${bio}`;
  }).join('\n');

  /* ── Section ÉVÉNEMENTS : MongoDB (bilingue, live) + JSON (public cible, inscription) ── */
  const jsonEvents = k.evenements?.a_venir ?? [];
  let eventsSection = '';
  if (dbEvents.length) {
    eventsSection = dbEvents.map(e => {
      const jEv = jsonEvents.find(j => j.titre?.includes(e.title?.fr?.slice(0, 10)));
      const extra = jEv ? ` | Public: ${jEv.public_cible || 'Tous'} | Inscription: ${jEv.inscription || 'Via formulaire'}` : '';
      return `  • ${e.date?.fr} — ${e.title?.fr} [${e.tag?.fr}] à ${e.location}${extra}`;
    }).join('\n');
  } else {
    eventsSection = jsonEvents.map(e =>
      `  • ${e.date} — ${e.titre} [${e.type}] à ${e.lieu} | Public: ${e.public_cible || 'Tous'}`
    ).join('\n');
  }

  /* ── Section PROJETS : MongoDB (bilingue, live) + JSON (technologie, détails) ── */
  const jsonProjets = k.projets ?? [];
  let projetsSection = '';
  if (dbProjects.length) {
    projetsSection = dbProjects.map(p => {
      const jP = jsonProjets.find(j => j.titre?.includes(p.title?.fr?.slice(0, 8)));
      const tech = jP?.technologie ? ` | Tech: ${jP.technologie}` : '';
      return `  • ${p.title?.fr} [${p.status}] : ${p.desc?.fr}${tech}`;
    }).join('\n');
  } else {
    projetsSection = jsonProjets.map(p =>
      `  • ${p.titre} [${p.statut}] : ${p.description}${p.technologie ? ` | Tech: ${p.technologie}` : ''}`
    ).join('\n');
  }

  /* ── Données enrichies JSON ── */
  const faq        = k.faq?.map(f => `  Q: ${f.question}\n  R: ${f.reponse}`).join('\n') ?? '';
  const ressources = k.ressources_ia?.map(r => `  • [${r.niveau}] ${r.titre} : ${r.description}`).join('\n') ?? '';
  const valeurs    = k.valeurs?.map(v => `  • ${v.titre} : ${v.description}`).join('\n') ?? '';
  const adhesion   = [
    k.adhesion?.comment_rejoindre,
    `Avantages : ${k.adhesion?.avantages?.join(' | ')}`,
    k.adhesion?.cotisation,
  ].filter(Boolean).join('\n  ');

  const salaams   = k.salutations?.arabe_tchadien;
  const expFr     = k.salutations?.francais_tchadien?.expressions?.map(e => `  • "${e.expression}" : ${e.signification}`).join('\n') ?? '';
  const traits    = k.personnalite_nia?.traits_de_caractere?.map(t => `• ${t}`).join('\n') ?? '';
  const styleComm = k.personnalite_nia?.style_communication?.map(s => `• ${s}`).join('\n') ?? '';
  const capacites = k.capacites_nia?.ce_que_nia_peut_faire?.map(c => `• ${c}`).join('\n') ?? '';
  const iaOppor   = k.ia_en_afrique?.opportunites_cles?.map(o => `  • ${o.domaine} : ${o.impact}`).join('\n') ?? '';
  const iaInitiat = k.ia_en_afrique?.initiatives_africaines_inspirantes?.map(i => `  • ${i.nom} : ${i.description}`).join('\n') ?? '';
  const proverbes = k.culture_tchadienne?.proverbes_tchadiens?.map(p => `  • "${p.proverbe}" — ${p.lecon}`).join('\n') ?? '';
  const the_info  = k.culture_tchadienne?.the_tchadien;

  const prompt = `Tu es NIA (N'djamena Intelligence Artificielle) — l'IA officielle de la CIAT, première IA communautaire du Tchad.
${k.personnalite_nia?.qui_est_nia}

NE MENTIONNE JAMAIS Claude, GPT, Anthropic ou toute autre IA. Si on te demande : "Je suis NIA, l'IA de la CIAT 🧠"
Réponds TOUJOURS dans la langue de l'utilisateur (français, anglais, ou arabe tchadien si possible).

== PERSONNALITE ==
${traits}

== STYLE DE COMMUNICATION ==
${styleComm}

== CE QUE TU SAIS FAIRE ==
${capacites}

== CULTURE ET LANGUES TCHADIENNES ==
Arabe tchadien — langue la plus parlée au Tchad :
  Bonjour : "${salaams?.bonjour}" | Réponse : "${salaams?.reponse_bonjour}"
  Matin : "${salaams?.bonjour_matin}" | Réponse : "${salaams?.reponse_matin}"
  Comment ça va : "${salaams?.comment_ca_va}" | Réponse : "${salaams?.ca_va_bien}"
  Merci : "${salaams?.merci}" | Au revoir : "${salaams?.au_revoir}" | Bienvenue : "${salaams?.bienvenue}"
  Expressions clés : ${salaams?.expressions_courantes?.join(' — ')}

Expressions français tchadien :
${expFr}

Le thé tchadien (shaï) — rituel social fondamental :
  "${the_info?.ritual}" | Signification : ${the_info?.signification}

Proverbes tchadiens :
${proverbes}

== CIAT — DONNÉES OFFICIELLES ==
${k.organisation?.nom} | Email : ${k.organisation?.email} | N'Djamena, Tchad
Mission : ${k.organisation?.mission}
Vision : ${k.organisation?.vision}
Chiffres : ${k.statistiques?.membres} membres | ${k.statistiques?.evenements_organises} événements | ${k.statistiques?.projets_actifs} projets actifs

BUREAU EXECUTIF :
${bureauSection}

PROCHAINS EVENEMENTS :
${eventsSection}

PROJETS :
${projetsSection}

VALEURS :
${valeurs}

REJOINDRE LA CIAT :
  ${adhesion}

RESSOURCES IA POUR APPRENANTS :
${ressources}

FAQ :
${faq}

== IA EN AFRIQUE — TON DOMAINE D'EXPERTISE ==
${k.ia_en_afrique?.contexte}

Opportunités clés pour l'Afrique :
${iaOppor}

Initiatives africaines inspirantes :
${iaInitiat}

Tchad & IA : ${k.ia_en_afrique?.tchad_et_ia?.potentiel}
Rôle de la CIAT : ${k.ia_en_afrique?.tchad_et_ia?.role_ciat}

== REGLES ==
1. Questions CIAT → utilise uniquement les données ci-dessus, n'invente rien
2. Toutes autres questions → réponds librement, complètement, avec profondeur et intelligence
3. Info CIAT manquante → "Je n'ai pas cette info, contacte contact@ciat-tchad.org 📧"
4. Fais le lien avec le Tchad/l'Afrique quand pertinent, encourage à rejoindre la CIAT
5. Sois profond(e) et nuancé(e) — analyse, nuance, approfondis, ne reste pas en surface`;

  return prompt;
};

const getSystemPrompt = async () => {
  const now = Date.now();
  if (promptCache && (now - promptCachedAt) < PROMPT_TTL) return promptCache;
  promptCache = await buildPrompt();
  promptCachedAt = now;
  console.log(`🔄 Prompt NIA rafraîchi (~${Math.round(promptCache.length / 4)} tokens)`);
  return promptCache;
};

buildPrompt().then(p => {
  promptCache = p;
  promptCachedAt = Date.now();
  console.log(`✅ Prompt NIA prêt (MongoDB + JSON, ~${Math.round(p.length / 4)} tokens)`);
}).catch(() => console.warn('⚠️  Prompt NIA démarré en mode dégradé'));

/* ── App Express ── */
const app = express();

/* En production Vercel le frontend et le backend sont sur le même domaine
   (pas de CORS needed). En local on liste les origines de dev. */
const devOrigins = ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : devOrigins;

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(null, false)),
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '1mb' }));

/* ── Recherche fallback dans le JSON quand l'API Claude est indisponible ── */
const fallbackFromJSON = (userMsg) => {
  const msg = (userMsg || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const k   = knowledge;
  const has = (...words) => words.some(w => msg.includes(w));

  /* Salutations */
  if (has('salaam', 'bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'hey', 'coucou', 'mbay', 'labass')) {
    return `Salaam alaykoum ! 👋 Je suis NIA, l'IA de la CIAT.\nJe suis là pour toutes tes questions sur la CIAT, l'IA ou n'importe quel autre sujet. Comment puis-je t'aider ? 🧠`;
  }

  /* Qui est NIA */
  if (has('qui es', 'tu es', 'c\'est quoi nia', 'presente', 'toi')) {
    return `Je suis **NIA** (N'djamena Intelligence Artificielle), l'IA officielle de la CIAT 🇹🇩\nPremière IA communautaire du Tchad — je connais tout sur la CIAT, l'IA et bien plus. *On est ensemble !*`;
  }

  /* FAQ — recherche par mots-clés (>= 2 mots communs de 4+ lettres) */
  const words4 = msg.split(/\s+/).filter(w => w.length >= 4);
  const faqMatch = k.faq?.find(f => {
    const txt = (f.question + ' ' + f.reponse).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return words4.filter(w => txt.includes(w)).length >= 2;
  });
  if (faqMatch) return faqMatch.reponse;

  /* Événements */
  if (has('event', 'evenement', 'atelier', 'hackathon', 'conference', 'agenda', 'programme', 'prochain', 'date')) {
    const evs = k.evenements?.a_venir ?? [];
    if (evs.length) {
      const list = evs.map(e => `• **${e.titre}** — ${e.date} à ${e.lieu} [${e.type}]`).join('\n');
      return `Prochains événements de la CIAT :\n\n${list}\n\nPour t'inscrire → formulaire de contact sur le site 🎯`;
    }
  }

  /* Membre spécifique */
  const memberHit = k.bureau_executif?.find(m =>
    m.nom.toLowerCase().split(' ').some(part => part.length > 3 && msg.includes(part))
  );
  if (memberHit) {
    return `**${memberHit.nom}** — ${memberHit.poste}\n${memberHit.role_ciat}\n_(${memberHit.profession}, ${memberHit.age} ans)_`;
  }

  /* Bureau / équipe */
  if (has('president', 'bureau', 'equipe', 'secretaire', 'tresorier', 'membre', 'directeur')) {
    const list = (k.bureau_executif ?? []).map(m => `• **${m.nom}** — ${m.poste} (${m.profession}, ${m.age} ans)`).join('\n');
    return `Bureau exécutif de la CIAT :\n\n${list}\n\nContacte-les via **contact@ciat-tchad.org** 📧`;
  }

  /* Projets */
  if (has('projet', 'chatbot', 'sante', 'site web', 'technologie', 'initiative')) {
    const list = (k.projets ?? []).map(p => `• **${p.titre}** [${p.statut}]\n  ${p.description}`).join('\n\n');
    return `Projets de la CIAT :\n\n${list}`;
  }

  /* Adhésion / rejoindre */
  if (has('rejoindre', 'adherer', 'inscription', 'integrer', 'comment devenir', 'devenir membre')) {
    const avantages = k.adhesion?.avantages?.map(a => `• ${a}`).join('\n') ?? '';
    return `Pour rejoindre la CIAT :\n\n${k.adhesion?.comment_rejoindre}\n\n**Avantages membres :**\n${avantages}\n\n${k.adhesion?.cotisation}`;
  }

  /* Contact */
  if (has('contact', 'email', 'joindre', 'ecrire', 'telephone')) {
    return `**Contact CIAT :**\n\n📧 ${k.contact?.email_principal}\n📍 ${k.contact?.adresse}\n\nFormulaire disponible sur le site officiel.\n${k.contact?.urgence}`;
  }

  /* IA / apprentissage */
  if (has('intelligence artificielle', 'machine learning', 'deep learning', 'apprendre', 'formation', 'coder')) {
    const r = k.ressources_ia?.[0];
    return `Pour apprendre l'IA 🧠 :\n\n${r?.description ?? ''}\n\nLa CIAT organise des ateliers adaptés à tous les niveaux — rejoins-nous !`;
  }

  /* Tchad / culture */
  if (has('tchad', 'ndjamena', 'culture', 'the', 'shai', 'proverbe')) {
    const the = k.culture_tchadienne?.the_tchadien;
    return `Le Tchad est riche en culture 🇹🇩\n\n**Le thé tchadien (shaï) :** ${the?.ritual}\n${the?.signification}\n\nUn proverbe : *"${k.culture_tchadienne?.proverbes_tchadiens?.[0]?.proverbe}"*`;
  }

  /* Défaut — toujours une réponse */
  return `Je suis NIA, l'IA de la CIAT 🧠\n\nJe consulte mes données pour te répondre au mieux. Pour une question précise sur la CIAT, écris-nous à **contact@ciat-tchad.org** ou utilise le formulaire de contact sur le site.\n\n*On est ensemble !* 🇹🇩`;
};

/* ── POST /api/chat — streaming SSE ── */
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages invalides' });
  }

  /* Filtrer et valider les messages */
  const cleanMessages = messages
    .filter(m => m.role && m.content && typeof m.content === 'string' && m.content.trim())
    .slice(-20)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content.trim() }));

  if (cleanMessages.length === 0) {
    return res.status(400).json({ error: 'Aucun message valide' });
  }

  /* Headers SSE */
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  /* Keepalive pour éviter timeout */
  const keepalive = setInterval(() => res.write(': ping\n\n'), 15000);

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    if (!client) throw new Error('ANTHROPIC_API_KEY non configurée');
    const systemPrompt = await getSystemPrompt();
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: cleanMessages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        send({ text: event.delta.text });
      }
    }

    send({ done: true });
  } catch (err) {
    /* Log l'erreur en console — jamais affiché à l'utilisateur */
    console.error(`⚠️  Claude API indisponible [${err.status ?? 'ERR'}]: ${err.message}`);
    /* Fallback : NIA répond depuis le JSON */
    const lastUser = cleanMessages.filter(m => m.role === 'user').pop()?.content ?? '';
    const fallback = fallbackFromJSON(lastUser);
    /* On simule un stream mot par mot pour garder l'effet visuel */
    for (const chunk of fallback.split(/(?<=\s)/)) {
      send({ text: chunk });
    }
    send({ done: true });
  } finally {
    clearInterval(keepalive);
    res.end();
  }
});

/* ── GET /api/knowledge ── */
app.get('/api/knowledge', (_req, res) => res.json(knowledge));

/* ── POST /api/contact — sauvegarde message formulaire ── */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const contact = await Contact.create({ name: name.trim(), email: email.trim(), message: message.trim() });
    console.log(`📩 Nouveau message de ${contact.name} (${contact.email})`);
    res.json({ success: true, id: contact._id });
  } catch (err) {
    console.error('Erreur contact:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/contact — liste des messages (usage interne) ── */
app.get('/api/contact', async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/members ── */
app.get('/api/members', async (_req, res) => {
  try {
    const members = await Member.find({ active: true }).sort({ order: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/events?status=upcoming|past ── */
app.get('/api/events', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : { status: 'upcoming' };
    const events = await Event.find(filter).sort({ order: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/projects ── */
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find({ active: true }).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── POST /api/conversations — sauvegarde conversation NIA ── */
app.post('/api/conversations', async (req, res) => {
  try {
    const { sessionId, title, messages, lang } = req.body;
    if (!sessionId || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'sessionId et messages requis' });
    }
    const conv = await Conversation.findOneAndUpdate(
      { sessionId },
      { title, messages, lang },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, id: conv._id });
  } catch (err) {
    console.error('Erreur conversation:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/conversations/:sessionId ── */
app.get('/api/conversations/:sessionId', async (req, res) => {
  try {
    const conv = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (!conv) return res.status(404).json({ error: 'Conversation introuvable' });
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ── GET /api/health ── */
app.get('/api/health', async (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    nia: 'online',
    model: 'claude-sonnet-4-6',
    knowledge: Object.keys(knowledge).length > 0,
    database: dbStatus,
  });
});

/* Sur Vercel, le frontend est servi par le CDN Vercel (via @vercel/static-build).
   Express gère uniquement les routes /api/*. */

/* ── Export pour Vercel serverless ── */
export default app;

/* ── Démarrage serveur local (ignoré sur Vercel) ── */
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Serveur NIA démarré → http://localhost:${PORT}`);
    console.log(`   Health : http://localhost:${PORT}/api/health\n`);
  });

  /* Arrêt propre pour node --watch */
  const shutdown = () => {
    if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
    server.close();
    mongoose.disconnect().catch(() => {});
    process.exit(0);
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT',  shutdown);
}

/* Empêche les erreurs async non gérées de crasher le serveur */
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Rejet non géré (non fatal):', reason?.message ?? reason);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️  Exception non gérée (non fatal):', err.message);
});
