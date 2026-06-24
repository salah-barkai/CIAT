import { useState, useCallback } from 'react';

export function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const append = useCallback((msgs) => setMessages(msgs), []);

  const sendMessage = useCallback(async (userText, currentMessages) => {
    if (!userText?.trim() || isLoading) return null;

    const userMsg = { role: 'user', content: userText.trim() };
    const withUser = [...currentMessages, userMsg];

    setMessages([...withUser, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    let fullText = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: withUser.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Erreur réseau');
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue; // ping ou vide
          if (!trimmed.startsWith('data:')) continue;

          const raw = trimmed.slice(5).trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);

            if (parsed.error) {
              fullText += `\n\n❌ ${parsed.error}`;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: fullText };
                return updated;
              });
              break;
            }

            if (parsed.done) break;

            if (parsed.text) {
              fullText += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: fullText };
                return updated;
              });
            }
          } catch {
            /* ligne SSE non-JSON, on ignore */
          }
        }
      }
    } catch (err) {
      const errorMsg = err.message?.includes('Failed to fetch')
        ? '❌ Impossible de contacter le serveur. Assurez-vous que le serveur est démarré (`npm run server`).'
        : `❌ ${err.message || 'Erreur inconnue. Réessayez.'}`;

      fullText = errorMsg;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: fullText };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }

    return { userMsg, assistantContent: fullText, allMessages: withUser };
  }, [isLoading]);

  return { messages, setMessages, isLoading, sendMessage, append };
}
