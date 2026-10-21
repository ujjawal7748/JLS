'use client';

import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { PHASES_DATA } from '../data/curriculumData';
import { DifficultyLevel, QuizQuestion, Topic } from '../types';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Shield,
  Layers,
  Code2,
} from 'lucide-react';

interface QuizArenaViewProps {
  selectedTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  selectedTopicId,
  onSelectTopic,
}) => {
  const { progress, recordQuizResult, triggerConfetti } = useTracker();

  // Flatten all topics for selection
  const allTopics: { phaseTitle: string; topic: Topic }[] = [];
  PHASES_DATA.forEach((p) => {
    p.topics.forEach((t) => {
      allTopics.push({ phaseTitle: p.title, topic: t });
    });
  });

  const [currentTopicId, setCurrentTopicId] = useState<string>(
    selectedTopicId || allTopics[0]?.topic.id || ''
  );

  // Sync if prop changes
  useEffect(() => {
    if (selectedTopicId) {
      setCurrentTopicId(selectedTopicId);
    }
  }, [selectedTopicId]);

  // Current Difficulty state
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    progress.preferredDifficulty || 'medium'
  );
  const [isAdaptive, setIsAdaptive] = useState<boolean>(true);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [adaptiveMessage, setAdaptiveMessage] = useState<string | null>(null);

  // Active quiz question state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  // Current topic object
  const currentTopicItem = allTopics.find((item) => item.topic.id === currentTopicId);
  const currentTopic = currentTopicItem?.topic;

  // Filter questions for this topic and difficulty
  // If questions for exact difficulty exist, use them; otherwise fallback to any question in topic
  const topicQuestions = currentTopic?.quizzes || [];
  const filteredQuestions = topicQuestions.filter((q) => q.difficulty === difficulty);
  const questionsToUse = filteredQuestions.length > 0 ? filteredQuestions : topicQuestions;

  const currentQuestion: QuizQuestion | undefined =
    questionsToUse[questionIndex % Math.max(1, questionsToUse.length)];

  // Reset answer when topic, difficulty, or question changes
  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setAdaptiveMessage(null);
  };

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    setDifficulty(newDiff);
    setQuestionIndex(0);
    resetQuestionState();
  };

  const handleTopicChange = (newTopicId: string) => {
    setCurrentTopicId(newTopicId);
    if (onSelectTopic) onSelectTopic(newTopicId);
    setQuestionIndex(0);
    resetQuestionState();
  };

  // Submit Answer & Handle Adaptive Progression
  const handleSubmit = () => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);

    if (isCorrect) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      recordQuizResult(currentQuestion.id, true, difficulty, newStreak);
      triggerConfetti();

      // Adaptive difficulty escalation
      if (isAdaptive) {
        if (difficulty === 'easy') {
          setAdaptiveMessage('🌟 Great job! Moving you up to Medium difficulty!');
          setTimeout(() => {
            setDifficulty('medium');
            resetQuestionState();
          }, 2000);
        } else if (difficulty === 'medium' && newStreak >= 2) {
          setAdaptiveMessage('🔥 2 in a row! Escalating to Hard difficulty!');
          setTimeout(() => {
            setDifficulty('hard');
            resetQuestionState();
          }, 2000);
        } else if (difficulty === 'hard' && newStreak >= 3) {
          setAdaptiveMessage('👑 Flawless! Unlocking Staff/Architect difficulty!');
          setTimeout(() => {
            setDifficulty('architect');
            resetQuestionState();
          }, 2000);
        }
      }
    } else {
      setCorrectStreak(0);
      recordQuizResult(currentQuestion.id, false, difficulty, 0);

      // Adaptive suggestion on miss
      if (isAdaptive && (difficulty === 'hard' || difficulty === 'architect')) {
        setAdaptiveMessage('💡 Challenging question! You can step down to Medium if you prefer.');
      }
    }
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    resetQuestionState();
  };

  const difficultyTiers: {
    id: DifficultyLevel;
    label: string;
    color: string;
    desc: string;
  }[] = [
    {
      id: 'easy',
      label: 'Easy',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
      desc: 'Foundations & Definitions',
    },
    {
      id: 'medium',
      label: 'Medium',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
      desc: 'Spring Mechanics & Config',
    },
    {
      id: 'hard',
      label: 'Hard',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
      desc: 'Gotchas, N+1, Race Conditions',
    },
    {
      id: 'architect',
      label: 'Architect',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
      desc: 'System Design & Distributed Trade-offs',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Topic Selector */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            Adaptive Quiz Arena
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test and cement your knowledge after every topic with automated adaptive difficulty.
          </p>
        </div>

        {/* Topic Selector Dropdown */}
        <div className="w-full lg:w-96">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            Select Topic to Quiz:
          </label>
          <select
            value={currentTopicId}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-300 focus:outline-none focus:border-emerald-500"
          >
            {allTopics.map((item) => (
              <option key={item.topic.id} value={item.topic.id}>
                {item.phaseTitle.split(':')[0]} • {item.topic.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty Controls Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tier Selector Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300 mr-1">Difficulty:</span>
          {difficultyTiers.map((tier) => {
            const isCurrent = difficulty === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => handleDifficultyChange(tier.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  isCurrent
                    ? `${tier.color} shadow-sm scale-105`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        {/* Adaptive Mode Toggle & Streak */}
        <div className="flex items-center gap-4">
          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Streak: {correctStreak}</span>
          </div>

          {/* Adaptive Auto-Scale Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
            <input
              type="checkbox"
              checked={isAdaptive}
              onChange={(e) => setIsAdaptive(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
            />
            <span>Adaptive Auto-Scale</span>
          </label>
        </div>
      </div>

      {/* Adaptive Escalation Banner */}
      {adaptiveMessage && (
        <div className="p-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300 animate-pulse">
          {adaptiveMessage}
        </div>
      )}

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                Question {(questionIndex % questionsToUse.length) + 1} of {questionsToUse.length}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  difficulty === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : difficulty === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : difficulty === 'hard'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}
              >
                {difficulty} Tier
              </span>
            </div>

            <span className="text-xs font-semibold text-emerald-400">
              {currentTopic?.title}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {currentQuestion.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let optionStyle =
                'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

              if (isSubmitted) {
                if (isCorrect) {
                  optionStyle =
                    'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40';
                } else if (isChosen && !isCorrect) {
                  optionStyle =
                    'bg-rose-950/50 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40';
                }
              } else if (isChosen) {
                optionStyle = 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm';
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!isSubmitted) setSelectedOption(idx);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${optionStyle}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : isChosen
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'border-slate-700 text-slate-500'
                        : isChosen
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>

                  <span className="text-xs md:text-sm leading-relaxed flex-1">{option}</span>

                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isSubmitted && isChosen && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons: Submit / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              {isSubmitted
                ? selectedOption === currentQuestion.correctIndex
                  ? '🎉 Correct! Knowledge verified.'
                  : '❌ Incorrect answer. Review explanation below.'
                : 'Select the best option and submit.'}
            </span>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-105"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Detailed In-Depth Explanation Breakdown */}
          {isSubmitted && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                In-Depth Technical Explanation
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {/* Breakdown of Why Wrong Options are Incorrect */}
              {currentQuestion.whyWrong && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Why other choices are incorrect:
                  </span>
                  {Object.entries(currentQuestion.whyWrong).map(([optIdx, reason]) => (
                    <div key={optIdx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">
                        Option {String.fromCharCode(65 + parseInt(optIdx))}:
                      </span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            No questions available for this tier yet
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Try switching to Medium or Easy difficulty to explore this topic.
          </p>
          <button
            onClick={() => handleDifficultyChange('medium')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
          >
            Switch to Medium
          </button>
        </div>
      )}
    </div>
  );
};
