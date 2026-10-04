import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Loader2, Globe } from 'lucide-react';
import { ChatMessage } from '../types';
import { sound } from '../utils/soundEffects';

interface Props {
  conceptContext: string;
  suggestedQuestions: string[];
}

export const NeuralChat: React.FC<Props> = ({ conceptContext, suggestedQuestions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Greetings explorer! I'm Synapse, your Neural Playground guide. We are currently analyzing "${conceptContext}". Ask me anything—from intuitive analogies and step-by-step math breakdowns to Python implementations or real-world trade-offs!`,
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);
    sound.playPulse(520, 0.06);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          conceptContext,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || "I couldn't process that query. Please try rephrasing!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        isGrounded: Boolean(data.isGrounded),
      };

      setMessages((prev) => [...prev, botMsg]);
      sound.playPulse(740, 0.08);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: "Network issue contacting Synapse. Try again in a moment.",
          timestamp: 'Error',
        },
      ]);
      sound.playNegative();
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        content: `Conversation reset. Exploring "${conceptContext}". What would you like to clarify?`,
        timestamp: 'Now',
      },
    ]);
    sound.playPulse(440, 0.05);
  };

  return (
    <div className="flex flex-col h-[650px] max-w-4xl mx-auto w-full rounded-3xl glass-panel relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-[0_0_12px_#38bdf8]">
            <div className="w-full h-full rounded-[6px] bg-slate-950 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">Synapse AI Guide</h3>
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                <Globe className="w-3 h-3 text-cyan-300" />
                <span>Google Search Grounded (gemini-3.5-flash)</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono block">
              Grounded in {conceptContext} & Live Web Intelligence
            </span>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-900/80 border border-white/5 text-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.content}</div>

                {/* Grounding Web Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Verified Google Search Sources:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, sIdx) => (
                        <a
                          key={sIdx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-white/10 transition-colors truncate max-w-[200px]"
                        >
                          {s.title || 'Web Link'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <span className="block text-[10px] opacity-40 font-mono mt-1 text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 rounded-tl-xs flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Synapse is computing intuitive explanation...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Follow-Up Prompts */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="px-6 py-2 border-t border-white/5 bg-slate-950/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Try asking:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] hover:text-cyan-300 border border-white/5 text-slate-400 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 border-t border-white/5 bg-slate-950/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${conceptContext} or general AI...`}
          disabled={isSending}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 border border-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 hover:from-cyan-300 hover:to-purple-400 disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
