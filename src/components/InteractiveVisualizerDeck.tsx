import React, { useState, useEffect } from 'react';
import { Layers, ArrowUpDown, Network, TrendingDown, Eye, Compass } from 'lucide-react';
import { SimulatorType } from '../types';
import { NeuralNetworkSim } from './simulators/NeuralNetworkSim';
import { SortingAlgorithmSim } from './simulators/SortingAlgorithmSim';
import { AttentionMatrixSim } from './simulators/AttentionMatrixSim';
import { GradientDescentSim } from './simulators/GradientDescentSim';
import { ConvolutionKernelSim } from './simulators/ConvolutionKernelSim';
import { PathfindingSim } from './simulators/PathfindingSim';
import { sound } from '../utils/soundEffects';

interface Props {
  currentSimulatorType: SimulatorType;
}

export const InteractiveVisualizerDeck: React.FC<Props> = ({ currentSimulatorType }) => {
  const [activeTab, setActiveTab] = useState<SimulatorType>(
    currentSimulatorType === 'generic' ? 'neural_network' : currentSimulatorType
  );

  useEffect(() => {
    if (currentSimulatorType && currentSimulatorType !== 'generic') {
      setActiveTab(currentSimulatorType);
    }
  }, [currentSimulatorType]);

  const tabs: { type: SimulatorType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'neural_network', label: 'Neural Network Graph', icon: Layers },
    { type: 'sorting', label: 'Sorting Algorithms', icon: ArrowUpDown },
    { type: 'attention', label: 'Self-Attention Matrix', icon: Network },
    { type: 'gradient_descent', label: 'Gradient Descent Surface', icon: TrendingDown },
    { type: 'convolution', label: 'Convolution Kernel & CNN', icon: Eye },
    { type: 'pathfinding', label: 'A* Pathfinding Search', icon: Compass },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Visualizer Mode Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl glass-panel overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => {
                setActiveTab(tab.type);
                sound.playPulse(520, 0.05);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Simulator Component */}
      <div className="w-full">
        {activeTab === 'neural_network' && <NeuralNetworkSim />}
        {activeTab === 'sorting' && <SortingAlgorithmSim />}
        {activeTab === 'attention' && <AttentionMatrixSim />}
        {activeTab === 'gradient_descent' && <GradientDescentSim />}
        {activeTab === 'convolution' && <ConvolutionKernelSim />}
        {activeTab === 'pathfinding' && <PathfindingSim />}
      </div>
    </div>
  );
};
