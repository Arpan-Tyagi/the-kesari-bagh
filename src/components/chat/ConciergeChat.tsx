'use client';

// Floating Luxury Concierge Chatbot Widget
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send } from 'lucide-react';
import { ChatMessageList, ChatMessage } from './ChatMessageList';

const QUICK_PROMPTS = [
  'What are the 4 room suites?',
  'Tell me about Elly the horse',
  'What are the check-in & pet policies?',
  'How do I reach from Delhi / Gurgaon?',
];

export function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome to The Kesari Bagh. I am your Estate Concierge AI. How may I assist you with suite bookings, dining under the French chandelier, or horseback sessions with Elly today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsgId = `ai-${Date.now()}`;

    try {
      const res = await fetch('/api/chat/concierge?stream=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message: text,
          guestIdentifier: 'guest-session-web',
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        setMessages((prev) => [
          ...prev,
          { id: aiMsgId, role: 'assistant', content: '' },
        ]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId ? { ...m, content: m.content + parsed.text } : m
                    )
                  );
                }
                if (parsed.whatsappUrl) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId ? { ...m, whatsappUrl: parsed.whatsappUrl } : m
                    )
                  );
                }
              } catch {
                // Ignore parse chunk
              }
            }
          }
        }
      } else {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            role: 'assistant',
            content: data.content || 'Our concierge is momentarily unavailable. Please connect via WhatsApp.',
            whatsappUrl: data.metadata?.whatsapp_url,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'A network disruption occurred. Please contact our estate concierge directly on WhatsApp.',
          whatsappUrl: 'https://wa.me/919810000000',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-[#142019] px-5 py-3.5 text-[#FBF9F5] shadow-xl ring-1 ring-[#C5A880]/40 transition-all duration-300 hover:scale-105 hover:bg-[#23342A]"
          aria-label="Open Estate Concierge Chat"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest text-[#C5A880]">Estate Concierge</span>
            <span className="text-sm font-medium">Ask Anything</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[540px] w-[360px] flex-col overflow-hidden rounded-2xl bg-[#FBF9F5] shadow-2xl ring-1 ring-[#C5A880]/30 sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E0CDB7]/50 bg-[#142019] px-5 py-4 text-[#FBF9F5]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg tracking-wide text-[#FBF9F5]">The Kesari Bagh</h3>
                <p className="text-[11px] uppercase tracking-wider text-[#C5A880]">AI Concierge • Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages & Quick Prompts */}
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            quickPrompts={QUICK_PROMPTS}
            onSelectPrompt={handleSend}
          />

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[#E0CDB7]/60 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire about suites, dining, Elly..."
              className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-hidden placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#142019] text-[#C5A880] transition-transform hover:scale-105 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
