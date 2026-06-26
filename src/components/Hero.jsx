import { useLang } from '../context/LanguageContext';
import ciatLogo from '@logo/ciat_logo.jpeg';

const stats = [
  { value: '25', key: 'members' },
  { value: '5', key: 'events' },
  { value: '12', key: 'projects' },
  { value: '1', key: 'cities' },
];

export default function Hero({ onOpenChat }) {
  const { t } = useLang();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="hero">
      <div className="hero__bg">
        <div className="hero__grid" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">{t.hero.badge}</span>
          <h1 className="hero__title">
            {t.hero.title}<br />
            <span className="gradient-text">{t.hero.titleHighlight}</span>
          </h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={() => scrollTo('contact')}>
              {t.hero.cta}
            </button>
            <button className="btn btn--ghost btn--lg" onClick={onOpenChat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card">

            {/* ── Header NIA ── */}
            <div className="hero__card-header">
              <div className="hero__nia-avatar">
                <img src={ciatLogo} alt="NIA" />
                <span className="hero__nia-online" />
              </div>
              <div className="hero__nia-info">
                <span className="hero__nia-name">NIA</span>
                <span className="hero__nia-sub">N'djamena Intelligence Artificielle</span>
              </div>
              <span className="hero__nia-badge">
                <svg viewBox="0 0 10 10" width="8" height="8"><circle cx="5" cy="5" r="5" fill="#10b981"/></svg>
                En ligne
              </span>
            </div>

            {/* ── Messages ── */}
            <div className="hero__card-body">
              <div className="hero__msg hero__msg--ai">
                <div className="hero__msg-avatar">
                  <img src={ciatLogo} alt="NIA" />
                </div>
                <div className="hero__msg-bubble">
                  Salut ! Je suis <strong>NIA</strong>, l'IA de la CIAT 🧠<br/>
                  Pose-moi n'importe quelle question !
                </div>
              </div>

              <div className="hero__msg hero__msg--user">
                <div className="hero__msg-bubble">
                  Comment débuter en Machine Learning ?
                </div>
              </div>

              <div className="hero__msg hero__msg--ai">
                <div className="hero__msg-avatar">
                  <img src={ciatLogo} alt="NIA" />
                </div>
                <div className="hero__msg-bubble hero__msg-bubble--reply">
                  Commence par <strong>Python</strong> + les maths de base, puis explore <strong>scikit-learn</strong>…
                  <div className="hero__msg-bubble--typing"><span/><span/><span/></div>
                </div>
              </div>
            </div>

            {/* ── Chips suggestions ── */}
            <div className="hero__card-chips">
              <span>🌍 IA en Afrique</span>
              <span>💻 Coder en Python</span>
              <span>🔮 Futur de la tech</span>
            </div>

            {/* ── CTA ── */}
            <button className="hero__card-cta" onClick={onOpenChat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Discuter avec NIA
            </button>
          </div>
        </div>
      </div>

      <div className="hero__stats container">
        {stats.map(s => (
          <div key={s.key} className="hero__stat">
            <span className="hero__stat-value gradient-text">{s.value}</span>
            <span className="hero__stat-label">{t.hero.stats[s.key]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
