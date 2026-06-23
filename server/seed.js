import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import mongoose from 'mongoose';
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Member from './models/Member.js';
import Event from './models/Event.js';
import Project from './models/Project.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: join(__dirname, '.env') });

const members = [
  {
    name: 'Kally Hassan Mahat', order: 1,
    role: { fr: 'Président', en: 'President' },
    profession: 'Comptable', age: 26,
    bio: {
      fr: 'Comptable, 26 ans. Il assure la présidence et la vision stratégique de la CIAT.',
      en: 'Accountant, 26. He leads the presidency and strategic vision of CIAT.',
    },
    photo: '/members/kally.jpeg',
  },
  {
    name: 'Abbas Adam Abbas', order: 2,
    role: { fr: 'Secrétaire Général', en: 'Secretary General' },
    profession: 'Ingénieur', age: 28,
    bio: {
      fr: 'Ingénieur, 28 ans. Coordonne les activités administratives et opérationnelles de la communauté.',
      en: 'Engineer, 28. Coordinates the administrative and operational activities of the community.',
    },
    photo: '/members/abbas.png',
  },
  {
    name: 'Bilong Brenda', order: 3,
    role: { fr: 'Trésorière Générale', en: 'General Treasurer' },
    profession: 'Manager', age: 25,
    bio: {
      fr: 'Manager, 25 ans. Responsable de la gestion financière et budgétaire de la CIAT.',
      en: 'Manager, 25. Responsible for the financial and budgetary management of CIAT.',
    },
    photo: '/members/brenda.jpeg',
  },
  {
    name: 'FAT-HI Mahadi Mahamat', order: 4,
    role: { fr: 'Chargé des Projets & Programmes', en: 'Head of Projects & Programs' },
    profession: 'Ingénieur', age: 27,
    bio: {
      fr: 'Ingénieur, 27 ans. Pilote les projets et programmes technologiques de la communauté.',
      en: 'Engineer, 27. Leads the technological projects and programs of the community.',
    },
    photo: '/members/fatih.jpeg',
  },
  {
    name: 'Mbaillassem Séverin', order: 5,
    role: { fr: 'Chargé de Communication', en: 'Head of Communication' },
    profession: 'Community Manager', age: 26,
    bio: {
      fr: 'Community Manager, 26 ans. Gère la communication et la présence digitale de la CIAT.',
      en: 'Community Manager, 26. Manages CIAT\'s communication and digital presence.',
    },
    photo: '/members/severin.png',
  },
  {
    name: 'Tahir Ergoulet', order: 6,
    role: { fr: 'Chargé de Formation & IA', en: 'Head of Training & AI' },
    profession: 'Ingénieur', age: 29,
    bio: {
      fr: 'Ingénieur, 29 ans. Développe les programmes de formation en intelligence artificielle.',
      en: 'Engineer, 29. Develops artificial intelligence training programs.',
    },
    photo: '/members/tahir.jpeg',
  },
];

const events = [
  {
    date: { fr: '15 Juil 2026', en: 'Jul 15, 2026' },
    title: { fr: "Atelier de sensibilisation sur l'IA", en: 'AI Awareness Workshop' },
    desc: {
      fr: "Sensibilisation des membres de la CIAT aux fondamentaux de l'intelligence artificielle : enjeux, opportunités et applications concrètes en Afrique.",
      en: 'Raising awareness among CIAT members about AI fundamentals: challenges, opportunities, and concrete applications in Africa.',
    },
    tag: { fr: 'Atelier', en: 'Workshop' },
    location: "N'Djamena", status: 'upcoming', order: 1,
  },
  {
    date: { fr: '22 Juil 2026', en: 'Jul 22, 2026' },
    title: { fr: 'Accompagnement projet Santé', en: 'Health Project Support' },
    desc: {
      fr: "Accompagnement et suivi d'un projet innovant utilisant l'IA pour améliorer l'accès aux soins et le diagnostic médical au Tchad.",
      en: 'Support and follow-up of an innovative project using AI to improve access to healthcare and medical diagnosis in Chad.',
    },
    tag: { fr: 'Projet', en: 'Project' },
    location: "N'Djamena", status: 'upcoming', order: 2,
  },
  {
    date: { fr: '5 Août 2026', en: 'Aug 5, 2026' },
    title: { fr: 'Déploiement du chatbot CIAT', en: 'CIAT Chatbot Launch' },
    desc: {
      fr: "Mise en production officielle du chatbot IA de la CIAT sur le site web de la communauté — une première au Tchad !",
      en: 'Official deployment of the CIAT AI chatbot on the community website — a first in Chad!',
    },
    tag: { fr: 'Lancement', en: 'Launch' },
    location: "N'Djamena", status: 'upcoming', order: 3,
  },
  {
    date: { fr: '2024', en: '2024' },
    title: { fr: "Session découverte de l'IA", en: 'AI Discovery Session' },
    desc: {
      fr: "Première rencontre officielle de la CIAT avec une introduction aux concepts de base de l'IA.",
      en: 'First official CIAT meeting with an introduction to basic AI concepts.',
    },
    tag: { fr: 'Atelier', en: 'Workshop' },
    location: "N'Djamena", status: 'past', order: 4,
  },
  {
    date: { fr: '2024', en: '2024' },
    title: { fr: 'Réunion constitutive du bureau', en: 'Founding Board Meeting' },
    desc: {
      fr: 'Élection et mise en place du bureau exécutif de la CIAT.',
      en: 'Election and establishment of the CIAT executive board.',
    },
    tag: { fr: 'Assemblée', en: 'Assembly' },
    location: "N'Djamena", status: 'past', order: 5,
  },
];

const projects = [
  {
    title: { fr: 'Chatbot CIAT', en: 'CIAT Chatbot' },
    desc: {
      fr: "Développement et déploiement d'un assistant IA conversationnel sur le site web de la CIAT, propulsé par Claude d'Anthropic.",
      en: 'Development and deployment of a conversational AI assistant on the CIAT website, powered by Claude (Anthropic).',
    },
    status: 'En cours', tech: 'Claude API, React, Node.js', order: 1,
  },
  {
    title: { fr: 'IA & Santé Tchad', en: 'AI & Health Chad' },
    desc: {
      fr: "Projet d'utilisation de l'IA pour améliorer le diagnostic médical et l'accès aux soins dans les zones éloignées du Tchad.",
      en: 'Project using AI to improve medical diagnosis and access to care in remote areas of Chad.',
    },
    status: 'En accompagnement', domain: 'Santé', order: 2,
  },
  {
    title: { fr: 'Site Web CIAT', en: 'CIAT Website' },
    desc: {
      fr: "Conception et développement du site vitrine officiel de la CIAT avec chatbot intégré, bilingue français/anglais.",
      en: 'Design and development of the official CIAT showcase website with integrated chatbot, bilingual FR/EN.',
    },
    status: 'Déployé', tech: 'React, Vite, Node.js, Express', order: 3,
  },
];

async function seed() {
  console.log('🌱 Connexion MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB\n');

  const memberCount = await Member.countDocuments();
  if (memberCount === 0) {
    await Member.insertMany(members);
    console.log(`✅ ${members.length} membres insérés`);
  } else {
    console.log(`ℹ️  Membres : ${memberCount} déjà en base (skipped)`);
  }

  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany(events);
    console.log(`✅ ${events.length} événements insérés`);
  } else {
    console.log(`ℹ️  Événements : ${eventCount} déjà en base (skipped)`);
  }

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(projects);
    console.log(`✅ ${projects.length} projets insérés`);
  } else {
    console.log(`ℹ️  Projets : ${projectCount} déjà en base (skipped)`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seed terminé — toutes les collections sont prêtes !');
}

seed().catch(err => {
  console.error('❌ Erreur seed:', err.message);
  process.exit(1);
});
