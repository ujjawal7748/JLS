'use client';

import React, { useState } from 'react';
import { PHASES_DATA } from '../data/curriculumData';
import {
  HelpCircle,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [knownQuestions, setKnownQuestions] = useState<string[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<{ [key: string]: boolean }>({});

  const toggleKnown = (qText: string) => {
    setKnownQuestions((prev) =>
      prev.includes(qText) ? prev.filter((q) => q !== qText) : [...prev, qText]
    );
  };

  const toggleExpand = (qKey: string) => {
    setExpandedIndex((prev) => ({
      ...prev,
      [qKey]: !prev[qKey],
    }));
  };

  // Aggregate questions
  const allQuestions: {
    phaseId: number;
    phaseTitle: string;
    question: string;
    answer: string;
    keyPoints: string[];
  }[] = [];

  PHASES_DATA.forEach((phase) => {
    phase.interviewQuestions.forEach((q) => {
      allQuestions.push({
        phaseId: phase.id,
        phaseTitle: phase.title,
        question: q.question,
        answer: q.answer,
        keyPoints: q.keyPoints,
      });
    });
  });

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedPhase !== 'all' && q.phaseId !== selectedPhase) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.question.toLowerCase().includes(query) ||
      q.answer.toLowerCase().includes(query) ||
      q.keyPoints.some((p) => p.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Interview Q&A Flashcards
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master the most critical technical interview questions asked in Java / Spring Boot hiring rounds.
          </p>
        </div>

        {/* Known Progress */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 px-4 rounded-2xl border border-slate-800">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Self-Mastery Score
            </span>
            <span className="text-sm font-extrabold text-white">
              {knownQuestions.length} / {allQuestions.length} Mastered
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. N+1, equals, SAGA, Outbox, JWT, CAP)..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <select
          value={selectedPhase}
          onChange={(e) =>
            setSelectedPhase(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
          }
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-semibold focus:outline-none"
        >
          <option value="all">All Phases ({allQuestions.length} Questions)</option>
          {PHASES_DATA.map((p) => (
            <option key={p.id} value={p.id}>
              Phase {p.id}: {p.title.split(':')[1]?.trim() || p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const qKey = `q-${q.phaseId}-${idx}`;
          const isExpanded = !!expandedIndex[qKey];
          const isMastered = knownQuestions.includes(q.question);

          return (
            <div
              key={qKey}
              className={`rounded-2xl border transition-all ${
                isMastered
                  ? 'bg-slate-950/70 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => toggleExpand(qKey)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full inline-block">
                    Phase {q.phaseId}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-white leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKnown(q.question);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isMastered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isMastered ? '✓ Mastered' : 'Mark Known'}
                  </button>

                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 animate-fadeIn">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mt-3">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                      Model Answer:
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      {q.answer}
                    </p>
                  </div>

                  {q.keyPoints.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Key Points to Hit in Interview:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {q.keyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
