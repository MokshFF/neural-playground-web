/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { NeuralBackgroundCanvas } from './components/NeuralBackgroundCanvas';
import { ConceptExplorer } from './components/ConceptExplorer';
import { InteractiveVisualizerDeck } from './components/InteractiveVisualizerDeck';
import { QuizModule } from './components/QuizModule';
import { NeuralChat } from './components/NeuralChat';
import { ConceptLibraryModal } from './components/ConceptLibraryModal';
import { LearningProgressModal } from './components/LearningProgressModal';
import { PRESET_CONCEPTS } from './data/presetConcepts';
import { ConceptData, UserProgress } from './types';
import { sound } from './utils/soundEffects';
import { getProgress, recordConceptExplored, recordQuizAttempt, getMasteryRank } from './utils/progressStore';
import { Layers, HelpCircle, MessageSquare, Compass, Sparkles, Trophy, Zap } from 'lucide-react';

export default function App() {
  const [activeConcept, setActiveConcept] = useState<ConceptData>(PRESET_CONCEPTS[0]);
  const [activeSection, setActiveSection] = useState<string>('explorer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<UserProgress>(() => getProgress());

  // Record active concept in progress store
  useEffect(() => {
    if (activeConcept?.concept) {
      const updated = recordConceptExplored(activeConcept.concept);
      setProgress(updated);
    }
  }, [activeConcept.concept]);

  // Search or fetch a new concept
  const handleSearchConcept = async (topic: string) => {
    const clean = topic.trim().toLowerCase();

    // 1. Direct or partial matching across curated presets
    const directMatch = PRESET_CONCEPTS.find((c) => {
      const name = c.concept.toLowerCase();
      return (
        name === clean ||
        name.includes(clean) ||
        clean.includes(name) ||
        c.category.toLowerCase().includes(clean)
      );
    });

    if (directMatch) {
      setActiveConcept(directMatch);
      sound.playSuccess();
      return;
    }

    // 2. Acronym and common AI terminology aliases map
    const AI_ALIASES: Record<string, string> = {
      'backprop': 'Backpropagation & The Chain Rule',
      'backpropagation': 'Backpropagation & The Chain Rule',
      'chain rule': 'Backpropagation & The Chain Rule',
      'transformer': 'Transformers & Multi-Head Self-Attention',
      'transformers': 'Transformers & Multi-Head Self-Attention',
      'self attention': 'Transformers & Multi-Head Self-Attention',
      'attention': 'Transformers & Multi-Head Self-Attention',
      'llm': 'Transformers & Multi-Head Self-Attention',
      'llms': 'Transformers & Multi-Head Self-Attention',
      'diffusion': 'Diffusion Models & Denoising Score Matching',
      'diffusion models': 'Diffusion Models & Denoising Score Matching',
      'stable diffusion': 'Diffusion Models & Denoising Score Matching',
      'midjourney': 'Diffusion Models & Denoising Score Matching',
      'sora': 'Diffusion Models & Denoising Score Matching',
      'rag': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
      'vector database': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
      'vector search': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
      'embeddings': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
      'rlhf': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
      'ppo': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
      'dpo': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
      'alignment': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
      'moe': 'Mixture of Experts (MoE) & Sparse Routing',
      'mixture of experts': 'Mixture of Experts (MoE) & Sparse Routing',
      'deepseek': 'Mixture of Experts (MoE) & Sparse Routing',
      'mixtral': 'Mixture of Experts (MoE) & Sparse Routing',
      'lora': 'Low-Rank Adaptation (LoRA) & PEFT',
      'peft': 'Low-Rank Adaptation (LoRA) & PEFT',
      'qlora': 'Low-Rank Adaptation (LoRA) & PEFT',
      'fine tuning': 'Low-Rank Adaptation (LoRA) & PEFT',
      'cnn': 'Convolutional Neural Networks (CNNs) & Feature Extraction',
      'cnns': 'Convolutional Neural Networks (CNNs) & Feature Extraction',
      'resnet': 'Residual Networks (ResNet) & Skip Connections',
      'skip connections': 'Residual Networks (ResNet) & Skip Connections',
      'clip': 'Contrastive Language-Image Pretraining (CLIP)',
      'multimodal': 'Contrastive Language-Image Pretraining (CLIP)',
      'bpe': 'Tokenization & Byte-Pair Encoding (BPE)',
      'tokenization': 'Tokenization & Byte-Pair Encoding (BPE)',
      'tokenizer': 'Tokenization & Byte-Pair Encoding (BPE)',
      'quantization': 'Quantization & KV Caching (INT8, FP4, AWQ)',
      'kv cache': 'Quantization & KV Caching (INT8, FP4, AWQ)',
      'kv caching': 'Quantization & KV Caching (INT8, FP4, AWQ)',
      'overfitting': 'Overfitting, Regularization & Dropout',
      'dropout': 'Overfitting, Regularization & Dropout',
      'regularization': 'Overfitting, Regularization & Dropout',
      'gan': 'Generative Adversarial Networks (GANs)',
      'gans': 'Generative Adversarial Networks (GANs)',
      'rnn': 'Recurrent Neural Networks (RNN) & LSTMs',
      'lstm': 'Recurrent Neural Networks (RNN) & LSTMs',
      'svm': 'Support Vector Machines (SVM) & Kernel Trick',
      'kernel trick': 'Support Vector Machines (SVM) & Kernel Trick',
      'adam': 'Gradient Descent & Adam Optimization',
      'gradient descent': 'Gradient Descent & Adam Optimization',
      'a*': 'A* Pathfinding & Heuristic Search',
      'pathfinding': 'A* Pathfinding & Heuristic Search',
      'sorting': 'Sorting Algorithms',
    };

    if (AI_ALIASES[clean]) {
      const aliasTarget = PRESET_CONCEPTS.find((c) => c.concept === AI_ALIASES[clean]);
      if (aliasTarget) {
        setActiveConcept(aliasTarget);
        sound.playSuccess();
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/concept/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level: 'intermediate' }),
      });
      const data = await res.json();
      if (data && data.concept) {
        // Map simulatorType to valid simulator
        let simType = data.simulatorType;
        if (!['neural_network', 'sorting', 'attention', 'gradient_descent', 'convolution', 'pathfinding'].includes(simType)) {
          const lower = topic.toLowerCase();
          if (lower.includes('sort')) simType = 'sorting';
          else if (lower.includes('transform') || lower.includes('attention') || lower.includes('llm') || lower.includes('token') || lower.includes('rag')) simType = 'attention';
          else if (lower.includes('gradient') || lower.includes('optimi') || lower.includes('loss') || lower.includes('backprop')) simType = 'gradient_descent';
          else if (lower.includes('vision') || lower.includes('cnn') || lower.includes('image') || lower.includes('diffus') || lower.includes('resnet')) simType = 'convolution';
          else if (lower.includes('path') || lower.includes('graph') || lower.includes('search')) simType = 'pathfinding';
          else simType = 'neural_network';
        }

        setActiveConcept({
          ...data,
          simulatorType: simType,
        });
        sound.playSuccess();
      }
    } catch (err) {
      console.error('Error fetching concept:', err);
      sound.playNegative();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate fresh quiz questions
  const handleGenerateNewQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeConcept.concept }),
      });
      const data = await res.json();
      if (data && data.quiz && Array.isArray(data.quiz)) {
        setActiveConcept((prev) => ({
          ...prev,
          quiz: data.quiz,
        }));
        sound.playSuccess();
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      sound.playNegative();
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Pick random concept
  const handleRandomConcept = () => {
    const remaining = PRESET_CONCEPTS.filter((c) => c.concept !== activeConcept.concept);
    const random = remaining[Math.floor(Math.random() * remaining.length)] || PRESET_CONCEPTS[0];
    setActiveConcept(random);
    sound.playPulse(650, 0.1);
  };

  // Section navigation
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    sound.playPulse(480, 0.05);

    // Smooth scroll to the target element if in all-in-one view
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050711] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Background Animated Neural Network */}
      <NeuralBackgroundCanvas />

      {/* Top Bar strictly conforming to 3-zone contract */}
      <TopBar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onRandomConcept={handleRandomConcept}
        onOpenPresets={() => setIsLibraryOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
        masteredCount={progress.masteredConcepts.length}
        totalConcepts={PRESET_CONCEPTS.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-12">
        {/* Navigation Category Pill Strip - Hidden in Focus Mode */}
        {!isFocusMode && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel border border-white/10 shadow-lg">
              <button
                onClick={() => handleNavigate('explorer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === 'explorer'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Concept Explorer</span>
              </button>

              <button
                onClick={() => handleNavigate('simulators')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === 'simulators'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dynamic Visualizers</span>
              </button>

              <button
                onClick={() => handleNavigate('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === 'quiz'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Mini Quiz</span>
              </button>

              <button
                onClick={() => handleNavigate('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === 'chat'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Neural Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Concept Explorer */}
        <section id="explorer">
          <ConceptExplorer
            concept={activeConcept}
            isLoading={isLoading}
            onSearch={handleSearchConcept}
            onJumpToSimulator={() => handleNavigate('simulators')}
            isFocusMode={isFocusMode}
            onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
          />
        </section>

        {/* Non-essential sections are hidden during Focus Mode for an immersive reading experience */}
        {!isFocusMode && (
          <>
            {/* Section 2: Dynamic Visualizers & Simulators */}
            <section id="simulators" className="flex flex-col gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Mental Models & Dynamic Visualization Deck</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Dynamic Concept Simulators
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Manipulate weights, sort randomized arrays with audio pitch synthesis, inspect self-attention token matrices, or roll down gradient descent valleys.
                </p>
              </div>

              <InteractiveVisualizerDeck currentSimulatorType={activeConcept.simulatorType} />
            </section>

            {/* Section 3: Mini Quiz */}
            <section id="quiz" className="flex flex-col gap-6 pt-4 border-t border-white/5">
              <QuizModule
                conceptName={activeConcept.concept}
                questions={activeConcept.quiz}
                onGenerateNewQuiz={handleGenerateNewQuiz}
                isGenerating={isGeneratingQuiz}
                onQuizCompleted={(score, total) => {
                  const updated = recordQuizAttempt(activeConcept.concept, score, total);
                  setProgress(updated);
                }}
              />
            </section>

            {/* Section 4: Neural Chat */}
            <section id="chat" className="flex flex-col gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-1 text-center items-center">
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase">
                  Conversational Reasoning
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Chat With Synapse AI
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                  Ask deep questions about {activeConcept.concept}, request Python code implementations, explore counter-intuitive edge cases, or debate design trade-offs.
                </p>
              </div>

              <NeuralChat
                conceptContext={activeConcept.concept}
                suggestedQuestions={activeConcept.suggestedQuestions}
              />
            </section>
          </>
        )}
      </main>

      {/* Floating Bottom-Right Learning Progress Mini Tracker Widget */}
      {!isFocusMode && (
        <aside className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              setIsProgressOpen(true);
              sound.playPulse(580, 0.05);
            }}
            className="group flex items-center gap-3 p-2.5 pr-4 rounded-2xl glass-panel border border-cyan-500/30 hover:border-cyan-400 bg-slate-950/80 shadow-2xl hover:shadow-cyan-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Click to view full Learning Progress & Mastery charts"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15"
                  stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none"
                />
                <circle
                  cx="18" cy="18" r="15"
                  stroke="url(#mini-grad)" strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 - (Math.round((progress.masteredConcepts.length / PRESET_CONCEPTS.length) * 100) / 100) * 94.2}
                  strokeLinecap="round" fill="none"
                />
                <defs>
                  <linearGradient id="mini-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <Trophy className="w-4 h-4 text-amber-400 absolute" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <span>Mastery</span>
                <span className="text-cyan-400 tabular-nums">
                  {Math.round((progress.masteredConcepts.length / PRESET_CONCEPTS.length) * 100)}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {progress.masteredConcepts.length}/{PRESET_CONCEPTS.length} Mastered · {progress.totalXp} XP
              </span>
            </div>
          </button>
        </aside>
      )}

      {/* Concept Library Modal */}
      <ConceptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectConcept={(c) => setActiveConcept(c)}
        activeConceptName={activeConcept.concept}
      />

      {/* Learning Progress Modal */}
      <LearningProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        onProgressUpdated={(upd) => setProgress(upd)}
        onSelectConcept={(c) => {
          setActiveConcept(c);
          handleNavigate('explorer');
        }}
      />

      {/* Footer conforming to constitution */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-[#03050c] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="font-semibold text-slate-300">Neural Playground</span>
            <span>· Interactive AI & Computer Science Sandbox</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by Gemini 3.8</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Dynamic Canvas Networks</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
