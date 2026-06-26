import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ciatLogo from '@logo/ciat_logo.jpeg';
import { useChat } from '../hooks/useChat';

/* ── Markdown renderer ── */
function MarkdownText({ text }) {
  const html = text
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return <div className="nia-md" dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ── Conversation starters ── */
const STARTERS = [
  { icon: '🧠', title: 'Intelligence Artificielle', prompt: 'Explique-moi l\'intelligence artificielle de façon simple.' },
  { icon: '🌍', title: 'IA en Afrique', prompt: 'Quel est le potentiel de l\'IA pour le développement de l\'Afrique ?' },
  { icon: '🚀', title: 'Débuter en IA', prompt: 'Par où commencer pour apprendre l\'IA quand on est débutant ?' },
  { icon: '💻', title: 'Coder avec Python', prompt: 'Comment Python est-il utilisé en machine learning ?' },
  { icon: '🏛️', title: 'La CIAT', prompt: 'Dis-moi tout sur la CIAT et ce qu\'elle fait au Tchad.' },
  { icon: '🔮', title: 'Futur de la tech', prompt: 'Comment la technologie va transformer l\'Afrique dans 10 ans ?' },
];

const WELCOME = `Salut ! Je suis **NIA** — N'djamena Intelligence Artificielle 🧠

Je suis le cerveau IA de la **CIAT** (Communauté d'Intelligence Artificielle au Tchad).

Je peux t'aider sur **n'importe quel sujet** : IA, technologie, code, science, CIAT, actualités, conseils... Pose-moi ce que tu veux !`;

let chatIdCounter = Date.now();

export default function ChatPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nia_convs') || '[]'); } catch { return []; }
  });
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const { messages, setMessages, isLoading, sendMessage } = useChat([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, [activeId]);
  useEffect(() => {
    try { localStorage.setItem('nia_convs', JSON.stringify(conversations)); } catch {}
  }, [conversations]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const loadConversation = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setActiveId(id);
      setMessages(conv.messages);
      if (window.innerWidth <= 768) setSidebarOpen(false);
    }
  };

  const deleteConversation = (e, id) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeId === id) newChat();
  };

  const handleSend = async (text = input.trim()) => {
    if (!text || isLoading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const result = await sendMessage(text, messages);
    if (!result) return;

    const { userMsg, assistantContent, allMessages } = result;
    const finalMessages = [...allMessages, { role: 'assistant', content: assistantContent }];
    const title = text.slice(0, 42) + (text.length > 42 ? '…' : '');

    if (activeId) {
      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: finalMessages, updatedAt: Date.now() } : c
      ));
    } else {
      const newId = ++chatIdCounter;
      setActiveId(newId);
      setConversations(prev => [{
        id: newId, title, messages: finalMessages,
        createdAt: Date.now(), updatedAt: Date.now(),
      }, ...prev]);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="nia-app">

      {/* Overlay mobile — ferme la sidebar en cliquant dehors */}
      {sidebarOpen && (
        <div className="nia-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`nia-sidebar ${sidebarOpen ? 'nia-sidebar--open' : ''}`}>
        <div className="nia-sidebar__top">
          <button className="nia-new-chat" onClick={newChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle conversation
          </button>
        </div>

        <div className="nia-sidebar__history">
          {conversations.length === 0 ? (
            <p className="nia-sidebar__empty">Aucune conversation</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`nia-conv-item ${activeId === conv.id ? 'nia-conv-item--active' : ''}`}
                onClick={() => loadConversation(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && loadConversation(conv.id)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="nia-conv-icon">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span className="nia-conv-title">{conv.title}</span>
                <button className="nia-conv-delete" onClick={(e) => deleteConversation(e, conv.id)} title="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="nia-sidebar__footer">
          <button className="nia-back-btn" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Retour au site
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="nia-main">

        {/* Top bar */}
        <div className="nia-topbar">
          <button className="nia-topbar__toggle" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Fermer' : 'Menu'}>
            {sidebarOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
          <div className="nia-topbar__brand">
            <img src={ciatLogo} alt="CIAT" className="nia-topbar__logo" />
            <span className="nia-topbar__name">NIA</span>
            <span className="nia-topbar__tag">par CIAT</span>
          </div>
          <button className="nia-topbar__new" onClick={newChat} title="Nouvelle conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="nia-messages">
          {isEmpty ? (
            <div className="nia-welcome">
              <div className="nia-welcome__avatar">
                <img src={ciatLogo} alt="NIA" />
              </div>
              <h1 className="nia-welcome__title">
                Bonjour, je suis <span className="gradient-text">NIA</span>
              </h1>
              <p className="nia-welcome__sub">N'djamena Intelligence Artificielle · Cerveau IA de la CIAT</p>
              <div className="nia-starters">
                {STARTERS.map((s, i) => (
                  <button key={i} className="nia-starter" onClick={() => handleSend(s.prompt)}>
                    <span className="nia-starter__icon">{s.icon}</span>
                    <div>
                      <p className="nia-starter__title">{s.title}</p>
                      <p className="nia-starter__sub">{s.prompt.slice(0, 48)}…</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="nia-thread">
              {messages.map((msg, i) => (
                <div key={i} className={`nia-msg nia-msg--${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="nia-msg__avatar">
                      <img src={ciatLogo} alt="NIA" />
                    </div>
                  )}
                  <div className="nia-msg__body">
                    {msg.role === 'assistant' && <span className="nia-msg__name">NIA</span>}
                    <div className="nia-msg__bubble">
                      {msg.content === '' && isLoading && i === messages.length - 1 ? (
                        <div className="nia-typing"><span/><span/><span/></div>
                      ) : (
                        <MarkdownText text={msg.content} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="nia-input-wrap">
          <div className="nia-input-box">
            <textarea
              ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
              className="nia-input"
              placeholder="Envoie un message à NIA..."
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`nia-send ${input.trim() && !isLoading ? 'nia-send--active' : ''}`}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <div className="nia-send-loading"><span/><span/><span/></div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <p className="nia-input-hint">NIA peut faire des erreurs. Vérifiez les informations importantes.</p>
        </div>

      </main>
    </div>
  );
}
