import React, { useState, useMemo } from 'react';
import { Sparkles, Network, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

const SAMPLE_SENTENCES = [
  "The animal didn't cross the street because it was too tired",
  "The bank by the river was muddy after heavy rain",
  "Neural networks learn representations through backpropagation",
  "Attention is all you need for language modeling"
];

export const AttentionMatrixSim: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>(SAMPLE_SENTENCES[0]);
  const [customText, setCustomText] = useState<string>('');
  const [activeTokenIdx, setActiveTokenIdx] = useState<number | null>(7); // "it" in sentence 0
  const [activeHead, setActiveHead] = useState<number>(1); // 1 = Coreference, 2 = Syntactic, 3 = Locality

  const textToProcess = customText.trim() ? customText : selectedPreset;
  const tokens = useMemo(() => {
    return textToProcess.split(/\s+/).filter(Boolean).slice(0, 10);
  }, [textToProcess]);

  // Compute realistic synthetic attention weights based on token relationships & active head
  const attentionMatrix = useMemo(() => {
    const n = tokens.length;
    const matrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      const wordI = tokens[i].toLowerCase();

      for (let j = 0; j < n; j++) {
        const wordJ = tokens[j].toLowerCase();
        let rawScore = 0.1;

        if (activeHead === 1) {
          // Coreference & Semantic Head
          if ((wordI === 'it' && wordJ === 'animal') || (wordI === 'animal' && wordJ === 'it')) rawScore += 4.5;
          if (wordI === 'it' && wordJ === 'street') rawScore += 1.2;
          if (wordI === 'bank' && wordJ === 'river') rawScore += 4.0;
          if (wordI === 'bank' && wordJ === 'rain') rawScore += 2.5;
          if (wordI === 'neural' && wordJ === 'networks') rawScore += 4.2;
          if (wordI === 'learn' && wordJ === 'representations') rawScore += 3.8;
          if (i === j) rawScore += 1.8; // Self-bias
        } else if (activeHead === 2) {
          // Syntactic dependency (neighboring modifiers/verbs)
          const dist = Math.abs(i - j);
          if (dist === 1) rawScore += 3.5;
          if (dist === 2) rawScore += 1.8;
          if (i === j) rawScore += 1.2;
        } else {
          // Positional Locality head
          const dist = Math.abs(i - j);
          rawScore = Math.max(0.1, 4.0 - dist * 0.9);
        }

        row.push(rawScore);
      }

      // Softmax normalization per row
      const maxVal = Math.max(...row);
      const exps = row.map((v) => Math.exp(v - maxVal));
      const sumExps = exps.reduce((a, b) => a + b, 0);
      const normalized = exps.map((v) => Number((v / sumExps).toFixed(3)));
      matrix.push(normalized);
    }

    return matrix;
  }, [tokens, activeHead]);

  const focusedRow = activeTokenIdx !== null && activeTokenIdx < tokens.length
    ? attentionMatrix[activeTokenIdx]
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Sentence Selector */}
      <div className="flex flex-col gap-3 p-4 rounded-xl glass-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase font-mono text-cyan-300 font-semibold">
              Transformer Self-Attention Matrix Simulator
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Attention Head:</span>
            <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-white/10">
              <button
                onClick={() => { setActiveHead(1); sound.playPulse(520, 0.05); }}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  activeHead === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Head 1: Semantics
              </button>
              <button
                onClick={() => { setActiveHead(2); sound.playPulse(580, 0.05); }}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  activeHead === 2 ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Head 2: Syntax
              </button>
              <button
                onClick={() => { setActiveHead(3); sound.playPulse(640, 0.05); }}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  activeHead === 3 ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Head 3: Positional
              </button>
            </div>
          </div>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SAMPLE_SENTENCES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPreset(s);
                setCustomText('');
                setActiveTokenIdx(0);
                sound.playPulse(480, 0.05);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedPreset === s && !customText
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-sm'
                  : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage: Tokens & Attention Ray Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Rays Viewport */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold">
              Interactive Token Rays (Click a token to inspect its attention)
            </span>
            {activeTokenIdx !== null && tokens[activeTokenIdx] && (
              <span className="text-xs font-mono text-purple-300 font-bold">
                Query: "{tokens[activeTokenIdx]}"
              </span>
            )}
          </div>

          {/* Interactive Token Bubbles */}
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
            {tokens.map((token, idx) => {
              const isSelected = activeTokenIdx === idx;
              const weight = focusedRow ? focusedRow[idx] : 0;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTokenIdx(idx);
                    sound.playPulse(440 + idx * 30, 0.06);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 scale-105 z-10'
                      : weight > 0.15
                      ? 'bg-purple-950/80 text-purple-200 border border-purple-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <span>{token}</span>
                  {focusedRow && !isSelected && weight > 0.08 && (
                    <span className="ml-1.5 text-[10px] text-cyan-300 font-bold">
                      {(weight * 100).toFixed(0)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Attention Breakdown for Selected Token */}
          {activeTokenIdx !== null && tokens[activeTokenIdx] && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Top Attended Tokens for "{tokens[activeTokenIdx]}":
              </span>
              <div className="flex flex-col gap-2">
                {tokens
                  .map((t, idx) => ({ token: t, weight: focusedRow ? focusedRow[idx] : 0, idx }))
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, 4)
                  .map((item) => (
                    <div key={item.idx} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-24 truncate text-slate-300">"{item.token}"</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, item.weight * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-cyan-300 font-bold tabular-nums">
                        {(item.weight * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-white/5 mt-auto">
            <span className="font-semibold text-slate-200">Attention Formula:</span>
            <div className="font-mono text-cyan-300 mt-1">
              Attention(Q, K, V) = softmax((Q · Kᵀ) / √d_k) · V
            </div>
          </div>
        </div>

        {/* N x N Heatmap Grid */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold">
              Full Pairwise Attention Heatmap ({tokens.length}×{tokens.length})
            </span>
            <span className="text-[11px] text-slate-400">Rows: Queries · Columns: Keys</span>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-1 text-slate-500 text-[10px] text-left">Q \ K</th>
                    {tokens.map((t, idx) => (
                      <th
                        key={idx}
                        className={`p-1.5 text-center text-[11px] font-normal truncate max-w-[60px] ${
                          activeTokenIdx === idx ? 'text-cyan-300 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attentionMatrix.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td
                        className={`p-1.5 text-left text-[11px] truncate max-w-[60px] font-medium cursor-pointer ${
                          activeTokenIdx === rIdx ? 'text-cyan-300 font-bold' : 'text-slate-400'
                        }`}
                        onClick={() => setActiveTokenIdx(rIdx)}
                      >
                        {tokens[rIdx]}
                      </td>
                      {row.map((score, cIdx) => {
                        const isHighlight = activeTokenIdx === rIdx;
                        return (
                          <td
                            key={cIdx}
                            onClick={() => {
                              setActiveTokenIdx(rIdx);
                              sound.playPulse(380 + score * 400, 0.05);
                            }}
                            className={`p-1.5 text-center transition-all cursor-pointer border border-white/[0.04] ${
                              isHighlight ? 'ring-1 ring-cyan-400/50' : ''
                            }`}
                            style={{
                              backgroundColor: `rgba(168, 85, 247, ${Math.max(0.05, score * 0.85)})`,
                            }}
                          >
                            <span
                              className={`text-[10px] tabular-nums ${
                                score > 0.25 ? 'text-white font-bold' : 'text-slate-300/80'
                              }`}
                            >
                              {(score * 100).toFixed(0)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
