import React, { useState, useMemo } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

type KernelType = 'edge' | 'sharpen' | 'box_blur' | 'ridge';

const KERNEL_PRESETS: Record<KernelType, { name: string; matrix: number[][]; desc: string }> = {
  edge: {
    name: 'Edge Detection (Sobel-like)',
    matrix: [
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1]
    ],
    desc: 'Highlights sharp boundaries and rapid intensity transitions.'
  },
  sharpen: {
    name: 'Sharpen Filter',
    matrix: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ],
    desc: 'Amplifies local high-frequency contrasts.'
  },
  box_blur: {
    name: 'Smoothing / Blur',
    matrix: [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9]
    ],
    desc: 'Averages neighboring pixels, dampening high-frequency noise.'
  },
  ridge: {
    name: 'Horizontal Ridge Detector',
    matrix: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ],
    desc: 'Computes horizontal intensity gradient (Sobel-Y).'
  }
};

// 6x6 pixel grid representing a geometric shape (e.g. cross / circle pattern)
const INITIAL_IMAGE: number[][] = [
  [10,  10,  80,  80,  10,  10],
  [10,  80,  80,  80,  80,  10],
  [80,  80, 240, 240,  80,  80],
  [80,  80, 240, 240,  80,  80],
  [10,  80,  80,  80,  80,  10],
  [10,  10,  80,  80,  10,  10],
];

export const ConvolutionKernelSim: React.FC = () => {
  const [selectedKernel, setSelectedKernel] = useState<KernelType>('edge');
  const [centerRow, setCenterRow] = useState<number>(2); // 1 to 4
  const [centerCol, setCenterCol] = useState<number>(2); // 1 to 4

  const kernel = KERNEL_PRESETS[selectedKernel];

  // Compute 4x4 valid output feature map (6 - 3 + 1 = 4)
  const featureMap = useMemo(() => {
    const out: number[][] = [];
    for (let r = 1; r <= 4; r++) {
      const row: number[] = [];
      for (let c = 1; c <= 4; c++) {
        let sum = 0;
        for (let kr = -1; kr <= 1; kr++) {
          for (let kc = -1; kc <= 1; kc++) {
            const pixel = INITIAL_IMAGE[r + kr][c + kc];
            const weight = kernel.matrix[kr + 1][kc + 1];
            sum += pixel * weight;
          }
        }
        row.push(Math.round(sum));
      }
      out.push(row);
    }
    return out;
  }, [selectedKernel]);

  // Current window calculation breakdown
  const currentWindowMultiplications = useMemo(() => {
    const items: { pixel: number; weight: number; product: number }[] = [];
    let total = 0;
    for (let kr = -1; kr <= 1; kr++) {
      for (let kc = -1; kc <= 1; kc++) {
        const pixel = INITIAL_IMAGE[centerRow + kr][centerCol + kc];
        const weight = kernel.matrix[kr + 1][kc + 1];
        const product = Number((pixel * weight).toFixed(1));
        total += product;
        items.push({ pixel, weight, product });
      }
    }
    return { items, total: Math.round(total) };
  }, [centerRow, centerCol, selectedKernel]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Filter Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono text-cyan-400 font-semibold mr-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>3×3 Kernel Preset:</span>
          </span>
          {(Object.keys(KERNEL_PRESETS) as KernelType[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                setSelectedKernel(k);
                sound.playPulse(520, 0.06);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedKernel === k
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {KERNEL_PRESETS[k].name}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 hidden md:inline">
          {kernel.desc}
        </span>
      </div>

      {/* Main Grid Interactive Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Image Grid (6x6) with Active Kernel Stencil Overlay */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold">
              Input Pixel Tensor (6×6)
            </span>
            <span className="text-xs text-slate-400">Click any inner pixel to reposition kernel</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 bg-slate-950/80 p-3 rounded-xl border border-white/5 mx-auto w-full max-w-[340px] aspect-square">
            {INITIAL_IMAGE.map((row, r) =>
              row.map((val, c) => {
                const isInKernel = Math.abs(r - centerRow) <= 1 && Math.abs(c - centerCol) <= 1;
                const isCenter = r === centerRow && c === centerCol;
                const isClickable = r >= 1 && r <= 4 && c >= 1 && c <= 4;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      if (isClickable) {
                        setCenterRow(r);
                        setCenterCol(c);
                        sound.playPulse(350 + val, 0.05);
                      }
                    }}
                    className={`relative rounded-md flex flex-col items-center justify-center transition-all ${
                      isClickable ? 'cursor-pointer hover:ring-2 hover:ring-cyan-400/50' : 'cursor-default'
                    } ${
                      isCenter
                        ? 'ring-2 ring-cyan-400 z-10'
                        : isInKernel
                        ? 'ring-1 ring-purple-400/80 bg-purple-900/30'
                        : ''
                    }`}
                    style={{
                      backgroundColor: `rgb(${Math.round(val * 0.4)}, ${Math.round(val * 0.5)}, ${Math.round(val * 0.8)})`,
                    }}
                  >
                    <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                      {val}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            Active Kernel Window Centered at ({centerRow}, {centerCol})
          </div>
        </div>

        {/* 3x3 Math Dot-Product Breakdown & Feature Map */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Active 3x3 Kernel Matrix */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-purple-400 font-semibold">
                Sliding 3×3 Kernel × Receptive Field
              </span>
              <span className="text-xs text-cyan-300 font-mono font-bold">
                Σ (Pixel × Weight) = {currentWindowMultiplications.total}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-xl border border-white/5">
              {currentWindowMultiplications.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-white/5 border border-white/5 text-center flex flex-col items-center justify-center font-mono"
                >
                  <span className="text-[11px] text-slate-300 font-bold">{item.pixel}</span>
                  <span className="text-[9px] text-slate-400">× {typeof item.weight === 'number' && item.weight % 1 !== 0 ? item.weight.toFixed(2) : item.weight}</span>
                  <span className="text-[10px] text-cyan-300 font-semibold mt-0.5">={item.product}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resulting 4x4 Feature Map */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Resulting Feature Map (4×4)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Valid Convolution (No Padding)</span>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-white/5 max-w-[240px] aspect-square mx-auto w-full">
              {featureMap.map((row, r) =>
                row.map((val, c) => {
                  const isActive = r === centerRow - 1 && c === centerCol - 1;
                  const intensity = Math.min(255, Math.max(0, Math.abs(val)));
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`rounded flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isActive ? 'ring-2 ring-cyan-400 scale-105 z-10' : ''
                      }`}
                      style={{
                        backgroundColor: val >= 0
                          ? `rgba(56, 189, 248, ${Math.min(1, Math.max(0.1, intensity / 400))})`
                          : `rgba(236, 72, 153, ${Math.min(1, Math.max(0.1, intensity / 400))})`,
                      }}
                    >
                      <span className="text-[10px] text-white drop-shadow">
                        {val}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
