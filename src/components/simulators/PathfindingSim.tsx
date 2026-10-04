import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Compass, MapPin, Target, Sparkles, Shuffle } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

const ROWS = 12;
const COLS = 20;

interface Cell {
  r: number;
  c: number;
  isWall: boolean;
}

export const PathfindingSim: React.FC = () => {
  const [start, setStart] = useState<{ r: number; c: number }>({ r: 2, c: 2 });
  const [target, setTarget] = useState<{ r: number; c: number }>({ r: 9, c: 17 });
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [pathNodes, setPathNodes] = useState<Set<string>>(new Set());
  const [algorithm, setAlgorithm] = useState<'astar' | 'dijkstra'>('astar');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toKey = (r: number, c: number) => `${r},${c}`;

  // Clear search results
  const clearPath = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSearching(false);
    setVisitedNodes(new Set());
    setPathNodes(new Set());
  };

  const clearAll = () => {
    clearPath();
    setWalls(new Set());
  };

  // Generate simple maze pattern
  const generateMaze = () => {
    clearPath();
    const newWalls = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r === start.r && c === start.c) || (r === target.r && c === target.c)) continue;
        if (Math.random() < 0.28) {
          newWalls.add(toKey(r, c));
        }
      }
    }
    setWalls(newWalls);
    sound.playPulse(520, 0.08);
  };

  // Handle cell click / drag for wall painting
  const toggleWall = (r: number, c: number) => {
    if ((r === start.r && c === start.c) || (r === target.r && c === target.c)) return;
    const key = toKey(r, c);
    setWalls((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    sound.playPulse(300, 0.03);
  };

  // Run A* / Dijkstra search
  const runPathfinding = () => {
    clearPath();
    setIsSearching(true);

    const openSet: { r: number; c: number; f: number; g: number }[] = [
      { r: start.r, c: start.c, f: 0, g: 0 },
    ];
    const cameFrom: Record<string, { r: number; c: number }> = {};
    const gScore: Record<string, number> = { [toKey(start.r, start.c)]: 0 };

    const heuristic = (r: number, c: number) => {
      if (algorithm === 'dijkstra') return 0;
      // Manhattan distance
      return Math.abs(r - target.r) + Math.abs(c - target.c);
    };

    const visitedOrder: { r: number; c: number }[] = [];
    let found = false;

    while (openSet.length > 0) {
      // Find lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const currentKey = toKey(current.r, current.c);

      visitedOrder.push(current);

      if (current.r === target.r && current.c === target.c) {
        found = true;
        break;
      }

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const n of neighbors) {
        if (n.r < 0 || n.r >= ROWS || n.c < 0 || n.c >= COLS) continue;
        const nKey = toKey(n.r, n.c);
        if (walls.has(nKey)) continue;

        const tentativeG = (gScore[currentKey] || 0) + 1;
        if (tentativeG < (gScore[nKey] ?? Infinity)) {
          cameFrom[nKey] = current;
          gScore[nKey] = tentativeG;
          const f = tentativeG + heuristic(n.r, n.c);
          if (!openSet.some((item) => item.r === n.r && item.c === n.c)) {
            openSet.push({ ...n, f, g: tentativeG });
          }
        }
      }
    }

    // Reconstruct final path
    const path: { r: number; c: number }[] = [];
    if (found) {
      let curr = target;
      while (curr && !(curr.r === start.r && curr.c === start.c)) {
        path.unshift(curr);
        curr = cameFrom[toKey(curr.r, curr.c)];
      }
      path.unshift(start);
    }

    // Animate exploration
    let stepIdx = 0;
    timerRef.current = setInterval(() => {
      if (stepIdx < visitedOrder.length) {
        const node = visitedOrder[stepIdx];
        setVisitedNodes((prev) => new Set(prev).add(toKey(node.r, node.c)));
        stepIdx++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        // Animate path
        if (found) {
          const finalPathSet = new Set(path.map((p) => toKey(p.r, p.c)));
          setPathNodes(finalPathSet);
          sound.playSuccess();
        } else {
          sound.playNegative();
        }
        setIsSearching(false);
      }
    }, 18);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => { setAlgorithm('astar'); clearPath(); }}
              className={`px-3 py-1.5 rounded font-medium transition-all ${
                algorithm === 'astar' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              A* Search (Heuristic f = g + h)
            </button>
            <button
              onClick={() => { setAlgorithm('dijkstra'); clearPath(); }}
              className={`px-3 py-1.5 rounded font-medium transition-all ${
                algorithm === 'dijkstra' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dijkstra (Uniform Cost h = 0)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runPathfinding}
            disabled={isSearching}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Find Shortest Path</span>
          </button>

          <button
            onClick={generateMaze}
            disabled={isSearching}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-300" />
            <span>Generate Maze</span>
          </button>

          <button
            onClick={clearAll}
            disabled={isSearching}
            title="Clear Board"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col items-center justify-center gap-3">
        <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-semibold uppercase">Interactive Spatial Grid</span>
            <span>· Click / Drag cells to draw or remove obstacles</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-cyan-300">Visited: {visitedNodes.size}</span>
            <span className="text-emerald-300">Path Length: {pathNodes.size}</span>
          </div>
        </div>

        {/* 12 x 20 Interactive Grid */}
        <div
          className="grid gap-1 bg-slate-950/90 p-3 rounded-xl border border-white/5 mx-auto select-none"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => {
              const key = toKey(r, c);
              const isStart = r === start.r && c === start.c;
              const isTarget = r === target.r && c === target.c;
              const isWall = walls.has(key);
              const isPath = pathNodes.has(key);
              const isVisited = visitedNodes.has(key);

              let cellStyle = 'bg-slate-900/60 hover:bg-slate-800';
              if (isStart) cellStyle = 'bg-cyan-400 shadow-[0_0_12px_#38bdf8] z-10';
              else if (isTarget) cellStyle = 'bg-rose-500 shadow-[0_0_12px_#f43f5e] z-10';
              else if (isPath) cellStyle = 'bg-emerald-400 shadow-[0_0_10px_#34d399] z-10 animate-pulse';
              else if (isVisited) cellStyle = 'bg-purple-900/60 border border-purple-500/30';
              else if (isWall) cellStyle = 'bg-slate-700 shadow-inner';

              return (
                <div
                  key={key}
                  onMouseEnter={() => {
                    if (isMouseDown) toggleWall(r, c);
                  }}
                  onClick={() => toggleWall(r, c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-sm flex items-center justify-center transition-all duration-75 cursor-pointer ${cellStyle}`}
                >
                  {isStart && <MapPin className="w-3.5 h-3.5 text-slate-950" />}
                  {isTarget && <Target className="w-3.5 h-3.5 text-white" />}
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-400" />
            <span className="text-slate-300">Start (g = 0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span className="text-slate-300">Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-700" />
            <span className="text-slate-300">Obstacle Wall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-purple-800" />
            <span className="text-slate-300">Frontier Explored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            <span className="text-slate-300">Shortest Path</span>
          </div>
        </div>
      </div>
    </div>
  );
};
