'use client';

// Chat Message List and Quick Prompts Component
import { RefObject } from 'react';
import { ExternalLink } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  whatsappUrl?: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  quickPrompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  messagesEndRef,
  quickPrompts,
  onSelectPrompt,
}: ChatMessageListProps) {
  return (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#142019] text-[#FBF9F5]'
                  : 'border border-[#E0CDB7]/60 bg-white text-[#2B2D2B] shadow-xs'
              }`}
            >
              {m.content}
            </div>
            {m.whatsappUrl && (
              <a
                href={m.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-medium text-[#128C7E] hover:bg-[#25D366]/25"
              >
                <span>Connect via WhatsApp</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5F635F]">
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#C5A880]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#C5A880] [animation-delay:0.2s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#C5A880] [animation-delay:0.4s]" />
            <span>Estate Concierge is composing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#E0CDB7]/30 bg-[#F0EBE1]/40 px-3 py-2">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => onSelectPrompt(p)}
              className="shrink-0 rounded-full border border-[#C5A880]/40 bg-white px-2.5 py-1 text-[11px] text-[#142019] transition-colors hover:bg-[#C5A880]/15"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
