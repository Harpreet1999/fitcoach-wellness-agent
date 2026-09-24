'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Trash2, Sparkles, Cpu } from 'lucide-react';
import MacroCard from './cards/MacroCard';
import WorkoutCard from './cards/WorkoutCard';
import HabitCard from './cards/HabitCard';
import NutritionCard from './cards/NutritionCard';
import { WorkoutLogCard, WorkoutListCard } from './cards/WorkoutListCards';
import { saveMessages, loadMessages, saveWorkoutLog, getProfile, saveProfile, clearSession as clearMemorySession } from '@/lib/memory';

interface CardData {
  cardType: string;
  data: Record<string, unknown>;
}

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  cards?: CardData[];
  toolsUsed?: string[];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-dots"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function CardRenderer({ cards }: { cards: CardData[] }) {
  return (
    <>
      {cards.map((card, i) => {
        switch (card.cardType) {
          case 'macro_card':
            return <MacroCard key={i} data={card.data as unknown as Parameters<typeof MacroCard>[0]['data']} />;
          case 'workout_detail':
            return <WorkoutCard key={i} data={card.data as unknown as Parameters<typeof WorkoutCard>[0]['data']} />;
          case 'workout_log':
            return <WorkoutLogCard key={i} data={card.data as unknown as Parameters<typeof WorkoutLogCard>[0]['data']} />;
          case 'workout_list':
            return <WorkoutListCard key={i} data={card.data as unknown as Parameters<typeof WorkoutListCard>[0]['data']} />;
          case 'habit_card':
            return <HabitCard key={i} data={card.data as unknown as Parameters<typeof HabitCard>[0]['data']} />;
          case 'nutrition_card':
            return <NutritionCard key={i} data={card.data as unknown as Parameters<typeof NutritionCard>[0]['data']} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) {
      setMessages(saved as Message[]);
    }
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: text.trim() }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const profile = getProfile();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, parts: m.parts })),
          userProfile: profile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Extract user profile from response if mentioned
      if (data.text && data.toolsUsed?.includes('calculate_macros_and_bmr') && data.cardData?.[0]?.data) {
        const macroData = data.cardData[0].data;
        saveProfile({
          ...profile,
          ...(macroData.goal && { goal: macroData.goal as string }),
          ...(macroData.activity_level && { activity_level: macroData.activity_level as string }),
        });
      }

      // Save workout log entries
      data.cardData?.forEach((card: CardData) => {
        if (card.cardType === 'workout_log') {
          saveWorkoutLog({
            day: card.data.day as string,
            muscleGroups: card.data.muscleGroups as string[],
            notes: card.data.notes as string | undefined,
            loggedAt: new Date().toISOString(),
          });
        }
      });

      const agentMsg: Message = {
        role: 'model',
        parts: [{ text: data.text || '' }],
        cards: data.cardData || [],
        toolsUsed: data.toolsUsed || [],
      };

      const finalMessages = [...newMessages, agentMsg];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      const errorMsg: Message = {
        role: 'model',
        parts: [{ text: `Error: ${errMsg}` }],
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleQuickPrompt = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        sendMessage(customEvent.detail);
      }
    };

    window.addEventListener('fitcoach-prompt', handleQuickPrompt);
    return () => window.removeEventListener('fitcoach-prompt', handleQuickPrompt);
  }, [sendMessage]);

  const clearSession = () => {
    setMessages([]);
    clearMemorySession();
  };

  return (
    <div className="flex flex-col h-full min-h-[640px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg shadow-black/5 dark:shadow-black/40 overflow-hidden transition-colors duration-200">
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#f8f7f5] dark:bg-neutral-950/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-neutral-800/20 dark:bg-white/20 animate-ping" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-800 dark:text-white uppercase tracking-wider font-sans">
              FitCoach Agent
            </div>
            <div className="text-[10px] font-mono text-neutral-500">
              Gemini 3.5 Flash · In-Session Memory
            </div>
          </div>
        </div>

        <button
          onClick={clearSession}
          className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Clear session"
          aria-label="Clear session"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-neutral-400 dark:text-neutral-500">
            <Sparkles className="w-8 h-8 opacity-40" />
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ask FitCoach anything</p>
              <p className="text-xs font-mono mt-1 opacity-70">Select a prompt on the left or type your own</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <div className={`max-w-[88%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
              {/* Tools used badge */}
              {msg.role === 'model' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {msg.toolsUsed.map(tool => (
                    <span key={tool} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5 opacity-70" />
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Cards rendered before text */}
              {msg.role === 'model' && msg.cards && msg.cards.length > 0 && (
                <div className="w-full">
                  <CardRenderer cards={msg.cards} />
                </div>
              )}

              {/* Message bubble */}
              {msg.parts[0].text && (
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-light ${
                    msg.role === 'user'
                      ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 rounded-br-xs shadow-xs'
                      : 'bg-[#f8f7f5] dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 rounded-bl-xs border border-neutral-200 dark:border-neutral-700/60 shadow-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.parts[0].text}</div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-neutral-800 dark:text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                        h1: ({ children }) => <h1 className="text-base font-semibold text-neutral-800 dark:text-white mt-3 mb-1 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-semibold text-neutral-800 dark:text-white mt-2.5 mb-1 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold text-neutral-800 dark:text-white mt-2 mb-0.5 first:mt-0">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        code: ({ children }) => (
                          <code className="font-mono text-xs bg-neutral-200/70 dark:bg-neutral-700/60 text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-neutral-300 dark:border-neutral-600 pl-3 my-2 text-neutral-600 dark:text-neutral-400 italic">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 rounded-2xl rounded-bl-xs">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-5 pb-5 pt-3 border-t border-neutral-200 dark:border-neutral-800 bg-[#f8f7f5] dark:bg-neutral-950/60">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/90 rounded-full border border-neutral-200 dark:border-neutral-700/70 px-4 py-2 focus-within:border-neutral-400 dark:focus-within:border-neutral-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about workouts, macros, habits..."
            className="flex-1 bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 disabled:opacity-20 active:scale-95 transition-all duration-200 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
