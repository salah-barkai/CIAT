import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const avatarColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

function MemberAvatar({ member, index }) {
  const [imgError, setImgError] = useState(false);
  const photo = member.photo;
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  if (photo && !imgError) {
    return (
      <div className="team-card__photo-wrap">
        <img
          src={photo}
          alt={member.name}
          className="team-card__photo"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className="team-card__avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
      {initials}
    </div>
  );
}

export default function Team() {
  const { t, lang } = useLang();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  return (
    <section id="team" className="team section">
      <div className="container">
        <div className="section-header">
          <span className="badge">{t.team.badge}</span>
          <h2 className="section-title">{t.team.title}</h2>
          <p className="section-subtitle">{t.team.subtitle}</p>
        </div>

        <div className="team__grid">
          {members.map((m, i) => (
            <div key={m._id || i} className="team-card">
              <MemberAvatar member={m} index={i} />
              <h3 className="team-card__name">{m.name}</h3>
              <p className="team-card__role">{m.role?.[lang] || m.role?.fr}</p>
              <p className="team-card__bio">{m.bio?.[lang] || m.bio?.fr}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
