'use client';

import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { MILESTONES_DATA, BADGES_DATA } from '../data/milestonesData';
import { PHASES_DATA } from '../data/curriculumData';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  Crown,
} from 'lucide-react';

interface MilestonesViewProps {
  setActiveTab: (tab: string) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ setActiveTab }) => {
  const { progress, levelInfo, triggerConfetti } = useTracker();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Milestones & Rewards Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your road to hiring readiness, unlock achievements, and earn XP.
          </p>
        </div>

        {/* Level Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-950 p-2.5 px-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Current Rank
            </span>
            <span className="text-sm font-black text-amber-400">
              Level {levelInfo.level} • {levelInfo.title}
            </span>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Total XP
            </span>
            <span className="text-sm font-extrabold text-emerald-400">{progress.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Unlocked Badges ({progress.unlockedBadgeIds.length} / {BADGES_DATA.length})
          </h2>
          <button
            onClick={triggerConfetti}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Celebrate Progress</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div
                    className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl transition-transform ${
                      isUnlocked
                        ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-inner scale-105'
                        : 'bg-slate-900 border border-slate-800 grayscale'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <h3
                    className={`text-xs font-bold ${
                      isUnlocked ? 'text-white' : 'text-slate-400'
                    } mb-1`}
                  >
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 mt-2">
                  <span
                    className={`text-[10px] font-bold ${
                      isUnlocked ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isUnlocked ? `✅ +${badge.xpReward} XP Unlocked` : badge.criteria}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-Week Milestone Road */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          14-Week Milestone Road
        </h2>

        <div className="space-y-4">
          {MILESTONES_DATA.map((milestone, idx) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(milestone.rewardBadgeId);
            const rewardBadge = BADGES_DATA.find((b) => b.id === milestone.rewardBadgeId);

            // Compute phase completion
            const requiredPhases = PHASES_DATA.filter((p) => milestone.phaseIds.includes(p.id));
            const allPhasesDone = requiredPhases.every((p) => {
              const topicsDone = p.topics.every((t) => progress.completedTopics.includes(t.id));
              const projectDone = progress.completedMiniProjects.includes(p.id);
              return topicsDone && projectDone;
            });

            return (
              <div
                key={milestone.id}
                className={`p-5 rounded-2xl border transition-all ${
                  milestone.isJuniorMilestone
                    ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/60 shadow-xl'
                    : isUnlocked
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${
                        isUnlocked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? '✓' : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          Target: Week {milestone.targetWeek}
                        </span>
                        {milestone.isJuniorMilestone && (
                          <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/30 px-2.5 py-0.5 rounded-full border border-emerald-400 animate-pulse">
                            🚀 JUNIOR JOB-READY GATEWAY
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          +{milestone.xpReward} XP
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-white">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Status / Reward */}
                  <div className="flex items-center gap-3 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                    {rewardBadge && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rewardBadge.icon}</span>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">Reward Badge</span>
                          <span className="text-xs font-bold text-slate-200">
                            {rewardBadge.title}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="ml-2">
                      {isUnlocked ? (
                        <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
