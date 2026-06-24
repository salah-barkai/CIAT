import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const tagColors = {
  Atelier: '#3b82f6', Workshop: '#3b82f6',
  Projet: '#f59e0b', Project: '#f59e0b',
  Lancement: '#10b981', Launch: '#10b981',
  Assemblée: '#8b5cf6', Assembly: '#8b5cf6',
};

export default function Events() {
  const { t, lang } = useLang();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <section id="events" className="events section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="badge">{t.events.badge}</span>
          <h2 className="section-title">{t.events.title}</h2>
          <p className="section-subtitle">{t.events.subtitle}</p>
        </div>

        <div className="events__grid">
          {events.map((ev, i) => {
            const tag   = ev.tag?.[lang]   || ev.tag?.fr   || '';
            const title = ev.title?.[lang] || ev.title?.fr || '';
            const desc  = ev.desc?.[lang]  || ev.desc?.fr  || '';
            const date  = ev.date?.[lang]  || ev.date?.fr  || '';
            const color = tagColors[tag] || '#6366f1';
            return (
              <article key={ev._id || i} className="event-card">
                <div className="event-card__date">{date}</div>
                <div className="event-card__body">
                  <span
                    className="event-card__tag"
                    style={{ background: color + '22', color }}
                  >
                    {tag}
                  </span>
                  <h3 className="event-card__title">{title}</h3>
                  <p className="event-card__desc">{desc}</p>
                  <div className="event-card__footer">
                    <span className="event-card__location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {ev.location}
                    </span>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {t.events.register}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
