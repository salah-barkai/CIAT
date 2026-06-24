import { Routes, Route, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatPage from './pages/ChatPage';
import './App.css';
import './pages/ChatPage.css';

function SitePage() {
  const navigate = useNavigate();
  const openChat = () => navigate('/chat');

  return (
    <div className="app">
      <Header onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} />
        <About />
        <Events />
        <Team />
        <Contact />
      </main>
      <Footer />

      <button
        className="chatbot__fab"
        onClick={openChat}
        aria-label="Ouvrir NIA"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="chatbot__fab-pulse" />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<SitePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </LanguageProvider>
  );
}
