import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Layers, ArrowUpDown, Network, TrendingDown, Eye, Compass, Search } from 'lucide-react';
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
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(PRESET_CONCEPTS.map((c) => c.category)))];

  const filteredConcepts = PRESET_CONCEPTS.filter((item) => {
    const matchesSearch =
      item.concept.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#0a0e23]">
        {/* Header */}
        <div className="flex flex-col gap-3 p-6 border-b border-white/5 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white font-display">Concept Library ({PRESET_CONCEPTS.length} Topics)</h2>
                <span className="text-xs text-slate-400 font-mono">
                  Verified, peer-reviewed foundations across Deep Learning, LLMs, Vision & Systems
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

          {/* Search bar inside library */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search topics (e.g. Backprop, Attention, MoE, LoRA, RAG, CNN)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    sound.playPulse(480, 0.04);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((item) => {
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
                    <span className="text-cyan-400 font-semibold">{item.category}</span>
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
                  <span className="text-slate-400">3 Verified Quiz Qs</span>
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
