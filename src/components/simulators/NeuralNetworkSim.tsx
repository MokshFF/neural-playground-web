import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Shuffle, Sparkles, Activity, Layers } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

type ActivationType = 'relu' | 'sigmoid' | 'tanh' | 'leaky_relu';

export const NeuralNetworkSim: React.FC = () => {
  // Inputs
  const [x1, setX1] = useState<number>(0.8);
  const [x2, setX2] = useState<number>(-0.4);

  // Layer 1 Weights & Biases (Hidden Layer: 2 nodes)
  const [w11, setW11] = useState<number>(1.2);
  const [w12, setW12] = useState<number>(-0.9);
  const [w21, setW21] = useState<number>(0.7);
  const [w22, setW22] = useState<number>(1.5);
  const [b1, setB1] = useState<number>(0.1);
  const [b2, setB2] = useState<number>(-0.3);

  // Layer 2 Weights & Bias (Output Layer: 1 node)
  const [wOut1, setWOut1] = useState<number>(1.4);
  const [wOut2, setWOut2] = useState<number>(-1.1);
  const [bOut, setBOut] = useState<number>(0.0);

  // Activation Function
  const [activation, setActivation] = useState<ActivationType>('relu');
  const [isFiring, setIsFiring] = useState<boolean>(false);

  // Activation functions
  const activate = (z: number, type: ActivationType): number => {
    switch (type) {
      case 'relu':
        return Math.max(0, z);
      case 'sigmoid':
        return 1 / (1 + Math.exp(-z));
      case 'tanh':
        return Math.tanh(z);
      case 'leaky_relu':
        return z > 0 ? z : 0.1 * z;
    }
  };

  // Computations
  const { zH1, aH1, zH2, aH2, zOut, aOut } = useMemo(() => {
    const zh1 = x1 * w11 + x2 * w21 + b1;
    const ah1 = activate(zh1, activation);

    const zh2 = x1 * w12 + x2 * w22 + b2;
    const ah2 = activate(zh2, activation);

    const zout = ah1 * wOut1 + ah2 * wOut2 + bOut;
    const aout = activate(zout, activation);

    return { zH1: zh1, aH1: ah1, zH2: zh2, aH2: ah2, zOut: zout, aOut: aout };
  }, [x1, x2, w11, w12, w21, w22, b1, b2, wOut1, wOut2, bOut, activation]);

  // Color generator based on weight/activation
  const getWeightColor = (w: number) => {
    if (w >= 0) {
      const alpha = Math.min(1, Math.max(0.2, Math.abs(w) / 2));
      return `rgba(56, 189, 248, ${alpha})`; // Cyan for positive
    } else {
      const alpha = Math.min(1, Math.max(0.2, Math.abs(w) / 2));
      return `rgba(168, 85, 247, ${alpha})`; // Purple for negative
    }
  };

  const getWeightWidth = (w: number) => {
    return Math.min(5, Math.max(1.2, Math.abs(w) * 2));
  };

  const fireSignal = () => {
    setIsFiring(true);
    sound.playPulse(580, 0.15);
    setTimeout(() => {
      sound.playPulse(720, 0.18);
    }, 160);
    setTimeout(() => {
      sound.playPulse(880, 0.22);
      setIsFiring(false);
    }, 320);
  };

  const randomizeWeights = () => {
    setW11(Number((Math.random() * 4 - 2).toFixed(2)));
    setW12(Number((Math.random() * 4 - 2).toFixed(2)));
    setW21(Number((Math.random() * 4 - 2).toFixed(2)));
    setW22(Number((Math.random() * 4 - 2).toFixed(2)));
    setB1(Number((Math.random() * 2 - 1).toFixed(2)));
    setB2(Number((Math.random() * 2 - 1).toFixed(2)));
    setWOut1(Number((Math.random() * 4 - 2).toFixed(2)));
    setWOut2(Number((Math.random() * 4 - 2).toFixed(2)));
    setBOut(Number((Math.random() * 2 - 1).toFixed(2)));
    sound.playPulse(600, 0.1);
  };

  const resetWeights = () => {
    setX1(0.8);
    setX2(-0.4);
    setW11(1.2);
    setW12(-0.9);
    setW21(0.7);
    setW22(1.5);
    setB1(0.1);
    setB2(-0.3);
    setWOut1(1.4);
    setWOut2(-1.1);
    setBOut(0.0);
    setActivation('relu');
  };

  // Node spatial positions (SVG coordinates)
  const pos = {
    x1: { x: 70, y: 80 },
    x2: { x: 70, y: 220 },
    h1: { x: 260, y: 80 },
    h2: { x: 260, y: 220 },
    out: { x: 440, y: 150 },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>2-Layer Perceptron (2 Inputs · 2 Hidden · 1 Output)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Activation:</span>
            <div className="flex rounded-lg bg-slate-900/80 p-0.5 border border-white/10">
              {(['relu', 'sigmoid', 'tanh', 'leaky_relu'] as ActivationType[]).map((fn) => (
                <button
                  key={fn}
                  onClick={() => {
                    setActivation(fn);
                    sound.playPulse(480, 0.05);
                  }}
                  className={`px-2.5 py-1 text-xs rounded uppercase font-mono transition-all ${
                    activation === fn
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fn.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fireSignal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isFiring ? 'fill-current animate-pulse' : ''}`} />
            <span>Fire Pulse</span>
          </button>

          <button
            onClick={randomizeWeights}
            title="Randomize Weights"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-purple-300" />
          </button>

          <button
            onClick={resetWeights}
            title="Reset to Baseline"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport (Dynamic Graph + Live Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Network SVG Graph */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-mono text-cyan-400 font-semibold">
              Signal Flow & Synaptic Weights
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full inline-block"></span>
                <span>Positive Weight (+)</span>
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2.5 h-0.5 bg-purple-400 rounded-full inline-block"></span>
                <span>Negative Weight (-)</span>
              </span>
            </div>
          </div>

          <div className="relative w-full max-w-[520px] aspect-[520/300]">
            <svg viewBox="0 0 520 300" className="w-full h-full drop-shadow-2xl">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Layer 1 Synapses (Input -> Hidden) */}
              <line
                x1={pos.x1.x} y1={pos.x1.y} x2={pos.h1.x} y2={pos.h1.y}
                stroke={getWeightColor(w11)} strokeWidth={getWeightWidth(w11)}
                className="transition-all duration-150"
              />
              <line
                x1={pos.x1.x} y1={pos.x1.y} x2={pos.h2.x} y2={pos.h2.y}
                stroke={getWeightColor(w12)} strokeWidth={getWeightWidth(w12)}
                className="transition-all duration-150"
              />
              <line
                x1={pos.x2.x} y1={pos.x2.y} x2={pos.h1.x} y2={pos.h1.y}
                stroke={getWeightColor(w21)} strokeWidth={getWeightWidth(w21)}
                className="transition-all duration-150"
              />
              <line
                x1={pos.x2.x} y1={pos.x2.y} x2={pos.h2.x} y2={pos.h2.y}
                stroke={getWeightColor(w22)} strokeWidth={getWeightWidth(w22)}
                className="transition-all duration-150"
              />

              {/* Layer 2 Synapses (Hidden -> Output) */}
              <line
                x1={pos.h1.x} y1={pos.h1.y} x2={pos.out.x} y2={pos.out.y}
                stroke={getWeightColor(wOut1)} strokeWidth={getWeightWidth(wOut1)}
                className="transition-all duration-150"
              />
              <line
                x1={pos.h2.x} y1={pos.h2.y} x2={pos.out.x} y2={pos.out.y}
                stroke={getWeightColor(wOut2)} strokeWidth={getWeightWidth(wOut2)}
                className="transition-all duration-150"
              />

              {/* Dynamic Animated Pulse Packets */}
              {isFiring && (
                <>
                  <circle r="4" fill="#38bdf8" filter="url(#glow-cyan)">
                    <animateMotion
                      path={`M ${pos.x1.x} ${pos.x1.y} L ${pos.h1.x} ${pos.h1.y}`}
                      dur="0.16s" fill="freeze"
                    />
                  </circle>
                  <circle r="4" fill="#38bdf8" filter="url(#glow-cyan)">
                    <animateMotion
                      path={`M ${pos.x2.x} ${pos.x2.y} L ${pos.h2.x} ${pos.h2.y}`}
                      dur="0.16s" fill="freeze"
                    />
                  </circle>
                  <circle r="4" fill="#c084fc" filter="url(#glow-purple)">
                    <animateMotion
                      path={`M ${pos.h1.x} ${pos.h1.y} L ${pos.out.x} ${pos.out.y}`}
                      begin="0.16s" dur="0.16s" fill="freeze"
                    />
                  </circle>
                  <circle r="4" fill="#c084fc" filter="url(#glow-purple)">
                    <animateMotion
                      path={`M ${pos.h2.x} ${pos.h2.y} L ${pos.out.x} ${pos.out.y}`}
                      begin="0.16s" dur="0.16s" fill="freeze"
                    />
                  </circle>
                </>
              )}

              {/* Input Nodes */}
              <g className="cursor-pointer">
                <circle cx={pos.x1.x} cy={pos.x1.y} r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <text x={pos.x1.x} y={pos.x1.y - 2} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">x₁</text>
                <text x={pos.x1.x} y={pos.x1.y + 12} textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">{x1.toFixed(2)}</text>
              </g>

              <g className="cursor-pointer">
                <circle cx={pos.x2.x} cy={pos.x2.y} r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <text x={pos.x2.x} y={pos.x2.y - 2} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">x₂</text>
                <text x={pos.x2.x} y={pos.x2.y + 12} textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">{x2.toFixed(2)}</text>
              </g>

              {/* Hidden Layer Nodes */}
              <g>
                <circle cx={pos.h1.x} cy={pos.h1.y} r="26" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
                <text x={pos.h1.x} y={pos.h1.y - 3} textAnchor="middle" fill="#e0e7ff" fontSize="11" fontWeight="bold">h₁ (z={zH1.toFixed(1)})</text>
                <text x={pos.h1.x} y={pos.h1.y + 12} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily="monospace">a={aH1.toFixed(2)}</text>
              </g>

              <g>
                <circle cx={pos.h2.x} cy={pos.h2.y} r="26" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
                <text x={pos.h2.x} y={pos.h2.y - 3} textAnchor="middle" fill="#e0e7ff" fontSize="11" fontWeight="bold">h₂ (z={zH2.toFixed(1)})</text>
                <text x={pos.h2.x} y={pos.h2.y + 12} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily="monospace">a={aH2.toFixed(2)}</text>
              </g>

              {/* Output Node */}
              <g>
                <circle
                  cx={pos.out.x} cy={pos.out.y} r="30"
                  fill="#2e1065"
                  stroke={aOut > 0.5 ? '#38bdf8' : '#c084fc'}
                  strokeWidth="3.5"
                  className="transition-colors duration-200"
                />
                <text x={pos.out.x} y={pos.out.y - 4} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">Output ŷ</text>
                <text
                  x={pos.out.x} y={pos.out.y + 14}
                  textAnchor="middle"
                  fill={aOut > 0.5 ? '#38bdf8' : '#c084fc'}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {aOut.toFixed(3)}
                </text>
              </g>
            </svg>
          </div>

          <div className="w-full flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
            <span>Input Layer (2)</span>
            <span>Hidden Layer (2) + Bias</span>
            <span>Output (1)</span>
          </div>
        </div>

        {/* Live Calculation & Decision Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Live Decision Gauge</span>
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                aOut >= 0.5 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {aOut >= 0.5 ? 'CLASS 1 (HIGH)' : 'CLASS 0 (LOW)'}
              </span>
            </div>

            {/* Output Progress Bar */}
            <div className="w-full bg-slate-900/90 rounded-full h-3 p-0.5 overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, aOut * 100))}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Pre-Activation Sum (z)</span>
                <span className="text-slate-100 font-bold text-sm">{zOut.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Final Output a=σ(z)</span>
                <span className="text-cyan-400 font-bold text-sm">{aOut.toFixed(3)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
              <span className="font-semibold text-slate-200">Mathematical Formula:</span>
              <div className="font-mono text-cyan-300 mt-1 break-all">
                ŷ = {activation}( ({aH1.toFixed(2)} × {wOut1.toFixed(1)}) + ({aH2.toFixed(2)} × {wOut2.toFixed(1)}) + {bOut.toFixed(1)} )
              </div>
            </div>
          </div>

          {/* 2D Input Space Preview */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-2">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold">
              Interactive Input Coordinates
            </span>
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Input x₁</span>
                  <span className="text-cyan-400 font-bold">{x1.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="-2" max="2" step="0.05"
                  value={x1}
                  onChange={(e) => setX1(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Input x₂</span>
                  <span className="text-cyan-400 font-bold">{x2.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="-2" max="2" step="0.05"
                  value={x2}
                  onChange={(e) => setX2(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Control Deck (Weight & Bias Sliders) */}
      <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs uppercase tracking-wider font-mono text-slate-300 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Parameter Tuning Deck (Live Synapse Sliders)</span>
          </span>
          <span className="text-xs text-slate-400">Drag sliders to watch the graph update in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1 Input 1 Weights */}
          <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs font-mono text-cyan-300 font-semibold">From x₁ → Hidden</span>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w₁₁ (to h₁)</span>
                <span className={w11 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{w11.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={w11} onChange={(e) => setW11(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w₁₂ (to h₂)</span>
                <span className={w12 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{w12.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={w12} onChange={(e) => setW12(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Layer 1 Input 2 Weights & Hidden Biases */}
          <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs font-mono text-cyan-300 font-semibold">From x₂ → Hidden</span>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w₂₁ (to h₁)</span>
                <span className={w21 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{w21.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={w21} onChange={(e) => setW21(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w₂₂ (to h₂)</span>
                <span className={w22 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{w22.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={w22} onChange={(e) => setW22(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Layer 2 Output Weights & Biases */}
          <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs font-mono text-purple-300 font-semibold">Hidden → Output ŷ</span>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w_out₁ (from h₁)</span>
                <span className={wOut1 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{wOut1.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={wOut1} onChange={(e) => setWOut1(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Weight w_out₂ (from h₂)</span>
                <span className={wOut2 >= 0 ? 'text-cyan-400' : 'text-purple-400'}>{wOut2.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-3" max="3" step="0.1"
                value={wOut2} onChange={(e) => setWOut2(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
