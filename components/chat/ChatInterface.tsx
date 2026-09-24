'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Sparkles } from 'lucide-react';
import MacroCard from './cards/MacroCard';
import WorkoutCard from './cards/WorkoutCard';
import HabitCard from './cards/HabitCard';
import NutritionCard from './cards/NutritionCard';
import { WorkoutLogCard, WorkoutListCard } from './cards/WorkoutListCards';
import { saveMessages, loadMessages, saveWorkoutLog, getProfile, saveProfile } from '@/lib/memory';

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

const QUICK_PROMPTS = [
  { label: '🏋️ Log PPL Split', prompt: 'Log my PPL split: Push on Monday/Thursday, Pull on Tuesday/Friday, Legs on Wednesday/Saturday' },
  { label: '📊 Calculate Macros', prompt: "I'm 75kg, 178cm, 25 years old male, moderate activity. Calculate macros for cutting." },
  { label: '💪 Chest Workout', prompt: 'Show me the chest & triceps strength workout from your database' },
  { label: '🍌 Banana Nutrition', prompt: 'What is the nutritional breakdown of a banana?' },
  { label: '😴 Sleep Habit', prompt: 'Give me a science-backed sleep habit recommendation' },
  { label: '🖼️ Generate Image', prompt: 'Generate a motivational image of a dumbbell bench press exercise' },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-dots"
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) {
      setMessages(saved as Message[]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      saveMessages(finalMessages.map(m => ({ role: m.role, parts: m.parts })));
    } catch (err) {
      const errMsg: Message = {
        role: 'model',
        parts: [{ text: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.` }],
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // Listen for quick-prompt chip events from DemoSection
  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      if (prompt) sendMessage(prompt);
    };
    window.addEventListener('fitcoach-prompt', handler);
    return () => window.removeEventListener('fitcoach-prompt', handler);
  }, [sendMessage]);

  const clearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  return (
    <div className="flex flex-col h-[680px] rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-neutral-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">FitCoach AI</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle" />
              gemini-2.0-flash · in-session memory
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-neutral-600 hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-800"
          title="Clear session"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-neutral-600">
            <Sparkles className="w-8 h-8" />
            <div>
              <p className="text-sm font-medium text-neutral-400">Ask FitCoach anything</p>
              <p className="text-xs font-mono mt-1">Try a quick prompt or type your own →</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              {/* Tools used badge */}
              {msg.role === 'model' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {msg.toolsUsed.map(tool => (
                    <span key={tool} className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-500 border border-neutral-700">
                      ⚙ {tool}
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
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-light ${
                  msg.role === 'user'
                    ? 'bg-white text-neutral-950 rounded-br-sm'
                    : 'bg-neutral-800 text-neutral-200 rounded-bl-sm border border-neutral-700'
                }`}>
                  {msg.parts[0].text}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-bl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-neutral-800">
        <div className="flex items-center gap-2 bg-neutral-800 rounded-full border border-neutral-700 px-4 py-2.5 focus-within:border-neutral-600 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask about workouts, macros, habits..."
            className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-full bg-white text-neutral-950 disabled:opacity-30 hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
