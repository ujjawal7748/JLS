'use client';

import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { JOB_READINESS_CHECKLIST, RESUME_BULLETS } from '../data/milestonesData';
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  AlertTriangle,
  Award,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ChecklistsView: React.FC = () => {
  const { progress, toggleChecklistItem } = useTracker();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const completedCount = progress.completedChecklistItems.length;
  const totalCount = JOB_READINESS_CHECKLIST.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const mistakesToAvoid = [
    {
      title: 'Tutorial Hell',
      desc: 'Watching video after video without writing code from scratch. After every phase, close all tabs and build the mini-project independently.',
    },
    {
      title: 'Outdated Spring Boot 2 Tutorials',
      desc: 'Avoid guides using WebSecurityConfigurerAdapter, javax.* packages, or Spring Cloud Sleuth. Spring Boot 3 requires Java 17+, jakarta.*, and Micrometer Tracing.',
    },
    {
      title: 'Skipping Java and SQL Fundamentals',
      desc: 'Most failed Spring interviews fail on basic polymorphism, equals/hashCode, collections, or SQL joins—not Spring annotations.',
    },
    {
      title: 'Microservices Premature Optimization',
      desc: 'Do not start with microservices before you can build a rock-solid monolith with proper transactional boundaries and domain encapsulation.',
    },
    {
      title: 'Blindly Copy-Pasting Security Filters',
      desc: 'Make sure you can draw and explain every filter, entry point, and handler in your Spring Security configuration without notes.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Job-Readiness & Resume Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Validate every hiring competency and copy battle-tested resume bullet points.
          </p>
        </div>

        {/* Readiness Score */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 px-4 rounded-2xl border border-slate-800">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Readiness Score
            </span>
            <span className="text-sm font-extrabold text-white">
              {progressPercent}% Complete ({completedCount}/{totalCount})
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Job-Readiness Verification Checklist
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {completedCount} of {totalCount} verified
          </span>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-3 pt-2">
          {JOB_READINESS_CHECKLIST.map((item) => {
            const isChecked = progress.completedChecklistItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-slate-950/70 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-xs md:text-sm leading-relaxed ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className="ml-2 text-[10px] font-semibold text-emerald-400/80 bg-slate-900 px-2 py-0.5 rounded-full inline-block mt-1">
                    Phase {item.phaseRef}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Resume Bullets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Tailored Resume Bullet Points (Ready to Copy)
          </h2>
          <span className="text-xs text-slate-400">Click icon to copy to clipboard</span>
        </div>

        <div className="space-y-3">
          {RESUME_BULLETS.map((bullet, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start justify-between gap-4 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold text-sm mt-0.5">•</span>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                  {bullet}
                </p>
              </div>

              <button
                onClick={() => handleCopyBullet(bullet, idx)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pitfalls to Avoid */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Common Traps to Avoid During Your 3-Month Prep
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {mistakesToAvoid.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-1">
              <strong className="text-white block font-bold text-xs">{item.title}</strong>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
