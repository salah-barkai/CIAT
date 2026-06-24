import { useLang } from '../context/LanguageContext';
import ciatLogo from '@logo/CIAT_logo_transparent.png';

export default function Footer() {
  const { t } = useLang();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={ciatLogo} alt="CIAT Logo" style={{height: '36px', width: 'auto'}} />
          </div>
          <p className="footer__desc">{t.footer.description}</p>
        </div>

        <div className="footer__links">
          <h4>{t.footer.links}</h4>
          <nav>
            {['home', 'about', 'events', 'team', 'contact'].map(id => (
              <button key={id} onClick={() => scrollTo(id)}>{t.nav[id]}</button>
            ))}
          </nav>
        </div>

        <div className="footer__social">
          <h4>{t.footer.follow}</h4>
          <div className="footer__social-links">
            <a href="https://www.facebook.com/profile.php?id=61586149312269" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--facebook">
              <span className="footer__social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </span>
              <span className="footer__social-text">
                <span className="footer__social-name">Facebook</span>
                <span className="footer__social-desc">CIAT Tchad</span>
              </span>
            </a>
            <a href="https://www.tiktok.com/@ciat06" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--tiktok">
              <span className="footer__social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
              </span>
              <span className="footer__social-text">
                <span className="footer__social-name">@ciat06</span>
                <span className="footer__social-desc">Contenus IA & Tech</span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} CIAT — {t.footer.rights}</p>
      </div>
    </footer>
  );
}
