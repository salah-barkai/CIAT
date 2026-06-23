import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import ciatLogo from '@logo/CIAT_logo_transparent.png';

export default function Header({ onOpenChat }) {
  const { lang, t, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <a className="header__logo" onClick={() => scrollTo('home')}>
          <img src={ciatLogo} alt="CIAT Logo" className="header__logo-img" />
        </a>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          {['home', 'about', 'events', 'team', 'contact'].map(id => (
            <button key={id} className="header__nav-link" onClick={() => scrollTo(id)}>
              {t.nav[id]}
            </button>
          ))}
          <button className="header__nav-chat" onClick={() => { onOpenChat(); setMenuOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {t.nav.chatbot}
          </button>
        </nav>

        <div className="header__actions">
          <button className="header__lang" onClick={toggleLang} aria-label="Switch language">
            <span className={lang === 'fr' ? 'active' : ''}>FR</span>
            <span className="header__lang-sep">|</span>
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
          </button>
          <button className="header__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
