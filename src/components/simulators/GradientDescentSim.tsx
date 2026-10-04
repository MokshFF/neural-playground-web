import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, TrendingDown } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const GradientDescentSim: React.FC = () => {
  const [learningRate, setLearningRate] = useState<number>(0.12);
  const [momentum, setMomentum] = useState<number>(0.3);
  const [theta, setTheta] = useState<number>(3.8); // Current position
  const [velocity, setVelocity] = useState<number>(0);
  const [history, setHistory] = useState<{ theta: number; loss: number }[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lossType, setLossType] = useState<'convex' | 'bumpy'>('convex');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mathematical functions
  // 1. Convex: J(θ) = 0.5 * θ^2
  // Gradient: ∇J(θ) = θ
  // 2. Non-Convex (Bumpy with local minima): J(θ) = 0.5*θ^2 - 1.2*cos(2.5*θ) + 1.2
  // Gradient: ∇J(θ) = θ + 3.0*sin(2.5*θ)
  const lossFunction = (x: number): number => {
    if (lossType === 'convex') {
      return 0.5 * (x * x);
    } else {
      return 0.4 * (x * x) - 1.2 * Math.cos(2.2 * x) + 1.2;
    }
  };

  const gradientFunction = (x: number): number => {
    if (lossType === 'convex') {
      return x;
    } else {
      return 0.8 * x + 1.2 * 2.2 * Math.sin(2.2 * x);
    }
  };

  const currentLoss = lossFunction(theta);
  const currentGrad = gradientFunction(theta);

  // Reset to initial state
  const reset = (initialTheta = 3.8) => {
    setIsRunning(false);
    setTheta(initialTheta);
    setVelocity(0);
    setHistory([{ theta: initialTheta, loss: lossFunction(initialTheta) }]);
  };

  useEffect(() => {
    reset(theta);
  }, [lossType]);

  // Single optimization step
  const step = () => {
    const grad = gradientFunction(theta);
    const newVelocity = momentum * velocity - learningRate * grad;
    const newTheta = theta + newVelocity;
    const newLoss = lossFunction(newTheta);

    setTheta(newTheta);
    setVelocity(newVelocity);
    setHistory((prev) => [...prev.slice(-35), { theta: newTheta, loss: newLoss }]);

    sound.playPulse(Math.min(900, Math.max(250, 600 - Math.abs(newTheta) * 80)), 0.05);

    // Check convergence or divergence
    if (Math.abs(newTheta) > 8 || isNaN(newTheta)) {
      setIsRunning(false);
      sound.playNegative();
    } else if (Math.abs(grad) < 0.005 && Math.abs(newVelocity) < 0.005) {
      setIsRunning(false);
      sound.playSuccess();
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(step, 80);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, theta, velocity, learningRate, momentum, lossType]);

  // Coordinate mapping for SVG view
  // x-range: [-4.5, 4.5] -> [30, 470]
  // y-range: [0, 10] -> [220, 20]
  const mapX = (x: number) => ((x + 4.5) / 9) * 440 + 30;
  const mapY = (y: number) => 230 - (Math.min(9.5, Math.max(0, y)) / 9.5) * 190;

  // Generate curve path
  const curvePoints: string[] = [];
  for (let x = -4.5; x <= 4.5; x += 0.15) {
    const y = lossFunction(x);
    curvePoints.push(`${mapX(x)},${mapY(y)}`);
  }
  const curvePath = `M ${curvePoints.join(' L ')}`;

  // Status diagnostics
  const isExploding = Math.abs(theta) > 4.5;
  const isConverged = Math.abs(currentGrad) < 0.05 && Math.abs(velocity) < 0.05;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => { setLossType('convex'); reset(3.6); }}
              className={`px-3 py-1.5 rounded font-medium transition-all ${
                lossType === 'convex' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Convex Valley (Single Minima)
            </button>
            <button
              onClick={() => { setLossType('bumpy'); reset(3.8); }}
              className={`px-3 py-1.5 rounded font-medium transition-all ${
                lossType === 'bumpy' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Complex Surface (Local Traps)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Descent Rollout</span>
            </button>
          )}

          <button
            onClick={step}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
          >
            Step
          </button>

          <button
            onClick={() => reset(Number((Math.random() * 6 - 3).toFixed(2)))}
            title="Random Starting Position"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-purple-300" />
          </button>

          <button
            onClick={() => reset(3.8)}
            title="Reset"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main SVG Loss Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Loss Surface J(θ) & Descent Trajectory</span>
            </span>

            <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
              isExploding
                ? 'bg-rose-500/20 text-rose-300'
                : isConverged
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-cyan-500/20 text-cyan-300'
            }`}>
              {isExploding ? 'OVERFITTING / DIVERGED (LR TOO HIGH)' : isConverged ? 'CONVERGED TO MINIMUM' : 'OPTIMIZING DOWNHILL'}
            </span>
          </div>

          <div className="relative w-full max-w-[500px] aspect-[500/260]">
            <svg viewBox="0 0 500 260" className="w-full h-full drop-shadow-xl">
              {/* Grid Lines */}
              <line x1="30" y1="230" x2="470" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="250" y1="20" x2="250" y2="230" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

              {/* Surface Curve */}
              <path
                d={curvePath}
                fill="none"
                stroke="url(#curve-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="curve-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Trajectory Trail */}
              {history.map((h, i) => (
                <circle
                  key={i}
                  cx={mapX(h.theta)}
                  cy={mapY(h.loss)}
                  r="2.5"
                  fill="#38bdf8"
                  opacity={0.15 + (i / history.length) * 0.6}
                />
              ))}

              {/* Current Ball Position */}
              {!isExploding && (
                <g>
                  <circle
                    cx={mapX(theta)}
                    cy={mapY(currentLoss)}
                    r="8"
                    fill="#38bdf8"
                    className="drop-shadow-[0_0_12px_#38bdf8]"
                  />
                  <circle
                    cx={mapX(theta)}
                    cy={mapY(currentLoss)}
                    r="14"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-ping"
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="w-full flex justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
            <span>θ = -4.0 (Negative Slope)</span>
            <span>Global Minimum (θ ≈ 0.0)</span>
            <span>θ = +4.0 (Positive Slope)</span>
          </div>
        </div>

        {/* Telemetry and Parameter Sliders */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-3">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold">
              Live Optimization Telemetry
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Parameter θ</span>
                <span className="text-cyan-300 font-bold text-sm tabular-nums">{theta.toFixed(3)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Loss J(θ)</span>
                <span className="text-purple-300 font-bold text-sm tabular-nums">{currentLoss.toFixed(3)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Gradient ∇J</span>
                <span className="text-slate-200 font-bold text-sm tabular-nums">{currentGrad.toFixed(3)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400 block text-[11px]">Velocity (v)</span>
                <span className="text-slate-200 font-bold text-sm tabular-nums">{velocity.toFixed(3)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/5 font-mono">
              θ_{'{t+1}'} = θ_t - α · ∇J(θ_t) + β · v_t
            </div>
          </div>

          {/* Hyperparameter Sliders */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-3">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold">
              Hyperparameter Tuning
            </span>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Learning Rate (α)</span>
                <span className="text-cyan-400 font-bold">{learningRate.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.01" max="1.1" step="0.02"
                value={learningRate} onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {learningRate > 0.8 ? '⚠️ Danger: High rate can explode out of the valley' : 'Optimal: smooth step sizes'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Momentum (β)</span>
                <span className="text-purple-400 font-bold">{momentum.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.0" max="0.9" step="0.05"
                value={momentum} onChange={(e) => setMomentum(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Preserves velocity to roll through local traps
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
