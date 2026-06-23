import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError(t.lang === 'en' ? 'Error sending message. Try again.' : 'Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="badge">{t.contact.badge}</span>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        <div className="contact__inner">
          <form className="contact__form" onSubmit={handleSubmit}>
            {sent   && <div className="contact__success">{t.contact.form.success}</div>}
            {error  && <div className="contact__error">{error}</div>}
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder={t.contact.form.name}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder={t.contact.form.email}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-input form-textarea"
                placeholder={t.contact.form.message}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? '...' : t.contact.form.send}
            </button>
          </form>

          <div className="contact__info">
            <div className="contact__info-item contact__info-item--location">
              <div className="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.5 7 13 7 13s7-7.5 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.2" fill="currentColor" opacity="0.85"/>
                  <circle cx="8.5" cy="7"  r="0.9" fill="currentColor" opacity="0.4"/>
                  <circle cx="15.5" cy="7" r="0.9" fill="currentColor" opacity="0.4"/>
                  <line x1="9.3"  y1="7.5"  x2="10.2" y2="8.3"  strokeOpacity="0.35"/>
                  <line x1="14.7" y1="7.5"  x2="13.8" y2="8.3"  strokeOpacity="0.35"/>
                </svg>
              </div>
              <div className="contact__info-text">
                <strong>Location</strong>
                <p>{t.contact.info.location}</p>
              </div>
            </div>
            <div className="contact__info-item contact__info-item--email">
              <div className="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <circle cx="8.5"  cy="12"  r="1.2" fill="currentColor" opacity="0.6"/>
                  <circle cx="12"   cy="9.5"  r="1.5" fill="currentColor" opacity="0.9"/>
                  <circle cx="15.5" cy="12"  r="1.2" fill="currentColor" opacity="0.6"/>
                  <line x1="9.7"  y1="11.3" x2="10.9" y2="10.2" strokeOpacity="0.45"/>
                  <line x1="13.1" y1="10.2" x2="14.3" y2="11.3" strokeOpacity="0.45"/>
                </svg>
              </div>
              <div className="contact__info-text">
                <strong>Email</strong>
                <p>{t.contact.info.email}</p>
              </div>
            </div>
            <div className="contact__social">
              <p className="contact__social-label">
                <span className="contact__social-label-line" />
                {t.contact.info.social}
              </p>
              <div className="contact__social-links">
                <a href="https://www.facebook.com/profile.php?id=61586149312269" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--facebook" aria-label="Facebook">
                  <div className="social-btn__icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </div>
                  <span className="social-btn__name">Facebook</span>
                  <span className="social-btn__handle">Communauté CIAT</span>
                  <span className="social-btn__arrow">→</span>
                </a>
                <a href="https://www.tiktok.com/@ciat06" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--tiktok" aria-label="TikTok">
                  <div className="social-btn__icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
                  </div>
                  <span className="social-btn__name">@ciat06</span>
                  <span className="social-btn__handle">Contenus IA & Tech</span>
                  <span className="social-btn__arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
