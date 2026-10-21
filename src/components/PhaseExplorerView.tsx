'use client';

import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { PHASES_DATA } from '../data/curriculumData';
import {
  CheckCircle2,
  Circle,
  Video,
  Zap,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  FileCode,
  Flame,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

interface PhaseExplorerViewProps {
  onSelectTopicForQuiz: (topicId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const PhaseExplorerView: React.FC<PhaseExplorerViewProps> = ({
  onSelectTopicForQuiz,
  setActiveTab,
}) => {
  const {
    progress,
    toggleTopicCompletion,
    toggleMiniProjectCompletion,
    saveTopicNote,
  } = useTracker();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPhases, setExpandedPhases] = useState<{ [phaseId: number]: boolean }>({
    0: true,
    1: true,
  });
  const [expandedNotes, setExpandedNotes] = useState<{ [topicId: string]: boolean }>({});

  const togglePhaseExpand = (phaseId: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const filteredPhases = PHASES_DATA.filter((phase) => {
    if (filterPriority !== 'all' && phase.priority !== filterPriority) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = phase.title.toLowerCase().includes(query);
    const subtitleMatch = phase.subtitle.toLowerCase().includes(query);
    const topicMatch = phase.topics.some(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.keyConcepts.some((c) => c.toLowerCase().includes(query))
    );
    return titleMatch || subtitleMatch || topicMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Curriculum & Phase Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            11 Phases from Java Fundamentals to Enterprise Microservices & Spring AI
          </p>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'Must', 'Should', 'Differentiator'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                filterPriority === p
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'all' ? 'All Phases (11)' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, concepts (e.g. N+1, Kafka, JWT, SAGA, Outbox, Virtual Threads)..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Phase List */}
      <div className="space-y-6">
        {filteredPhases.map((phase) => {
          const isExpanded = !!expandedPhases[phase.id];
          const completedTopics = phase.topics.filter((t) =>
            progress.completedTopics.includes(t.id)
          ).length;
          const isProjectDone = progress.completedMiniProjects.includes(phase.id);
          const isAllDone =
            completedTopics === phase.topics.length && isProjectDone;

          const priorityBadge =
            phase.priority === 'Must'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : phase.priority === 'Should'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all ${
                isAllDone
                  ? 'bg-slate-950/80 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Phase Header Accordion Toggle */}
              <div
                onClick={() => togglePhaseExpand(phase.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 rounded-t-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${priorityBadge}`}
                    >
                      {phase.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                      {phase.targetWeek}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ⏱ {phase.weeksCompressed} (was {phase.originalWeeks})
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    {phase.title}
                  </h2>
                  <p className="text-xs text-slate-400">{phase.subtitle}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Progress Pill */}
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200">
                      {completedTopics} / {phase.topics.length} Topics
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Project: {isProjectDone ? '✅ Complete' : '⏳ Pending'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/80 text-slate-300">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Phase Body */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/60 space-y-6">
                  {/* Why it Matters & Fast-Track Focus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        Why This Phase Matters
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {phase.whyItMatters}
                      </p>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        ⚡ Fast-Track Focus
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {phase.fastTrackFocus}
                      </p>
                    </div>
                  </div>

                  {/* YouTube Overview Link & Capstone Contribution */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <FolderGit2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Capstone:</strong>{' '}
                        {phase.capstoneContribution}
                      </span>
                    </div>

                    <a
                      href={phase.overviewVideoQuery}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg font-bold transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Phase Video Search</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Topic Cards */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Phase Topics ({phase.topics.length})
                    </h3>

                    {phase.topics.map((topic) => {
                      const isCompleted = progress.completedTopics.includes(topic.id);
                      const isNoteOpen = !!expandedNotes[topic.id];
                      const userNote = progress.notes[topic.id] || '';

                      return (
                        <div
                          key={topic.id}
                          className={`rounded-xl border p-4 transition-all ${
                            isCompleted
                              ? 'bg-slate-950/60 border-emerald-500/40'
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            {/* Checkbox & Title */}
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTopicCompletion(topic.id)}
                                className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                                title={isCompleted ? 'Mark uncompleted' : 'Mark completed (+50 XP)'}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>

                              <div>
                                <h4
                                  className={`text-sm font-bold ${
                                    isCompleted ? 'text-emerald-300 line-through' : 'text-white'
                                  }`}
                                >
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                  {topic.summary}
                                </p>
                              </div>
                            </div>

                            {/* Quiz Trigger Button */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  onSelectTopicForQuiz(topic.id);
                                  setActiveTab('quizzes');
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-950/50 transition-all hover:scale-105"
                                title="Take adaptive quiz on this topic"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Quiz</span>
                              </button>
                            </div>
                          </div>

                          {/* Key Concepts Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3 mb-3 pl-8">
                            {topic.keyConcepts.map((concept, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700/60"
                              >
                                • {concept}
                              </span>
                            ))}
                          </div>

                          {/* Interview Trap Callout */}
                          {topic.interviewTip && (
                            <div className="ml-8 mb-3 p-2.5 bg-amber-500/10 border-l-2 border-amber-500 rounded-r-lg text-xs text-amber-200">
                              <strong className="text-amber-400">💡 Interview Insight:</strong>{' '}
                              {topic.interviewTip}
                            </div>
                          )}

                          {/* Topic Bottom Actions: YouTube Search & Note */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 ml-8 text-xs">
                            <a
                              href={topic.youtubeSearchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Watch YouTube Search</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() =>
                                setExpandedNotes((prev) => ({
                                  ...prev,
                                  [topic.id]: !prev[topic.id],
                                }))
                              }
                              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                            >
                              <FileCode className="w-3 h-3" />
                              <span>{isNoteOpen ? 'Hide Notes' : userNote ? 'View Notes (1)' : 'Add Note'}</span>
                            </button>
                          </div>

                          {/* Collapsible Personal Note Editor */}
                          {isNoteOpen && (
                            <div className="mt-3 ml-8 space-y-2">
                              <textarea
                                value={userNote}
                                onChange={(e) => saveTopicNote(topic.id, e.target.value)}
                                placeholder="Type your personal insights, code snippets, or gotchas for this topic..."
                                rows={3}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Phase Mini Project Card */}
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          Phase Mini-Project (+150 XP)
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">
                          {phase.miniProject.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => toggleMiniProjectCompletion(phase.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          isProjectDone
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isProjectDone ? 'Project Completed!' : 'Mark Completed'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {phase.miniProject.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800">
                      <div>
                        <strong className="text-white block mb-2">Requirements:</strong>
                        <ul className="space-y-1 text-slate-300">
                          {phase.miniProject.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400">•</span> {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-white block mb-2">Verification Steps:</strong>
                        <ul className="space-y-1 text-slate-300">
                          {phase.miniProject.verificationSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400">✓</span> {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
