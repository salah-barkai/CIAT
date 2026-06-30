import { useNavigate } from 'react-router-dom';
import ciatLogo from '@logo/ciat_logo.jpeg';
import './ChatPage.css';

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="nia-app nia-app--soon">
      <div className="nia-soon">
        <div className="nia-soon__logo">
          <img src={ciatLogo} alt="CIAT" />
        </div>

        <div className="nia-soon__badge">N'djamena Intelligence Artificielle</div>

        <h1 className="nia-soon__title">
          <span className="gradient-text">NIA</span>
        </h1>

        <div className="nia-soon__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>

        <p className="nia-soon__heading">Bientôt disponible</p>
        <p className="nia-soon__text">
          NIA est en cours de finalisation. Nous travaillons pour vous offrir
          la meilleure expérience d'assistant IA de la CIAT.
        </p>

        <button className="nia-soon__back" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Retour au site
        </button>
      </div>
    </div>
  );
}
