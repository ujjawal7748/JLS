'use client';

import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { PHASES_DATA } from '../data/curriculumData';
import { MILESTONES_DATA } from '../data/milestonesData';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Target,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onSelectTopicForQuiz?: (topicId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onSelectTopicForQuiz,
}) => {
  const {
    progress,
    levelInfo,
    overallProgressPercent,
    completedTopicsCount,
    totalTopicsCount,
    weeklyHoursLogged,
    weeklyHoursTarget,
  } = useTracker();

  // Find the first uncompleted topic to provide a "Next Up" quick resume
  let nextUpTopic = null;
  let nextUpPhase = null;
  for (const phase of PHASES_DATA) {
    const uncompleted = phase.topics.find((t) => !progress.completedTopics.includes(t.id));
    if (uncompleted) {
      nextUpTopic = uncompleted;
      nextUpPhase = phase;
      break;
    }
  }

  // Safe 3-Month (90-day / 14-week) schedule metrics
  const [timelineInfo, setTimelineInfo] = React.useState({
    startDateStr: 'Day 1',
    targetDateStr: 'Day 90',
    daysElapsed: 1,
    daysRemaining: 89,
    timelineProgress: 1,
  });

  React.useEffect(() => {
    const sDate = new Date(progress.startDate || '2026-10-21');
    const tDate = new Date(sDate);
    tDate.setDate(tDate.getDate() + 90);

    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - sDate.getTime());
    const elapsed = Math.min(90, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const remaining = Math.max(0, 90 - elapsed);
    const progressPct = Math.min(100, Math.round((elapsed / 90) * 100));

    setTimelineInfo({
      startDateStr: sDate.toLocaleDateString(),
      targetDateStr: tDate.toLocaleDateString(),
      daysElapsed: elapsed,
      daysRemaining: remaining,
      timelineProgress: progressPct,
    });
  }, [progress.startDate]);

  // Count milestones unlocked
  const milestonesUnlocked = MILESTONES_DATA.filter((m) =>
    progress.unlockedBadgeIds.includes(m.rewardBadgeId)
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 p-6 md:p-8 shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3-Month Job-Ready Accelerator</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Spring Boot to Microservices
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              Master the exact stack hiring managers look for: Spring Boot 3, PostgreSQL, Spring
              Security 6, Kafka, Redis, Docker, Kubernetes, and Distributed SAGA patterns.
            </p>
          </div>

          {/* Quick Resume Button */}
          {nextUpTopic && nextUpPhase && (
            <div className="flex-shrink-0 bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shadow-lg">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Next Up ({nextUpPhase.targetWeek})
              </span>
              <p className="text-sm font-bold text-white max-w-[220px] truncate mb-3">
                {nextUpTopic.title}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-emerald-950/50"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Study Topic
                </button>
                <button
                  onClick={() => {
                    if (onSelectTopicForQuiz) onSelectTopicForQuiz(nextUpTopic.id);
                    setActiveTab('quizzes');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-500/20 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Curriculum Progress</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-white">{overallProgressPercent}%</span>
            <span className="text-xs text-slate-400">
              ({completedTopicsCount}/{totalTopicsCount} topics)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Current Developer Rank</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-amber-400">Level {levelInfo.level}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate mb-2">{levelInfo.title}</p>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Weekly Study Pace Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">7-Day Study Pace</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-white">{weeklyHoursLogged}h</span>
            <span className="text-xs text-slate-400">/ {weeklyHoursTarget}h target</span>
          </div>
          <p className="text-[11px] text-cyan-400/90 font-medium">
            Weekday 3h/d • Weekend 6-7h/d
          </p>
        </div>

        {/* Streak & Milestones */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Streak & Badges</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-white">{progress.currentStreak}</span>
            <span className="text-xs text-slate-400">Day Streak</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Milestones:</span>
            <span className="font-bold text-emerald-400">
              {milestonesUnlocked} / {MILESTONES_DATA.length}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Month Pacing Timeline & Junior Gateway Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Pacer (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                3-Month Schedule Pacing (90 Days / 14 Weeks)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {timelineInfo.daysRemaining} Days Left
            </span>
          </div>

          {/* Timeline Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Day 1 ({timelineInfo.startDateStr})</span>
              <span className="font-semibold text-slate-200">Day {timelineInfo.daysElapsed} (Today)</span>
              <span>Day 90 ({timelineInfo.targetDateStr})</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full"
                style={{ width: `${timelineInfo.timelineProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 bg-slate-950/40 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Target Rate
              </span>
              <span className="text-xs font-bold text-emerald-300">~30 hrs / week</span>
            </div>
            <div className="p-2 bg-slate-950/40 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Weekday Habit
              </span>
              <span className="text-xs font-bold text-cyan-300">3 hrs / day</span>
            </div>
            <div className="p-2 bg-slate-950/40 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Weekend Deep Work
              </span>
              <span className="text-xs font-bold text-amber-300">6–7 hrs / day</span>
            </div>
          </div>
        </div>

        {/* Junior Job-Ready Gateway Callout (1 col) */}
        <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Critical Gateway
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Junior Role Readiness in 6 Weeks
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Phases 0–4 (Java, SQL, REST APIs, JPA/Hibernate, Spring Security 6, Testing & CI/CD) are
              sufficient to start applying for Junior Java / Spring Boot developer positions!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('milestones')}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950/50"
          >
            <span>View Gateway Milestones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Phase Roadmap Snapshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            14-Week Curriculum Roadmap
          </h2>
          <button
            onClick={() => setActiveTab('curriculum')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Explore All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHASES_DATA.map((phase) => {
            const completedCount = phase.topics.filter((t) =>
              progress.completedTopics.includes(t.id)
            ).length;
            const isFullyDone =
              completedCount === phase.topics.length &&
              progress.completedMiniProjects.includes(phase.id);
            const isProjectDone = progress.completedMiniProjects.includes(phase.id);

            const priorityBadge =
              phase.priority === 'Must'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : phase.priority === 'Should'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

            return (
              <div
                key={phase.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isFullyDone
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}
                  >
                    {phase.priority} • {phase.targetWeek}
                  </span>
                  {isFullyDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      {completedCount}/{phase.topics.length} done
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-1">
                  {phase.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{phase.subtitle}</p>

                {/* Progress Mini Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${(completedCount / phase.topics.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Mini Project: {isProjectDone ? '✅ Done' : '⏳ Pending'}
                  </span>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
