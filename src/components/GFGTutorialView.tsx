'use client';

import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { GFG_CURRICULUM_DATA } from '../data/gfgCurriculumData';
import { SubSubTopic, SubTopic, Topic, Phase } from '../types';
import { DeepDiveTopicContext } from './AIDeepDiveView';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Video,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
} from 'lucide-react';

interface GFGTutorialViewProps {
  onSelectTopicForQuiz: (topicId: string) => void;
  onSelectTopicForDeepDive?: (topicContext: DeepDiveTopicContext) => void;
  setActiveTab: (tab: string) => void;
}

export const GFGTutorialView: React.FC<GFGTutorialViewProps> = ({
  onSelectTopicForQuiz,
  onSelectTopicForDeepDive,
  setActiveTab,
}) => {
  const { progress, toggleTopicCompletion } = useTracker();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Active hierarchical navigation state:
  // Phase -> Topic -> Subtopic -> SubSubTopic
  const [activePhaseId, setActivePhaseId] = useState<number>(0);
  const [activeTopicId, setActiveTopicId] = useState<string>('p0-t1-oop');
  const [activeSubTopicId, setActiveSubTopicId] = useState<string>('p0-st-oop-pillars');
  const [activeSubSubTopicId, setActiveSubSubTopicId] = useState<string>('p0-sst-encapsulation');

  // Expanded folders in sidebar tree
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({
    'phase-0': true,
    'topic-p0-t1-oop': true,
    'subtopic-p0-st-oop-pillars': true,
    'phase-1': true,
    'phase-2': true,
    'phase-5': true,
    'phase-8': true,
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Locate currently active node
  const activePhase = GFG_CURRICULUM_DATA.find((p) => p.id === activePhaseId) || GFG_CURRICULUM_DATA[0];
  const activeTopic = activePhase?.topics.find((t) => t.id === activeTopicId) || activePhase?.topics[0];
  const activeSubTopic =
    activeTopic?.subTopics?.find((st) => st.id === activeSubTopicId) || activeTopic?.subTopics?.[0];
  const activeSubSubTopic: SubSubTopic | undefined =
    activeSubTopic?.subSubTopics?.find((sst) => sst.id === activeSubSubTopicId) ||
    activeSubTopic?.subSubTopics?.[0];

  // Flatten all sub-subtopics for seamless Next / Previous navigation (GFG style)
  const flattenedSubSubTopics: {
    phaseId: number;
    phaseTitle: string;
    topicId: string;
    topicTitle: string;
    subTopicId: string;
    subTopicTitle: string;
    subSubTopic: SubSubTopic;
  }[] = [];

  GFG_CURRICULUM_DATA.forEach((phase) => {
    phase.topics.forEach((topic) => {
      topic.subTopics?.forEach((subTopic) => {
        subTopic.subSubTopics.forEach((sst) => {
          flattenedSubSubTopics.push({
            phaseId: phase.id,
            phaseTitle: phase.title,
            topicId: topic.id,
            topicTitle: topic.title,
            subTopicId: subTopic.id,
            subTopicTitle: subTopic.title,
            subSubTopic: sst,
          });
        });
      });
    });
  });

  const currentIndex = flattenedSubSubTopics.findIndex(
    (item) => item.subSubTopic.id === activeSubSubTopic?.id
  );
  const prevItem = currentIndex > 0 ? flattenedSubSubTopics[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < flattenedSubSubTopics.length - 1
      ? flattenedSubSubTopics[currentIndex + 1]
      : null;

  const navigateToItem = (item: typeof flattenedSubSubTopics[0]) => {
    setActivePhaseId(item.phaseId);
    setActiveTopicId(item.topicId);
    setActiveSubTopicId(item.subTopicId);
    setActiveSubSubTopicId(item.subSubTopic.id);
    // ensure sidebar folder is open
    setExpandedFolders((prev) => ({
      ...prev,
      [`phase-${item.phaseId}`]: true,
      [`topic-${item.topicId}`]: true,
      [`subtopic-${item.subTopicId}`]: true,
    }));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isCurrentCompleted = activeSubSubTopic
    ? progress.completedTopics.includes(activeSubSubTopic.id)
    : false;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>GFG-Style Learning Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">
            Topics • Subtopics • Sub-subtopics Architecture
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Structured documentation with in-depth technical explanations, code snippets, official documentation links, and recommended YouTube videos by channel name.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 flex-shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Hub Progress
            </span>
            <span className="text-xs font-black text-emerald-400">
              {progress.completedTopics.length} / {flattenedSubSubTopics.length} Subtopics Read
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/40">
            {Math.round((progress.completedTopics.length / Math.max(1, flattenedSubSubTopics.length)) * 100)}%
          </div>
        </div>
      </div>

      {/* Main 3-Column / 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: GFG-Style Tree Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 max-h-[85vh] overflow-y-auto sticky top-20 shadow-xl">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subtopics, concepts..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Table of Contents
          </div>

          {/* Hierarchical Tree */}
          <div className="space-y-2">
            {GFG_CURRICULUM_DATA.map((phase) => {
              const phaseKey = `phase-${phase.id}`;
              const isPhaseOpen = !!expandedFolders[phaseKey];

              return (
                <div key={phase.id} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                  {/* Level 1: Phase / Topic Category */}
                  <div
                    onClick={() => toggleFolder(phaseKey)}
                    className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors text-xs font-bold text-slate-200"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isPhaseOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      )}
                      <span className="truncate">{phase.title.split(':')[0]}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {phase.priority}
                    </span>
                  </div>

                  {/* Level 2: Topic & Subtopics */}
                  {isPhaseOpen && (
                    <div className="pl-3 pr-1 py-1 space-y-1 border-t border-slate-800/50 bg-slate-950/20">
                      {phase.topics.map((topic) => {
                        const topicKey = `topic-${topic.id}`;
                        const isTopicOpen = !!expandedFolders[topicKey];

                        return (
                          <div key={topic.id} className="space-y-1">
                            <div
                              onClick={() => toggleFolder(topicKey)}
                              className="p-1.5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-800/40 text-[11px] font-semibold text-slate-300"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {isTopicOpen ? (
                                  <ChevronDown className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                            </div>

                            {/* Level 3: Subtopics & Sub-subtopics */}
                            {isTopicOpen && (
                              <div className="pl-4 space-y-1 border-l border-slate-800/60 ml-2">
                                {topic.subTopics?.map((subTopic) => {
                                  const subTopicKey = `subtopic-${subTopic.id}`;
                                  const isSubTopicOpen = !!expandedFolders[subTopicKey];

                                  return (
                                    <div key={subTopic.id} className="space-y-1">
                                      <div
                                        onClick={() => toggleFolder(subTopicKey)}
                                        className="py-1 px-1.5 rounded flex items-center justify-between cursor-pointer text-[11px] font-medium text-emerald-400/90 hover:text-emerald-300 hover:bg-slate-800/30"
                                      >
                                        <div className="flex items-center gap-1 truncate">
                                          {isSubTopicOpen ? (
                                            <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                          ) : (
                                            <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                          )}
                                          <span className="truncate">{subTopic.title}</span>
                                        </div>
                                      </div>

                                      {/* Level 4: Sub-subtopic leaves */}
                                      {isSubTopicOpen && (
                                        <div className="pl-3 space-y-1 border-l border-emerald-500/20 ml-2">
                                          {subTopic.subSubTopics.map((sst) => {
                                            const isActive = activeSubSubTopic?.id === sst.id;
                                            const isDone = progress.completedTopics.includes(sst.id);

                                            return (
                                              <div
                                                key={sst.id}
                                                onClick={() => {
                                                  setActivePhaseId(phase.id);
                                                  setActiveTopicId(topic.id);
                                                  setActiveSubTopicId(subTopic.id);
                                                  setActiveSubSubTopicId(sst.id);
                                                }}
                                                className={`py-1 px-2 rounded-lg text-[11px] cursor-pointer flex items-center justify-between transition-all group/item ${
                                                  isActive
                                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-2 border-emerald-400 shadow-sm'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                                }`}
                                              >
                                                <span className="truncate">{sst.title}</span>
                                                <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      onSelectTopicForDeepDive?.({
                                                        phaseTitle: `Phase ${phase.id}: ${phase.title}`,
                                                        topicTitle: topic.title,
                                                        subTopicTitle: `${subTopic.title} • ${sst.title}`,
                                                        subTopicId: sst.id,
                                                        keyConcepts: sst.keyTakeaways || [],
                                                      });
                                                    }}
                                                    className="p-1 rounded text-slate-500 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                                                    title="AI Deep Dive with Gemini"
                                                  >
                                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleTopicCompletion(sst.id);
                                                    }}
                                                    className="p-1 rounded text-slate-500 hover:text-emerald-400 transition-colors"
                                                    title={isDone ? 'Completed' : 'Mark Complete (+50 XP)'}
                                                  >
                                                    {isDone ? (
                                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
                                                    ) : (
                                                      <Circle className="w-3.5 h-3.5" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER / RIGHT COLUMN: GFG-Style Tutorial Article Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeSubSubTopic ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 flex-wrap">
                <span className="text-emerald-400">{activePhase?.title.split(':')[0]}</span>
                <span>/</span>
                <span className="text-slate-300">{activeTopic?.title}</span>
                <span>/</span>
                <span className="text-cyan-400">{activeSubTopic?.title}</span>
              </div>

              {/* Article Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                    {activeSubSubTopic.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>⏱ ~5 min read</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Job-Ready Standard</span>
                  </div>
                </div>

                {/* Actions: Deep Dive & Mark Complete */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      onSelectTopicForDeepDive?.({
                        phaseTitle: activePhase?.title,
                        topicTitle: activeTopic?.title,
                        subTopicTitle: `${activeSubTopic?.title} • ${activeSubSubTopic.title}`,
                        subTopicId: activeSubSubTopic.id,
                        keyConcepts: activeSubSubTopic.keyTakeaways || [],
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 transition-all hover:scale-102 flex-shrink-0"
                    title="Generate comprehensive masterclass notes with Gemini AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>AI Deep Dive</span>
                  </button>

                  <button
                    onClick={() => toggleTopicCompletion(activeSubSubTopic.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                      isCurrentCompleted
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCompleted ? 'Completed' : 'Mark Subtopic Complete (+50 XP)'}</span>
                  </button>
                </div>
              </div>

              {/* GFG Overview Box */}
              {activeSubTopic?.overview && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Subtopic Scope:</strong>
                  {activeSubTopic.overview}
                </div>
              )}

              {/* 1. Deep Concept Details (Tutorial Article Body) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  Concept Explanation & Mechanics
                </h3>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-950/30 p-4 rounded-2xl border border-slate-800/60">
                  {activeSubSubTopic.conceptDetails}
                </p>
              </div>

              {/* 2. Code Snippet Section (GFG Code Box) */}
              {activeSubSubTopic.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Production Java / Spring Snippet
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeSubSubTopic.codeSnippet!)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto font-mono text-xs text-emerald-300 shadow-inner">
                    <pre>{activeSubSubTopic.codeSnippet}</pre>
                  </div>
                </div>
              )}

              {/* 3. GFG Key Takeaways Box */}
              {activeSubSubTopic.keyTakeaways && activeSubSubTopic.keyTakeaways.length > 0 && (
                <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Key Takeaways & Best Practices
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeSubSubTopic.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. GFG Interview Trap / Gotcha Box */}
              {activeSubSubTopic.interviewTrap && (
                <div className="p-5 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Interview Trap & Gotcha
                  </h4>
                  <p className="text-xs text-amber-200 leading-relaxed">
                    {activeSubSubTopic.interviewTrap}
                  </p>
                </div>
              )}

              {/* 5. External Documentation & YouTube Channel Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Documentation Link */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Official Documentation
                    </span>
                    <strong className="text-xs text-white block mt-0.5">
                      {activeSubSubTopic.docLabel || activeSubTopic?.docLabel || 'Official Reference Guide'}
                    </strong>
                  </div>
                  <a
                    href={activeSubSubTopic.docUrl || activeSubTopic?.docUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    <span>Open Reference Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Recommended YouTube Channel & Video Query */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] text-red-400 uppercase tracking-wider block font-bold">
                      Recommended Video • Channel
                    </span>
                    <strong className="text-xs text-white block mt-0.5">
                      Channel: {activeSubSubTopic.youtube?.channelName || activeSubTopic?.youtube?.channelName || 'Top Creator'}
                    </strong>
                    <span className="text-[11px] text-slate-400 block truncate">
                      Topic: {activeSubSubTopic.title}
                    </span>
                  </div>
                  <a
                    href={activeSubSubTopic.youtube?.url || activeSubTopic?.youtube?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 pt-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Video on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 6. Quick Quiz Launcher for this Subtopic */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Test your knowledge on this subtopic
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Take the multi-tier adaptive quiz to earn XP and level up.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectTopicForQuiz(activeTopic.id);
                    setActiveTab('quizzes');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Launch Quiz</span>
                </button>
              </div>

              {/* 7. Bottom Continuous Navigation: Previous & Next Subtopic (GFG Style) */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                {prevItem ? (
                  <button
                    onClick={() => navigateToItem(prevItem)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-colors max-w-[200px] truncate"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{prevItem.subSubTopic.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextItem ? (
                  <button
                    onClick={() => navigateToItem(nextItem)}
                    className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-2 transition-colors max-w-[200px] truncate"
                  >
                    <span className="truncate">{nextItem.subSubTopic.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Select a subtopic from the sidebar</h3>
              <p className="text-xs text-slate-400 mt-1">
                Browse through the 3-level tree to read in-depth tutorials, inspect code snippets, and review interview traps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
