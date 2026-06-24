import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { useChat } from '../hooks/useChat';

function MarkdownText({ text }) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const SUGGESTIONS_FR = [
  { icon: '🏛️', text: "C'est quoi la CIAT ?" },
  { icon: '👥', text: "Qui sont les membres du bureau ?" },
  { icon: '📅', text: "Quels sont les prochains événements ?" },
  { icon: '🚀', text: "Comment rejoindre la CIAT ?" },
  { icon: '💡', text: "Quels projets sont en cours ?" },
  { icon: '🎓', text: "Comment débuter en IA ?" },
];
const SUGGESTIONS_EN = [
  { icon: '🏛️', text: "What is CIAT?" },
  { icon: '👥', text: "Who are the board members?" },
  { icon: '📅', text: "What are the upcoming events?" },
  { icon: '🚀', text: "How to join CIAT?" },
  { icon: '💡', text: "What projects are ongoing?" },
  { icon: '🎓', text: "How to get started in AI?" },
];

export default function Chatbot({ isOpen, onClose }) {
  const { t, lang } = useLang();
  const [input, setInput] = useState('');
  const [kbStatus, setKbStatus] = useState('loading');
  const [kbData, setKbData] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, setMessages, isLoading, sendMessage } = useChat([
    { role: 'assistant', content: t.chatbot.welcome },
  ]);

  const suggestions = lang === 'fr' ? SUGGESTIONS_FR : SUGGESTIONS_EN;
  const showSuggestions = messages.length === 1 && !isLoading;

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(data => { setKbData(data); setKbStatus('connected'); })
      .catch(() => setKbStatus('error'));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const handleSend = async (text = input.trim()) => {
    if (!text || isLoading) return;
    setInput('');
    await sendMessage(text, messages);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: t.chatbot.welcome }]);
  };

  return (
    <>
      <div className={`chatbot-overlay ${isOpen ? 'chatbot-overlay--visible' : ''}`} onClick={onClose} />
      <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>

        {/* Header */}
        <div className="chatbot__header">
          <div className="chatbot__header-info">
            <div className="chatbot__avatar">
              <span className="chatbot__avatar-text">NIA</span>
            </div>
            <div>
              <h3 className="chatbot__title">{t.chatbot.title}</h3>
              <div className="chatbot__status">
                <span className={`chatbot__status-dot chatbot__status-dot--${kbStatus}`} />
                <span className="chatbot__subtitle">
                  {kbStatus === 'connected'
                    ? (lang === 'fr' ? `Base CIAT · ${kbData?.faq?.length ?? 0} réponses` : `CIAT base · ${kbData?.faq?.length ?? 0} answers`)
                    : kbStatus === 'error'
                    ? (lang === 'fr' ? 'Serveur hors ligne' : 'Server offline')
                    : (lang === 'fr' ? 'Connexion...' : 'Connecting...')}
                </span>
              </div>
            </div>
          </div>
          <div className="chatbot__header-actions">
            <button className="chatbot__btn-icon" onClick={clearChat} title={t.chatbot.newChat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.18"/>
              </svg>
            </button>
            <button className="chatbot__btn-icon" onClick={onClose} title="Fermer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Ribbon */}
        {kbStatus === 'connected' && kbData && (
          <div className="chatbot__kb-ribbon">
            <span>📚</span>
            <span>{lang === 'fr'
              ? `${kbData.bureau_executif?.length} membres · ${kbData.evenements?.a_venir?.length} événements · ${kbData.projets?.length} projets`
              : `${kbData.bureau_executif?.length} members · ${kbData.evenements?.a_venir?.length} events · ${kbData.projets?.length} projects`}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="chatbot__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot__message chatbot__message--${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chatbot__message-avatar">NIA</div>
              )}
              <div className="chatbot__message-bubble">
                {msg.content === '' && isLoading && i === messages.length - 1 ? (
                  <div className="chatbot__typing"><span /><span /><span /></div>
                ) : (
                  <MarkdownText text={msg.content} />
                )}
              </div>
            </div>
          ))}

          {showSuggestions && (
            <div className="chatbot__suggestions">
              <p className="chatbot__suggestions-label">
                {lang === 'fr' ? '💬 Questions fréquentes' : '💬 Frequent questions'}
              </p>
              <div className="chatbot__suggestions-grid">
                {suggestions.map((s, i) => (
                  <button key={i} className="chatbot__suggestion-chip" onClick={() => handleSend(s.text)}>
                    <span>{s.icon}</span><span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot__input-area">
          <textarea
            ref={inputRef}
            className="chatbot__input"
            placeholder={t.chatbot.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className={`chatbot__send ${input.trim() && !isLoading ? 'chatbot__send--active' : ''}`}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <div className="chatbot__typing" style={{padding:0, gap:'3px'}}>
                <span style={{width:'5px',height:'5px'}}/><span style={{width:'5px',height:'5px'}}/><span style={{width:'5px',height:'5px'}}/>
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
