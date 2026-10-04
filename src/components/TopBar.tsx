import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Trophy } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  activeSection: string;
  onNavigate: (section: string) => void;
  onRandomConcept: () => void;
  onOpenPresets: () => void;
  onOpenProgress: () => void;
  masteredCount: number;
  totalConcepts: number;
}

export const TopBar: React.FC<Props> = ({
  activeSection,
  onNavigate,
  onRandomConcept,
  onOpenPresets,
  onOpenProgress,
  masteredCount,
  totalConcepts,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) {
      sound.playSuccess();
    }
  };

  const masteryPercent = Math.round((masteredCount / Math.max(1, totalConcepts)) * 100);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050711]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => onNavigate('explorer')}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors flex items-center gap-2 cursor-pointer font-display"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_10px_#38bdf8]" />
          <span>Neural Playground</span>
        </button>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('explorer')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activeSection === 'explorer' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Concept Explorer
          </button>
          <button
            onClick={() => onNavigate('simulators')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activeSection === 'simulators' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Dynamic Visualizers
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activeSection === 'quiz' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Mini Quiz
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activeSection === 'chat' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Neural Chat
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions + Progress Tracker */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProgress}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500/15 to-cyan-500/15 hover:from-purple-500/25 hover:to-cyan-500/25 border border-purple-500/30 text-purple-200 transition-all cursor-pointer whitespace-nowrap"
            title="Open Learning Progress Tracker"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Progress:</span>
            <span className="font-mono text-cyan-300 font-bold tabular-nums">{masteryPercent}%</span>
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Audio Synthesizer' : 'Enable Audio Feedback'}
            className={`p-2 rounded-lg text-xs border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPresets}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Library</span>
          </button>

          <button
            onClick={onRandomConcept}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 rounded-lg shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Random Concept</span>
            <span className="sm:hidden">Random</span>
          </button>
        </div>
      </div>
    </header>
  );
};
