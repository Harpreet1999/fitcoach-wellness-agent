// Session memory helpers — localStorage-based in-session persistence

export interface UserProfile {
  weight_kg?: number;
  height_cm?: number;
  age?: number;
  gender?: string;
  goal?: string;
  activity_level?: string;
  name?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

const PROFILE_KEY = 'fitcoach_profile';
const MESSAGES_KEY = 'fitcoach_messages';
const WORKOUT_LOG_KEY = 'fitcoach_workout_log';

export interface WorkoutLogEntry {
  day: string;
  muscleGroups: string[];
  notes?: string;
  loggedAt: string;
}

// --- Profile ---
export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  const existing = getProfile();
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...existing, ...profile }));
}

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// --- Messages ---
export function saveMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// --- Workout Log ---
export function saveWorkoutLog(entry: WorkoutLogEntry): void {
  if (typeof window === 'undefined') return;
  const existing = getWorkoutLog();
  const updated = existing.filter(e => e.day !== entry.day);
  updated.push(entry);
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(updated));
}

export function getWorkoutLog(): WorkoutLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WORKOUT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// --- Clear ---
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MESSAGES_KEY);
  localStorage.removeItem('fitcoach_session_messages');
  localStorage.removeItem(WORKOUT_LOG_KEY);
  localStorage.removeItem(PROFILE_KEY);
}
