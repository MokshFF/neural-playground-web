import React from 'react';
import { X, Sparkles, BookOpen, Layers, ArrowUpDown, Network, TrendingDown, Eye, Compass } from 'lucide-react';
import { ConceptData, SimulatorType } from '../types';
import { PRESET_CONCEPTS } from '../data/presetConcepts';
import { sound } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (concept: ConceptData) => void;
  activeConceptName: string;
}

const SIMULATOR_ICONS: Record<SimulatorType, React.ComponentType<{ className?: string }>> = {
  neural_network: Layers,
  sorting: ArrowUpDown,
  attention: Network,
  gradient_descent: TrendingDown,
  convolution: Eye,
  pathfinding: Compass,
  generic: BookOpen,
};

export const ConceptLibraryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectConcept,
  activeConceptName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#0a0e23]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white font-display">Concept Library</h2>
              <span className="text-xs text-slate-400 font-mono">
                Curated foundational computer science and AI blueprints
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concept Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_CONCEPTS.map((item) => {
            const Icon = SIMULATOR_ICONS[item.simulatorType] || BookOpen;
            const isCurrent = item.concept === activeConceptName;

            return (
              <div
                key={item.concept}
                onClick={() => {
                  onSelectConcept(item);
                  sound.playSuccess();
                  onClose();
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                    : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400">{item.category}</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Icon className="w-3.5 h-3.5 text-purple-400" />
                      <span>{item.simulatorType.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-display">
                    {item.concept}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  <span>Interactive Visualizer Ready</span>
                  <span className="text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform">
                    {isCurrent ? 'Currently Exploring →' : 'Launch Module →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
