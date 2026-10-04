import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Cpu,
  Lightbulb,
  PlayCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Type,
  ArrowLeft,
  Glasses
} from 'lucide-react';
import { ConceptData } from '../types';
import { sound } from '../utils/soundEffects';

interface Props {
  concept: ConceptData;
  isLoading: boolean;
  onSearch: (topic: string) => void;
  onJumpToSimulator: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const ConceptExplorer: React.FC<Props> = ({
  concept,
  isLoading,
  onSearch,
  onJumpToSimulator,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [explanationDepth, setExplanationDepth] = useState<'intuition' | 'under_the_hood'>('intuition');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Handle ESC key to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        onToggleFocusMode();
        sound.playPulse(440, 0.05);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, onToggleFocusMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      sound.playPulse(550, 0.08);
    }
  };

  const quickPicks = [
    "Transformers",
    "Diffusion Models",
    "RAG & Vector Embeddings",
    "Backpropagation",
    "RLHF & PPO",
    "Mixture of Experts (MoE)",
    "LoRA Fine-Tuning",
    "Quantization & KV Cache",
    "CNNs & Vision",
    "Gradient Descent",
    "GANs",
    "Sorting Algorithms",
  ];

  const fontClass =
    fontSizeLevel === 'normal'
      ? 'text-sm sm:text-base leading-relaxed'
      : fontSizeLevel === 'large'
      ? 'text-base sm:text-lg leading-loose'
      : 'text-lg sm:text-xl leading-loose';

  return (
    <div className="flex flex-col gap-8 transition-all duration-300">
      {/* Search Input Hero Section - Hidden in Focus Mode */}
      {!isFocusMode && (
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto w-full gap-4 pt-4 pb-2 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Explore Computer Science & AI Through{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dynamic Visualizations
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl text-balance">
            Enter any AI or algorithmic concept to unlock crystal-clear explanations, real-world analogies, interactive simulators, and mini quizzes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter a concept (e.g. Sorting Algorithms, Backpropagation, B-Trees, Diffusion)..."
                disabled={isLoading}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-panel text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all shadow-xl shadow-cyan-950/20"
              />
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="absolute right-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 disabled:opacity-40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <span className="text-slate-500">Popular:</span>
            {quickPicks.map((pick) => (
              <button
                key={pick}
                onClick={() => {
                  onSearch(pick);
                  sound.playPulse(480, 0.05);
                }}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-cyan-300 border border-white/5 transition-colors cursor-pointer"
              >
                {pick}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Concept Dossier - Transforms in Focus Mode */}
      <div
        className={`rounded-3xl glass-panel relative overflow-hidden flex flex-col gap-6 border border-white/10 transition-all duration-300 ${
          isFocusMode
            ? 'p-6 sm:p-12 max-w-5xl mx-auto w-full bg-[#070b1a]/95 shadow-2xl ring-1 ring-cyan-500/30'
            : 'p-6 sm:p-8'
        }`}
      >
        {/* Background accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Focus Mode Sticky Toolbar Banner when active */}
        {isFocusMode && (
          <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleFocusMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Focus Mode</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-slate-400 ml-1">
                  Esc
                </kbd>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Glasses className="w-4 h-4" />
                <span>Immersive Reading Sanctuary</span>
              </div>
            </div>

            {/* Depth and Font Size Controls */}
            <div className="flex items-center gap-3">
              {/* Depth switcher */}
              <div className="flex rounded-lg bg-slate-950/80 p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => {
                    setExplanationDepth('intuition');
                    sound.playPulse(500, 0.05);
                  }}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    explanationDepth === 'intuition'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Intuition
                </button>
                <button
                  onClick={() => {
                    setExplanationDepth('under_the_hood');
                    sound.playPulse(560, 0.05);
                  }}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    explanationDepth === 'under_the_hood'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Under The Hood
                </button>
              </div>

              {/* Font Sizing Toggle */}
              <div className="flex items-center rounded-lg bg-slate-950/80 p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => setFontSizeLevel('normal')}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    fontSizeLevel === 'normal' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'
                  }`}
                  title="Normal Text Size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSizeLevel('large')}
                  className={`px-2 py-1 rounded text-sm transition-all ${
                    fontSizeLevel === 'large' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'
                  }`}
                  title="Comfortable Text Size"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSizeLevel('xlarge')}
                  className={`px-2 py-1 rounded text-base transition-all ${
                    fontSizeLevel === 'xlarge' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'
                  }`}
                  title="Large Text Size"
                >
                  A++
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header and Unboxed Metadata */}
        <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Zero-Pill unboxed metadata discipline */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold">{concept.category}</span>
              <span aria-hidden="true">·</span>
              <span>Interactive Simulator: {concept.simulatorType.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>Mastery Quiz Attached</span>
            </div>

            {/* Focus Mode Toggle Button */}
            <button
              onClick={() => {
                onToggleFocusMode();
                sound.playPulse(isFocusMode ? 440 : 660, 0.08);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isFocusMode
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title={isFocusMode ? 'Exit Focus Mode (Esc)' : 'Enter Focus Mode for distraction-free reading'}
            >
              {isFocusMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Exit Focus Mode</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                  <span>Focus Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                className={`font-extrabold text-white font-display ${
                  isFocusMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                {concept.concept}
              </h2>
              <p
                className={`text-slate-300 mt-1 max-w-2xl ${
                  isFocusMode ? 'text-base sm:text-lg' : 'text-sm'
                }`}
              >
                {concept.tagline}
              </p>
            </div>

            {!isFocusMode && (
              <button
                onClick={onJumpToSimulator}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <PlayCircle className="w-4 h-4 fill-current" />
                <span>Launch Dynamic Visualizer</span>
              </button>
            )}
          </div>
        </div>

        {/* Explanation Section with Dual-Depth Switcher */}
        <div className="flex flex-col gap-4">
          {!isFocusMode && (
            <div className="flex items-center justify-between">
              <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => {
                    setExplanationDepth('intuition');
                    sound.playPulse(500, 0.05);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-medium transition-all ${
                    explanationDepth === 'intuition'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Intuition First (ELI5)</span>
                </button>
                <button
                  onClick={() => {
                    setExplanationDepth('under_the_hood');
                    sound.playPulse(560, 0.05);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-medium transition-all ${
                    explanationDepth === 'under_the_hood'
                      ? 'bg-purple-500 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Under the Hood (Mechanics & Math)</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                {explanationDepth === 'intuition' ? 'Plain English Mental Model' : 'Mathematical Formulation'}
              </span>
            </div>
          )}

          {/* Full-Width Immersive Explanation Card */}
          <div
            className={`w-full rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 font-sans transition-all ${
              isFocusMode ? 'p-8 sm:p-10 shadow-inner' : 'p-5 sm:p-6'
            } ${fontClass}`}
          >
            {explanationDepth === 'intuition' ? (
              <p className="whitespace-pre-line tracking-normal font-normal">{concept.simpleExplanation}</p>
            ) : (
              <p className="whitespace-pre-line font-mono text-cyan-100/95 tracking-normal">
                {concept.underTheHood}
              </p>
            )}
          </div>
        </div>

        {/* Real-World Application & Tangible Analogy Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Real-World Industry Case Study */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-mono font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Real-World Application</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {concept.realWorldExample.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {concept.realWorldExample.story}
            </p>
          </div>

          {/* Unforgettable Physical Analogy */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-purple-400 text-xs uppercase font-mono font-semibold">
              <Lightbulb className="w-4 h-4" />
              <span>Intuitive Physical Analogy</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              How to Visualize It in Real Life
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{concept.realWorldExample.analogy}"
            </p>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="p-6 rounded-2xl bg-slate-950/50 border border-white/5 flex flex-col gap-3">
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Essential Takeaways
          </span>
          <ul className="flex flex-col gap-2.5">
            {concept.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_6px_#38bdf8]" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* In Focus Mode, provide a clean bottom bar to return or jump to simulation */}
        {isFocusMode && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
            <button
              onClick={onToggleFocusMode}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus Mode</span>
            </button>

            <button
              onClick={() => {
                onToggleFocusMode();
                onJumpToSimulator();
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Proceed to Dynamic Visualizer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
