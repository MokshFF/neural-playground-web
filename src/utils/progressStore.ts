import { UserProgress, QuizAttempt } from '../types';

const STORAGE_KEY = 'neural_playground_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  exploredConcepts: ['Neural Networks & Perceptrons'],
  masteredConcepts: [],
  quizAttempts: [],
  streak: 0,
  totalXp: 120,
};

export const getProgress = (): UserProgress => {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      exploredConcepts: Array.isArray(parsed.exploredConcepts) ? parsed.exploredConcepts : [],
      masteredConcepts: Array.isArray(parsed.masteredConcepts) ? parsed.masteredConcepts : [],
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
    };
  } catch {
    return INITIAL_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
};

export const recordConceptExplored = (conceptName: string): UserProgress => {
  const current = getProgress();
  const explored = new Set(current.exploredConcepts);
  let newXp = current.totalXp;

  if (!explored.has(conceptName)) {
    explored.add(conceptName);
    newXp += 50; // XP for exploring a new concept
  }

  const updated: UserProgress = {
    ...current,
    exploredConcepts: Array.from(explored),
    totalXp: newXp,
  };
  saveProgress(updated);
  return updated;
};

export const recordQuizAttempt = (concept: string, score: number, total: number): UserProgress => {
  const current = getProgress();
  const attempt: QuizAttempt = {
    concept,
    score,
    total,
    timestamp: Date.now(),
  };

  const isMastered = (score / Math.max(1, total)) >= 0.65;
  const mastered = new Set(current.masteredConcepts);
  let newStreak = current.streak;
  let addedXp = score * 40;

  if (isMastered) {
    mastered.add(concept);
    newStreak += 1;
    addedXp += 100; // Bonus for mastery
  } else {
    newStreak = Math.max(0, newStreak - 1);
  }

  const updated: UserProgress = {
    ...current,
    exploredConcepts: Array.from(new Set([...current.exploredConcepts, concept])),
    masteredConcepts: Array.from(mastered),
    quizAttempts: [attempt, ...current.quizAttempts.slice(0, 19)],
    streak: newStreak,
    totalXp: current.totalXp + addedXp,
  };

  saveProgress(updated);
  return updated;
};

export const resetProgress = (): UserProgress => {
  saveProgress(INITIAL_PROGRESS);
  return INITIAL_PROGRESS;
};

export const getMasteryRank = (xp: number) => {
  if (xp >= 1000) return { rank: 'Neural Architect', level: 5, color: 'text-amber-400' };
  if (xp >= 600) return { rank: 'Algorithm Adept', level: 4, color: 'text-purple-400' };
  if (xp >= 300) return { rank: 'Synapse Specialist', level: 3, color: 'text-cyan-400' };
  if (xp >= 150) return { rank: 'Data Apprentice', level: 2, color: 'text-blue-400' };
  return { rank: 'Neural Novice', level: 1, color: 'text-slate-400' };
};
