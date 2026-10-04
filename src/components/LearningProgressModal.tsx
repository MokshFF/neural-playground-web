import React from 'react';
import {
  X,
  Award,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  BarChart2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProgress, ConceptData } from '../types';
import { PRESET_CONCEPTS } from '../data/presetConcepts';
import { getMasteryRank, resetProgress } from '../utils/progressStore';
import { sound } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onProgressUpdated: (updated: UserProgress) => void;
  onSelectConcept: (concept: ConceptData) => void;
}

export const LearningProgressModal: React.FC<Props> = ({
  isOpen,
  onClose,
  progress,
  onProgressUpdated,
  onSelectConcept,
}) => {
  if (!isOpen) return null;

  const totalPresets = PRESET_CONCEPTS.length;
  const masteredCount = progress.masteredConcepts.length;
  const exploredCount = progress.exploredConcepts.length;
  const masteryPercentage = Math.round((masteredCount / totalPresets) * 100);

  const { rank, level, color: rankColor } = getMasteryRank(progress.totalXp);

  // Compute average score across attempts
  const averageAccuracy = progress.quizAttempts.length > 0
    ? Math.round(
        (progress.quizAttempts.reduce((acc, curr) => acc + (curr.score / curr.total), 0) /
          progress.quizAttempts.length) * 100
      )
    : 0;

  // SVG Radial Gauge geometry
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (masteryPercentage / 100) * circumference;

  // Category breakdown
  const categoryStats = PRESET_CONCEPTS.reduce((acc, c) => {
    const cat = c.category;
    if (!acc[cat]) {
      acc[cat] = { total: 0, mastered: 0 };
    }
    acc[cat].total += 1;
    if (progress.masteredConcepts.includes(c.concept)) {
      acc[cat].mastered += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; mastered: number }>);

  const handleReset = () => {
    if (window.confirm('Reset all learning progress and quiz scores?')) {
      const reset = resetProgress();
      onProgressUpdated(reset);
      sound.playNegative();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#090d22]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-[0_0_15px_#38bdf8]">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Learning Progress & Mastery Tracker
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className={rankColor}>Level {level}: {rank}</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-300 font-bold">{progress.totalXp} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Top Visual Cards: Radial Mastery Gauge & Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Radial Mastery Gauge */}
            <div className="sm:col-span-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center relative">
              <span className="text-xs uppercase font-mono text-cyan-400 font-semibold mb-3">
                Overall Syllabus Mastery
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60" cy="60" r={radius}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Glowing Progress Arc */}
                  <circle
                    cx="60" cy="60" r={radius}
                    stroke="url(#progress-grad)"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progress-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-display text-white tabular-nums">
                    {masteryPercentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {masteredCount} / {totalPresets} Done
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="sm:col-span-7 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Current Streak</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    {progress.streak}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Quizzes In A Row</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  <span>Average Accuracy</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    {averageAccuracy}%
                  </span>
                  <span className="text-[11px] text-slate-400 block">Quiz Performance</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Concepts Explored</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    {exploredCount}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Topics Studied</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mastery Level</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    Lvl {level}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">{rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Progress Bar Chart */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Domain Breakdown</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Visual Mastery Index</span>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {Object.entries(categoryStats).map(([cat, stats]) => {
                const pct = Math.round((stats.mastered / stats.total) * 100);
                return (
                  <div key={cat} className="flex flex-col gap-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>{cat}</span>
                      <span className="text-cyan-300 font-bold">{stats.mastered} / {stats.total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mastered Concepts Checklist */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Syllabus Status</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_CONCEPTS.map((item) => {
                const isMastered = progress.masteredConcepts.includes(item.concept);
                const isExplored = progress.exploredConcepts.includes(item.concept);

                return (
                  <div
                    key={item.concept}
                    onClick={() => {
                      onSelectConcept(item);
                      onClose();
                      sound.playPulse(520, 0.05);
                    }}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isMastered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                      ) : isExplored ? (
                        <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-xs font-semibold text-slate-200 block truncate group-hover:text-cyan-300">
                          {item.concept}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {isMastered ? 'Mastered' : isExplored ? 'Explored' : 'Unexplored'}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Scores History */}
          {progress.quizAttempts.length > 0 && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
              <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent Quiz Scores</span>
              </span>

              <div className="flex flex-col gap-2">
                {progress.quizAttempts.slice(0, 5).map((att, idx) => {
                  const pct = Math.round((att.score / att.total) * 100);
                  const isHigh = pct >= 66;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 flex items-center justify-between text-xs font-mono border border-white/5"
                    >
                      <span className="text-slate-200 truncate max-w-[240px]">{att.concept}</span>
                      <div className="flex items-center gap-3">
                        <span className={isHigh ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {att.score} / {att.total} ({pct}%)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-white/5 bg-slate-950/40 text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
