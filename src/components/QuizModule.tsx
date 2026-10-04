import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Sparkles, Award, ArrowRight, Loader2 } from 'lucide-react';
import { QuizQuestion } from '../types';
import { sound } from '../utils/soundEffects';

interface Props {
  conceptName: string;
  questions: QuizQuestion[];
  onGenerateNewQuiz: () => Promise<void>;
  isGenerating: boolean;
  onQuizCompleted?: (score: number, total: number) => void;
}

export const QuizModule: React.FC<Props> = ({
  conceptName,
  questions,
  onGenerateNewQuiz,
  isGenerating,
  onQuizCompleted,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered

    const isCorrect = optIdx === currentQ.correctIndex;
    const nextScore = isCorrect ? score + 1 : score;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setShowExplanation(true);

    if (isCorrect) {
      setScore(nextScore);
      sound.playSuccess();
    } else {
      sound.playNegative();
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(selectedAnswers[currentIdx + 1] !== undefined);
      sound.playPulse(520, 0.05);
    } else {
      setIsCompleted(true);
      sound.playSuccess();
      if (onQuizCompleted) {
        onQuizCompleted(score, questions.length);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
    sound.playPulse(480, 0.05);
  };

  const hasAnsweredCurrent = selectedAnswers[currentIdx] !== undefined;

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col gap-6 max-w-3xl mx-auto w-full border border-white/10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs uppercase font-mono text-cyan-400 font-semibold block">
            Concept Mastery Check
          </span>
          <h2 className="text-xl font-bold text-white font-display">
            {conceptName} Mini Quiz
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300">
            Score: <span className="text-cyan-300 font-bold tabular-nums">{score}</span> / {questions.length}
          </div>
          <button
            onClick={onGenerateNewQuiz}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Fresh Questions</span>
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="flex flex-col gap-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-semibold text-slate-100 font-display leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctIndex;
              const hasAnswered = hasAnsweredCurrent;

              let btnStyle = 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-200';
              let icon = null;

              if (hasAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                  icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                  icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                } else {
                  btnStyle = 'opacity-40 border-transparent text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {hasAnsweredCurrent && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5 animate-fadeIn">
              <span className="text-xs font-mono font-semibold text-cyan-400">
                Intuition & Explanation:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Navigation */}
          {hasAnsweredCurrent && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-[0_0_30px_#38bdf8] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white font-display">
            Quiz Completed!
          </h3>

          <p className="text-slate-300 text-sm max-w-md">
            You scored <span className="text-cyan-400 font-bold">{score} out of {questions.length}</span> (
            {Math.round((score / questions.length) * 100)}% mastery).
          </p>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={onGenerateNewQuiz}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
