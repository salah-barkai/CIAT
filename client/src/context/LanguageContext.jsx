import { createContext, useContext, useState } from 'react';

const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      events: 'Événements',
      team: 'Équipe',
      contact: 'Contact',
      chatbot: 'Assistant IA',
    },
    hero: {
      badge: 'Communauté IA au Tchad',
      title: "L'Intelligence Artificielle",
      titleHighlight: 'au service du Tchad',
      subtitle: 'La CIAT rassemble les passionnés d\'IA, développeurs et chercheurs pour bâtir un écosystème technologique fort en Afrique centrale.',
      cta: 'Rejoindre la communauté',
      ctaSecondary: 'En savoir plus',
      stats: {
        members: 'Membres',
        events: 'Événements',
        projects: 'Projets',
        cities: 'Villes',
      },
    },
    about: {
      badge: 'Notre mission',
      title: 'Qui sommes-nous ?',
      description1: 'La CIAT (Communauté d\'Intelligence Artificielle au Tchad) est une organisation à but non lucratif fondée pour démocratiser l\'accès à l\'IA au Tchad et en Afrique centrale.',
      description2: 'Nous organisons des ateliers, hackathons, conférences et formations pour permettre à chacun de comprendre et d\'utiliser l\'intelligence artificielle.',
      values: [
        { title: 'Accessibilité', desc: 'Rendre l\'IA accessible à tous, quels que soient le niveau et le parcours.' },
        { title: 'Innovation', desc: 'Encourager des solutions IA adaptées aux défis locaux africains.' },
        { title: 'Communauté', desc: 'Construire un réseau solide de talents tech au Tchad.' },
        { title: 'Impact', desc: 'Utiliser l\'IA pour améliorer la vie des citoyens tchadiens.' },
      ],
    },
    events: {
      badge: 'Agenda',
      title: 'Prochains événements',
      subtitle: 'Rejoignez-nous pour des ateliers, hackathons et conférences sur l\'IA.',
      items: [
        { date: '15 Juil 2026', title: 'Atelier de sensibilisation sur l\'IA', desc: 'Sensibilisation des membres de la CIAT aux fondamentaux de l\'intelligence artificielle : enjeux, opportunités et applications concrètes en Afrique.', tag: 'Atelier', location: 'N\'Djamena' },
        { date: '22 Juil 2026', title: 'Accompagnement projet Santé', desc: 'Accompagnement et suivi d\'un projet innovant utilisant l\'IA pour améliorer l\'accès aux soins et le diagnostic médical au Tchad.', tag: 'Projet', location: 'N\'Djamena' },
        { date: '5 Août 2026', title: 'Déploiement du chatbot CIAT', desc: 'Mise en production officielle du chatbot IA de la CIAT sur le site web de la communauté — une première au Tchad !', tag: 'Lancement', location: 'N\'Djamena' },
      ],
      register: 'S\'inscrire',
    },
    team: {
      badge: 'Notre équipe',
      title: 'Bureau Exécutif',
      subtitle: 'Les membres du bureau exécutif qui dirigent la CIAT et portent sa vision.',
      members: [
        { name: 'Kally Hassan Mahat', role: 'Président', bio: 'Comptable, 26 ans. Il assure la présidence et la vision stratégique de la CIAT.' },
        { name: 'Abbas Adam Abbas', role: 'Secrétaire Général', bio: 'Ingénieur, 28 ans. Coordonne les activités administratives et opérationnelles de la communauté.' },
        { name: 'Bilong Brenda', role: 'Trésorière Générale', bio: 'Manager, 25 ans. Responsable de la gestion financière et budgétaire de la CIAT.' },
        { name: 'FAT-HI Mahadi Mahamat', role: 'Chargé des Projets & Programmes', bio: 'Ingénieur, 27 ans. Pilote les projets et programmes technologiques de la communauté.' },
        { name: 'Mbaillassem Séverin', role: 'Chargé de Communication', bio: 'Community Manager, 26 ans. Gère la communication et la présence digitale de la CIAT.' },
        { name: 'Tahir Ergoulet', role: 'Chargé de Formation & IA', bio: 'Ingénieur, 29 ans. Développe les programmes de formation en intelligence artificielle.' },
      ],
    },
    contact: {
      badge: 'Nous contacter',
      title: 'Rejoignez la communauté',
      subtitle: 'Une question ? Envie de collaborer ? Nous sommes là.',
      form: {
        name: 'Votre nom',
        email: 'Votre email',
        message: 'Votre message',
        send: 'Envoyer le message',
        success: 'Message envoyé ! Nous vous répondrons bientôt.',
      },
      info: {
        location: 'N\'Djamena, Tchad',
        email: 'contact@ciat-tchad.org',
        social: 'Suivez-nous',
      },
    },
    chatbot: {
      title: 'NIA',
      subtitle: 'Cerveau IA de la CIAT',
      placeholder: 'Parlez à NIA...',
      welcome: 'Salut ! Je suis **NIA**, le cerveau IA de la CIAT 🧠\n\nJe connais tout sur la communauté, les membres du bureau, les événements et l\'IA en général. Posez-moi n\'importe quelle question — je suis là pour vous ! 🚀',
      send: 'Envoyer',
      thinking: 'NIA réfléchit...',
      newChat: 'Nouvelle conversation',
    },
    footer: {
      description: 'La Communauté d\'Intelligence Artificielle au Tchad — bâtir l\'avenir numérique de l\'Afrique centrale.',
      links: 'Liens rapides',
      follow: 'Nous suivre',
      rights: 'Tous droits réservés.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      events: 'Events',
      team: 'Team',
      contact: 'Contact',
      chatbot: 'AI Assistant',
    },
    hero: {
      badge: 'AI Community in Chad',
      title: 'Artificial Intelligence',
      titleHighlight: 'for Chad\'s Future',
      subtitle: 'CIAT brings together AI enthusiasts, developers, and researchers to build a strong tech ecosystem in Central Africa.',
      cta: 'Join the community',
      ctaSecondary: 'Learn more',
      stats: {
        members: 'Members',
        events: 'Events',
        projects: 'Projects',
        cities: 'Cities',
      },
    },
    about: {
      badge: 'Our mission',
      title: 'Who are we?',
      description1: 'CIAT (Communauté d\'Intelligence Artificielle au Tchad) is a non-profit organization founded to democratize access to AI in Chad and Central Africa.',
      description2: 'We organize workshops, hackathons, conferences, and training sessions to help everyone understand and use artificial intelligence.',
      values: [
        { title: 'Accessibility', desc: 'Making AI accessible to everyone, regardless of background or level.' },
        { title: 'Innovation', desc: 'Encouraging AI solutions tailored to local African challenges.' },
        { title: 'Community', desc: 'Building a strong network of tech talent in Chad.' },
        { title: 'Impact', desc: 'Using AI to improve the lives of Chadian citizens.' },
      ],
    },
    events: {
      badge: 'Agenda',
      title: 'Upcoming Events',
      subtitle: 'Join us for workshops, hackathons, and conferences on AI.',
      items: [
        { date: 'Jul 15, 2026', title: 'AI Awareness Workshop', desc: 'Raising awareness among CIAT members about AI fundamentals: challenges, opportunities, and concrete applications in Africa.', tag: 'Workshop', location: 'N\'Djamena' },
        { date: 'Jul 22, 2026', title: 'Health Project Support', desc: 'Support and follow-up of an innovative project using AI to improve access to healthcare and medical diagnosis in Chad.', tag: 'Project', location: 'N\'Djamena' },
        { date: 'Aug 5, 2026', title: 'CIAT Chatbot Launch', desc: 'Official deployment of the CIAT AI chatbot on the community website — a first in Chad!', tag: 'Launch', location: 'N\'Djamena' },
      ],
      register: 'Register',
    },
    team: {
      badge: 'Our team',
      title: 'Executive Board',
      subtitle: 'The executive board members who lead CIAT and carry its vision.',
      members: [
        { name: 'Kally Hassan Mahat', role: 'President', bio: 'Accountant, 26. He leads the presidency and strategic vision of CIAT.' },
        { name: 'Abbas Adam Abbas', role: 'Secretary General', bio: 'Engineer, 28. Coordinates the administrative and operational activities of the community.' },
        { name: 'Bilong Brenda', role: 'General Treasurer', bio: 'Manager, 25. Responsible for the financial and budgetary management of CIAT.' },
        { name: 'FAT-HI Mahadi Mahamat', role: 'Head of Projects & Programs', bio: 'Engineer, 27. Leads the technological projects and programs of the community.' },
        { name: 'Mbaillassem Séverin', role: 'Head of Communication', bio: 'Community Manager, 26. Manages CIAT\'s communication and digital presence.' },
        { name: 'Tahir Ergoulet', role: 'Head of Training & AI', bio: 'Engineer, 29. Develops artificial intelligence training programs.' },
      ],
    },
    contact: {
      badge: 'Contact us',
      title: 'Join the community',
      subtitle: 'A question? Want to collaborate? We\'re here.',
      form: {
        name: 'Your name',
        email: 'Your email',
        message: 'Your message',
        send: 'Send message',
        success: 'Message sent! We\'ll get back to you soon.',
      },
      info: {
        location: 'N\'Djamena, Chad',
        email: 'contact@ciat-tchad.org',
        social: 'Follow us',
      },
    },
    chatbot: {
      title: 'NIA',
      subtitle: 'CIAT\'s AI Brain',
      placeholder: 'Talk to NIA...',
      welcome: 'Hey! I\'m **NIA**, the AI brain of CIAT 🧠\n\nI know everything about the community, the executive board, upcoming events, and AI in general. Ask me anything — I\'m here for you! 🚀',
      send: 'Send',
      thinking: 'Thinking...',
      newChat: 'New chat',
    },
    footer: {
      description: 'The Artificial Intelligence Community of Chad — building the digital future of Central Africa.',
      links: 'Quick links',
      follow: 'Follow us',
      rights: 'All rights reserved.',
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === 'fr' ? 'en' : 'fr');
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
