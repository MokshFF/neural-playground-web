import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ArrowRight, Gauge, Cpu } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

type AlgorithmType = 'bubble' | 'quick' | 'insertion' | 'selection';

interface AnimationStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  pivot?: number | null;
  sortedIndices: number[];
}

export const SortingAlgorithmSim: React.FC = () => {
  const [arraySize, setArraySize] = useState<number>(24);
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50); // delay in ms

  // Animation queue
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array
  const generateRandomArray = (size = arraySize) => {
    stopSorting();
    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 15);
    }
    setArray(newArr);
    setSteps([]);
    setCurrentStepIdx(0);
    setComparisons(0);
    setSwaps(0);
  };

  const generateReversedArray = () => {
    stopSorting();
    const step = 85 / arraySize;
    const newArr = Array.from({ length: arraySize }, (_, i) => Math.round(100 - i * step));
    setArray(newArr);
    setSteps([]);
    setCurrentStepIdx(0);
    setComparisons(0);
    setSwaps(0);
  };

  useEffect(() => {
    generateRandomArray(arraySize);
  }, [arraySize]);

  // Algorithm Generators
  const generateSteps = (algo: AlgorithmType, initial: number[]): { steps: AnimationStep[]; compCount: number; swapCount: number } => {
    const arr = [...initial];
    const recordedSteps: AnimationStep[] = [];
    let comp = 0;
    let swp = 0;
    const sorted = new Set<number>();

    const record = (compPair: [number, number] | null, swapPair: [number, number] | null, pivotIdx: number | null = null) => {
      recordedSteps.push({
        array: [...arr],
        comparing: compPair,
        swapping: swapPair,
        pivot: pivotIdx,
        sortedIndices: Array.from(sorted),
      });
    };

    if (algo === 'bubble') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comp++;
          record([j, j + 1], null);
          if (arr[j] > arr[j + 1]) {
            swp++;
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            record(null, [j, j + 1]);
          }
        }
        sorted.add(n - i - 1);
        record(null, null);
      }
      sorted.add(0);
      record(null, null);
    } else if (algo === 'insertion') {
      const n = arr.length;
      sorted.add(0);
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0) {
          comp++;
          record([j, j + 1], null);
          if (arr[j] > key) {
            swp++;
            arr[j + 1] = arr[j];
            record(null, [j, j + 1]);
            j--;
          } else {
            break;
          }
        }
        arr[j + 1] = key;
        for (let k = 0; k <= i; k++) sorted.add(k);
        record(null, null);
      }
    } else if (algo === 'selection') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comp++;
          record([minIdx, j], null);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          swp++;
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          record(null, [i, minIdx]);
        }
        sorted.add(i);
      }
      sorted.add(n - 1);
      record(null, null);
    } else if (algo === 'quick') {
      const partition = (low: number, high: number) => {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
          comp++;
          record([j, high], null, high);
          if (arr[j] < pivot) {
            i++;
            swp++;
            const t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
            record(null, [i, j], high);
          }
        }
        swp++;
        const t = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = t;
        sorted.add(i + 1);
        record(null, [i + 1, high], i + 1);
        return i + 1;
      };

      const quickSortHelper = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high);
          quickSortHelper(low, pi - 1);
          quickSortHelper(pi + 1, high);
        } else if (low === high) {
          sorted.add(low);
        }
      };

      quickSortHelper(0, arr.length - 1);
      for (let i = 0; i < arr.length; i++) sorted.add(i);
      record(null, null);
    }

    return { steps: recordedSteps, compCount: comp, swapCount: swp };
  };

  // Start sorting process
  const startSorting = () => {
    let animSteps = steps;
    if (animSteps.length === 0 || currentStepIdx >= animSteps.length - 1) {
      const res = generateSteps(algorithm, array);
      animSteps = res.steps;
      setSteps(animSteps);
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const stopSorting = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stepForward = () => {
    let animSteps = steps;
    if (animSteps.length === 0) {
      const res = generateSteps(algorithm, array);
      animSteps = res.steps;
      setSteps(animSteps);
      setCurrentStepIdx(0);
      return;
    }

    if (currentStepIdx < animSteps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const step = animSteps[nextIdx];
      if (step.swapping) {
        setSwaps((s) => s + 1);
        sound.playNote(step.array[step.swapping[0]], 10, 100);
      } else if (step.comparing) {
        setComparisons((c) => c + 1);
        sound.playNote(step.array[step.comparing[0]], 10, 100);
      }
    }
  };

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIdx >= steps.length - 1) {
      setIsPlaying(false);
      sound.playSuccess();
      return;
    }

    timerRef.current = setTimeout(() => {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const step = steps[nextIdx];
      if (step?.swapping) {
        setSwaps((s) => s + 1);
        sound.playNote(step.array[step.swapping[0]], 10, 100);
      } else if (step?.comparing) {
        setComparisons((c) => c + 1);
        sound.playNote(step.array[step.comparing[0]], 10, 100);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, steps, speed]);

  const currentStep = steps[currentStepIdx] || {
    array,
    comparing: null,
    swapping: null,
    pivot: null,
    sortedIndices: [],
  };

  const complexityMap: Record<AlgorithmType, { time: string; space: string; desc: string }> = {
    bubble: { time: 'O(n²)', space: 'O(1)', desc: 'Repeatedly steps through list, swaps adjacent items if wrong order' },
    quick: { time: 'O(n log n)', space: 'O(log n)', desc: 'Partitions array around a pivot into smaller and greater halves' },
    insertion: { time: 'O(n²)', space: 'O(1)', desc: 'Builds sorted array one element at a time by sliding into place' },
    selection: { time: 'O(n²)', space: 'O(1)', desc: 'Finds minimum element in unsorted partition and swaps to the front' },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Algorithm Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="flex flex-wrap items-center gap-2">
          {(['bubble', 'quick', 'insertion', 'selection'] as AlgorithmType[]).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                stopSorting();
                setAlgorithm(algo);
                setSteps([]);
                setCurrentStepIdx(0);
                setComparisons(0);
                setSwaps(0);
                sound.playPulse(500, 0.06);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                algorithm === algo
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {algo} Sort
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={stopSorting}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startSorting}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Sort Array</span>
            </button>
          )}

          <button
            onClick={stepForward}
            disabled={isPlaying}
            title="Single Step Forward"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={() => generateRandomArray(arraySize)}
            title="Shuffle Random"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-purple-300" />
          </button>

          <button
            onClick={generateReversedArray}
            title="Worst-Case Reversed"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Bar Chart Visualization Stage */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
        {/* Real-time Telemetry & Big O Counters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>{algorithm.toUpperCase()} SORT DYNAMICS</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {complexityMap[algorithm].desc}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400">Time: </span>
              <span className="text-cyan-300 font-bold">{complexityMap[algorithm].time}</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400">Space: </span>
              <span className="text-purple-300 font-bold">{complexityMap[algorithm].space}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Animated Bars */}
        <div className="relative w-full h-64 bg-slate-950/60 rounded-xl p-4 flex items-end justify-center gap-1 sm:gap-1.5 overflow-hidden border border-white/5">
          {currentStep.array.map((val, idx) => {
            const isComparing = currentStep.comparing && currentStep.comparing.includes(idx);
            const isSwapping = currentStep.swapping && currentStep.swapping.includes(idx);
            const isPivot = currentStep.pivot === idx;
            const isSorted = currentStep.sortedIndices.includes(idx);

            let barBg = 'bg-slate-700/80';
            let glowClass = '';

            if (isSwapping) {
              barBg = 'bg-gradient-to-t from-purple-600 to-pink-500';
              glowClass = 'shadow-[0_0_15px_rgba(217,70,239,0.8)] z-10';
            } else if (isComparing) {
              barBg = 'bg-gradient-to-t from-cyan-600 to-cyan-300';
              glowClass = 'shadow-[0_0_15px_rgba(56,189,248,0.8)] z-10';
            } else if (isPivot) {
              barBg = 'bg-gradient-to-t from-amber-600 to-amber-300';
              glowClass = 'shadow-[0_0_15px_rgba(251,191,36,0.8)] z-10';
            } else if (isSorted) {
              barBg = 'bg-gradient-to-t from-emerald-600 to-teal-400';
            }

            return (
              <div
                key={idx}
                className="relative flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div
                  className={`w-full rounded-t-sm transition-all duration-75 ${barBg} ${glowClass}`}
                  style={{ height: `${val}%` }}
                />
                {arraySize <= 28 && (
                  <span className="text-[10px] font-mono text-slate-400 mt-1 opacity-60 group-hover:opacity-100">
                    {val}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend & Stats Tally */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              <span className="text-slate-300">Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <span className="text-slate-300">Swapping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span className="text-slate-300">Pivot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" />
              <span className="text-slate-300">Sorted Position</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-400">Comparisons: </span>
              <span className="text-cyan-400 font-bold tabular-nums">{comparisons}</span>
            </div>
            <div>
              <span className="text-slate-400">Swaps: </span>
              <span className="text-purple-400 font-bold tabular-nums">{swaps}</span>
            </div>
          </div>
        </div>

        {/* Speed & Size Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono w-24">Delay: {speed}ms</span>
            <input
              type="range" min="10" max="200" step="10"
              value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
              className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono w-24">Array Size: {arraySize}</span>
            <input
              type="range" min="10" max="48" step="2"
              value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))}
              className="flex-1 accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
