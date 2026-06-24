import { useLang } from '../context/LanguageContext';

const icons = [
  /* Accessibilité — réseau neuronal rayonnant vers tous */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.4" fill="currentColor" opacity="0.85"/>
    <circle cx="12"  cy="3.5" r="1.4" fill="currentColor" opacity="0.55"/>
    <circle cx="19.5" cy="7.5" r="1.4" fill="currentColor" opacity="0.55"/>
    <circle cx="19.5" cy="16.5" r="1.4" fill="currentColor" opacity="0.55"/>
    <circle cx="12"  cy="20.5" r="1.4" fill="currentColor" opacity="0.55"/>
    <circle cx="4.5" cy="16.5" r="1.4" fill="currentColor" opacity="0.55"/>
    <circle cx="4.5" cy="7.5"  r="1.4" fill="currentColor" opacity="0.55"/>
    <line x1="12" y1="9.6"  x2="12"   y2="4.9"/>
    <line x1="14" y1="10.5" x2="18.2"  y2="8.5"/>
    <line x1="14" y1="13.5" x2="18.2"  y2="15.5"/>
    <line x1="12" y1="14.4" x2="12"   y2="19.1"/>
    <line x1="10" y1="13.5" x2="5.8"  y2="15.5"/>
    <line x1="10" y1="10.5" x2="5.8"  y2="8.5"/>
    <circle cx="12" cy="12" r="7" strokeDasharray="2 2.5" strokeOpacity="0.2"/>
  </svg>,

  /* Innovation — ampoule avec circuit neuronal intérieur */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M9 21h6M10.5 17.5h3"/>
    <path d="M12 2a7 7 0 0 1 5 11.8V16H7v-2.2A7 7 0 0 1 12 2z"/>
    <circle cx="10"  cy="9.5"  r="1"   fill="currentColor" opacity="0.75"/>
    <circle cx="14"  cy="8"    r="1"   fill="currentColor" opacity="0.75"/>
    <circle cx="12.5" cy="12"  r="1"   fill="currentColor" opacity="0.75"/>
    <circle cx="9"   cy="7"   r="0.7"  fill="currentColor" opacity="0.45"/>
    <line x1="10"  y1="9.5"  x2="14"   y2="8"   strokeOpacity="0.55"/>
    <line x1="14"  y1="8"    x2="12.5"  y2="12"  strokeOpacity="0.55"/>
    <line x1="10"  y1="9.5"  x2="12.5"  y2="12"  strokeOpacity="0.45"/>
    <line x1="9"   y1="7"    x2="10"   y2="9.5" strokeOpacity="0.35"/>
    <line x1="9"   y1="7"    x2="14"   y2="8"   strokeOpacity="0.25"/>
  </svg>,

  /* Communauté — maillage hexagonal de noeuds */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="12" cy="12"  r="2"   fill="currentColor" opacity="0.9"/>
    <circle cx="12" cy="4"   r="1.5" fill="currentColor" opacity="0.55"/>
    <circle cx="19" cy="8"   r="1.5" fill="currentColor" opacity="0.55"/>
    <circle cx="19" cy="16"  r="1.5" fill="currentColor" opacity="0.55"/>
    <circle cx="12" cy="20"  r="1.5" fill="currentColor" opacity="0.55"/>
    <circle cx="5"  cy="16"  r="1.5" fill="currentColor" opacity="0.55"/>
    <circle cx="5"  cy="8"   r="1.5" fill="currentColor" opacity="0.55"/>
    <line x1="12" y1="10"   x2="12"  y2="5.5"/>
    <line x1="13.7" y1="11" x2="17.5" y2="9"/>
    <line x1="13.7" y1="13" x2="17.5" y2="15"/>
    <line x1="12" y1="14"   x2="12"  y2="18.5"/>
    <line x1="10.3" y1="13" x2="6.5"  y2="15"/>
    <line x1="10.3" y1="11" x2="6.5"  y2="9"/>
    <line x1="12"   y1="5.5"  x2="17.5" y2="9"   strokeOpacity="0.25"/>
    <line x1="17.5" y1="9"   x2="17.5" y2="15"  strokeOpacity="0.25"/>
    <line x1="17.5" y1="15"  x2="12"   y2="18.5" strokeOpacity="0.25"/>
    <line x1="12"   y1="18.5" x2="6.5"  y2="15"  strokeOpacity="0.25"/>
    <line x1="6.5"  y1="15"  x2="6.5"  y2="9"   strokeOpacity="0.25"/>
    <line x1="6.5"  y1="9"   x2="12"   y2="5.5"  strokeOpacity="0.25"/>
  </svg>,

  /* Impact — courbe montante avec noeuds et flèche */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="2" y1="20" x2="22" y2="20" strokeOpacity="0.25"/>
    <line x1="3" y1="20" x2="3"  y2="4"  strokeOpacity="0.25"/>
    <circle cx="5"  cy="17" r="1.5" fill="currentColor" opacity="0.5"/>
    <circle cx="9"  cy="13" r="1.5" fill="currentColor" opacity="0.65"/>
    <circle cx="13" cy="9"  r="1.5" fill="currentColor" opacity="0.8"/>
    <circle cx="18" cy="5.5" r="1.8" fill="currentColor" opacity="0.95"/>
    <path d="M5 17 C6.5 15.5 7.5 14.5 9 13 C10.5 11.5 11.5 10.5 13 9 C14.5 7.5 16.5 6.5 18 5.5" strokeOpacity="0.7"/>
    <polyline points="15 4.5 18 3 21 6" strokeOpacity="0.9"/>
    <line x1="18" y1="3" x2="18" y2="7.3" strokeOpacity="0.9"/>
  </svg>,
];

function ChadFlagAI() {
  return (
    <div className="chad-flag">
      {/* Bandes du drapeau */}
      <div className="chad-flag__band chad-flag__band--blue" />
      <div className="chad-flag__band chad-flag__band--yellow" />
      <div className="chad-flag__band chad-flag__band--red" />

      {/* Design IA par-dessus */}
      <div className="chad-flag__overlay">
        <svg className="chad-flag__ai-svg" viewBox="0 0 300 300" fill="none">

          {/* ── Connexions couche 1 → couche 2 (synapse flicker) ── */}
          <line x1="60" y1="80"  x2="150" y2="60"  stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.2s" begin="0.0s" repeatCount="indefinite"/></line>
          <line x1="60" y1="80"  x2="150" y2="120" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="1.8s" begin="0.3s" repeatCount="indefinite"/></line>
          <line x1="60" y1="80"  x2="150" y2="180" stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="2.5s" begin="0.7s" repeatCount="indefinite"/></line>
          <line x1="60" y1="150" x2="150" y2="60"  stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="2.0s" begin="1.1s" repeatCount="indefinite"/></line>
          <line x1="60" y1="150" x2="150" y2="120" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="1.6s" begin="0.5s" repeatCount="indefinite"/></line>
          <line x1="60" y1="150" x2="150" y2="180" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.3s" begin="0.9s" repeatCount="indefinite"/></line>
          <line x1="60" y1="150" x2="150" y2="240" stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="1.9s" begin="1.4s" repeatCount="indefinite"/></line>
          <line x1="60" y1="220" x2="150" y2="120" stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="2.1s" begin="0.2s" repeatCount="indefinite"/></line>
          <line x1="60" y1="220" x2="150" y2="180" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="1.7s" begin="0.6s" repeatCount="indefinite"/></line>
          <line x1="60" y1="220" x2="150" y2="240" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.4s" begin="1.0s" repeatCount="indefinite"/></line>

          {/* ── Connexions couche 2 → couche 3 ── */}
          <line x1="150" y1="60"  x2="240" y2="80"  stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.0s" begin="0.4s" repeatCount="indefinite"/></line>
          <line x1="150" y1="60"  x2="240" y2="150" stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="2.3s" begin="1.2s" repeatCount="indefinite"/></line>
          <line x1="150" y1="120" x2="240" y2="80"  stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="1.9s" begin="0.1s" repeatCount="indefinite"/></line>
          <line x1="150" y1="120" x2="240" y2="150" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.1s" begin="0.8s" repeatCount="indefinite"/></line>
          <line x1="150" y1="180" x2="240" y2="150" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="1.7s" begin="0.3s" repeatCount="indefinite"/></line>
          <line x1="150" y1="180" x2="240" y2="220" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.2s" begin="1.1s" repeatCount="indefinite"/></line>
          <line x1="150" y1="240" x2="240" y2="150" stroke="white" strokeWidth="1">  <animate attributeName="strokeOpacity" values="0.08;0.4;0.08" dur="1.8s" begin="0.6s" repeatCount="indefinite"/></line>
          <line x1="150" y1="240" x2="240" y2="220" stroke="white" strokeWidth="1.2"><animate attributeName="strokeOpacity" values="0.15;0.7;0.15" dur="2.5s" begin="1.3s" repeatCount="indefinite"/></line>

          {/* ── Noeuds couche 1 (gauche) — pulse ── */}
          <circle cx="60" cy="80"  fill="white"><animate attributeName="r" values="6;9;6"   dur="2.4s" begin="0.0s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.4s" begin="0.0s" repeatCount="indefinite"/></circle>
          <circle cx="60" cy="150" fill="white"><animate attributeName="r" values="6;9;6"   dur="2.0s" begin="0.5s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.0s" begin="0.5s" repeatCount="indefinite"/></circle>
          <circle cx="60" cy="220" fill="white"><animate attributeName="r" values="6;9;6"   dur="2.6s" begin="1.0s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.6s" begin="1.0s" repeatCount="indefinite"/></circle>

          {/* ── Noeuds couche 2 (centre) — pulse ── */}
          <circle cx="150" cy="60"  fill="white"><animate attributeName="r" values="7;11;7"  dur="1.9s" begin="0.2s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.8;1;0.8" dur="1.9s" begin="0.2s" repeatCount="indefinite"/></circle>
          <circle cx="150" cy="120" fill="white"><animate attributeName="r" values="7;11;7"  dur="2.2s" begin="0.7s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.8;1;0.8" dur="2.2s" begin="0.7s" repeatCount="indefinite"/></circle>
          <circle cx="150" cy="180" fill="white"><animate attributeName="r" values="7;11;7"  dur="2.0s" begin="1.2s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.8;1;0.8" dur="2.0s" begin="1.2s" repeatCount="indefinite"/></circle>
          <circle cx="150" cy="240" fill="white"><animate attributeName="r" values="7;11;7"  dur="1.7s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.8;1;0.8" dur="1.7s" begin="0.4s" repeatCount="indefinite"/></circle>

          {/* ── Noeuds couche 3 (droite) — pulse ── */}
          <circle cx="240" cy="80"  fill="white"><animate attributeName="r" values="6;9;6"   dur="2.3s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.3s" begin="0.3s" repeatCount="indefinite"/></circle>
          <circle cx="240" cy="150" fill="white"><animate attributeName="r" values="6;9;6"   dur="2.1s" begin="0.8s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.1s" begin="0.8s" repeatCount="indefinite"/></circle>
          <circle cx="240" cy="220" fill="white"><animate attributeName="r" values="6;9;6"   dur="2.5s" begin="1.3s" repeatCount="indefinite"/><animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2.5s" begin="1.3s" repeatCount="indefinite"/></circle>

          {/* ── Noeud central — halo expansif + glow ── */}
          <circle cx="150" cy="150" fill="white">
            <animate attributeName="r"           values="20;42;20" dur="2.8s" repeatCount="indefinite"/>
            <animate attributeName="fillOpacity" values="0.1;0;0.1" dur="2.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="150" cy="150" fill="white">
            <animate attributeName="r"           values="14;20;14" dur="2.0s" repeatCount="indefinite"/>
            <animate attributeName="fillOpacity" values="0.18;0.05;0.18" dur="2.0s" repeatCount="indefinite"/>
          </circle>
          <circle cx="150" cy="150" r="11" fill="white" fillOpacity="0.95"/>

          {/* Lettre IA au centre */}
          <text x="150" y="155" textAnchor="middle" fontSize="11" fontWeight="800"
            fill="#002664" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1">IA</text>

          {/* ── Anneaux orbitaux qui tournent ── */}
          <circle cx="150" cy="150" r="28" stroke="white" strokeWidth="1" strokeDasharray="4 3">
            <animate attributeName="strokeOpacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="10s" repeatCount="indefinite"/>
          </circle>
          <circle cx="150" cy="150" r="42" stroke="white" strokeWidth="1" strokeDasharray="3 5">
            <animate attributeName="strokeOpacity" values="0.08;0.22;0.08" dur="4s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="16s" repeatCount="indefinite"/>
          </circle>
        </svg>

        {/* Texte CIAT */}
        <div className="chad-flag__label">
          <span className="chad-flag__label-ciat">CIAT</span>
          <span className="chad-flag__label-sub">N'Djamena · Tchad 🇹🇩</span>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about__intro">
          <div className="about__text">
            <span className="badge">{t.about.badge}</span>
            <h2 className="section-title">{t.about.title}</h2>
            <p className="section-text">{t.about.description1}</p>
            <p className="section-text">{t.about.description2}</p>
          </div>
          <div className="about__image">
            <ChadFlagAI />
          </div>
        </div>

        <div className="about__values">
          {t.about.values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-card__icon">{icons[i]}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
