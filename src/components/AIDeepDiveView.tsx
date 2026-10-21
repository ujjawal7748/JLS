'use client';

import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { PHASES_DATA } from '../data/curriculumData';
import { CONCEPT_CURRICULUM_DATA } from '../data/conceptCurriculumData';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Sparkles,
  BookOpen,
  Code2,
  HelpCircle,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Save,
  RotateCcw,
  Search,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Flame,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

export interface DeepDiveTopicContext {
  phaseTitle?: string;
  topicTitle: string;
  subTopicTitle?: string;
  subTopicId?: string;
  keyConcepts?: string[];
}

interface AIDeepDiveViewProps {
  initialTopic?: DeepDiveTopicContext | null;
  onClearInitialTopic?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const AIDeepDiveView: React.FC<AIDeepDiveViewProps> = ({
  initialTopic,
  onClearInitialTopic,
  setActiveTab,
}) => {
  const { saveTopicNote } = useTracker();

  // Active topic context
  const [currentTopic, setCurrentTopic] = useState<DeepDiveTopicContext>(
    initialTopic || {
      phaseTitle: 'Phase 2: Spring Boot 3 Core & Architecture',
      topicTitle: 'Spring Boot Autoconfiguration & Starters',
      subTopicTitle: 'How @EnableAutoConfiguration Works & META-INF/spring',
      subTopicId: 'p2-st-autoconfig',
      keyConcepts: [
        '@SpringBootApplication composition',
        '@EnableAutoConfiguration',
        '@ConditionalOnClass / @ConditionalOnMissingBean',
        'META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports',
      ],
    }
  );

  // Generation options
  const [generationMode, setGenerationMode] = useState<
    'deep-dive' | 'code-walkthrough' | 'interview-drill' | 'troubleshooting' | 'custom'
  >('deep-dive');
  const [customQuery, setCustomQuery] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  // Execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Gemini API Key config
  const [hasEnvKey, setHasEnvKey] = useState<boolean | null>(null);
  const [sessionKey, setSessionKey] = useState<string>('');
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);

  // Topic selector modal / search state
  const [isTopicPickerOpen, setIsTopicPickerOpen] = useState(false);
  const [topicSearchTerm, setTopicSearchTerm] = useState('');

  // Sync initialTopic prop when parent updates it
  useEffect(() => {
    if (initialTopic) {
      setCurrentTopic(initialTopic);
      // Check cache for this topic
      loadCachedNotes(initialTopic);
    }
  }, [initialTopic]);

  // Check if GEMINI_API_KEY is present in process.env
  useEffect(() => {
    // Also load any saved session key
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('gemini_session_key') : null;
    if (savedKey) setSessionKey(savedKey);

    async function checkStatus() {
      try {
        const res = await fetch('/api/generate-topic-info');
        if (res.ok) {
          const data = await res.json();
          setHasEnvKey(data.hasEnvKey);
        } else {
          setHasEnvKey(false);
        }
      } catch {
        setHasEnvKey(false);
      }
    }
    checkStatus();

    // Load cached notes for current default topic if present
    loadCachedNotes(currentTopic);
  }, []);

  const getCacheKey = (topic: DeepDiveTopicContext, mode: string) => {
    const id = topic.subTopicId || topic.subTopicTitle || topic.topicTitle;
    return `deepdive_cache_${id.replace(/[^a-zA-Z0-9_-]/g, '_')}_${mode}`;
  };

  const loadCachedNotes = (topic: DeepDiveTopicContext) => {
    try {
      const key = getCacheKey(topic, generationMode);
      const cached = localStorage.getItem(key);
      if (cached) {
        setGeneratedMarkdown(cached);
        setError(null);
      } else {
        setGeneratedMarkdown(null);
      }
    } catch {
      // ignore storage error
    }
  };

  const handleSaveSessionKey = (key: string) => {
    setSessionKey(key);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gemini_session_key', key);
    }
  };

  const handleGenerate = async (overridePrompt?: string) => {
    setIsGenerating(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const payload = {
        phaseTitle: currentTopic.phaseTitle,
        topicTitle: currentTopic.topicTitle,
        subTopicTitle: currentTopic.subTopicTitle,
        keyConcepts: currentTopic.keyConcepts,
        mode: generationMode,
        customQuery: overridePrompt || customQuery,
        userApiKey: sessionKey || undefined,
      };

      const res = await fetch('/api/generate-topic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionKey ? { 'x-gemini-key': sessionKey } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'MISSING_API_KEY') {
          setError(
            'Missing Gemini API Key. Please add GEMINI_API_KEY=your_key in your .env.local file or enter it in the key drawer above.'
          );
          setShowKeyDrawer(true);
        } else {
          setError(data.message || 'Failed to generate topic deep dive.');
        }
        setIsGenerating(false);
        return;
      }

      setGeneratedMarkdown(data.markdown);
      setUsedModel(data.model);

      // Cache locally
      try {
        const cacheKey = getCacheKey(currentTopic, generationMode);
        localStorage.setItem(cacheKey, data.markdown);
      } catch {
        // quota exceeded or private mode
      }
    } catch (err: any) {
      setError(err?.message || 'Network error while contacting Gemini API route.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;

    const followUpQueryText = `Follow-up question on ${currentTopic.subTopicTitle || currentTopic.topicTitle}: ${followUpQuestion.trim()}. Provide deep architectural answers with exact Java code examples.`;
    handleGenerate(followUpQueryText);
    setFollowUpQuestion('');
  };

  const handleCopyAll = () => {
    if (!generatedMarkdown) return;
    navigator.clipboard.writeText(generatedMarkdown);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleSaveToTrackerNotes = () => {
    if (!generatedMarkdown) return;
    const noteKey = currentTopic.subTopicId || currentTopic.topicTitle;
    const cleanHeader = `[Gemini Deep Dive: ${currentTopic.subTopicTitle || currentTopic.topicTitle}]\n`;
    saveTopicNote(noteKey, cleanHeader + generatedMarkdown);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Compile list of all selectable topics & subtopics from curriculum
  const allSelectableTopics: {
    phaseTitle: string;
    topicTitle: string;
    subTopicTitle: string;
    subTopicId: string;
    keyConcepts: string[];
  }[] = [];

  // From curriculum data
  CONCEPT_CURRICULUM_DATA.forEach((phase) => {
    phase.topics.forEach((topic) => {
      topic.subTopics?.forEach((subTopic) => {
        subTopic.subSubTopics.forEach((sst) => {
          allSelectableTopics.push({
            phaseTitle: `Phase ${phase.id}: ${phase.title}`,
            topicTitle: topic.title,
            subTopicTitle: `${subTopic.title} • ${sst.title}`,
            subTopicId: sst.id,
            keyConcepts: sst.keyTakeaways || [],
          });
        });
      });
    });
  });

  // Also include topics from PHASES_DATA
  PHASES_DATA.forEach((phase) => {
    phase.topics.forEach((topic) => {
      allSelectableTopics.push({
        phaseTitle: `Phase ${phase.id}: ${phase.title}`,
        topicTitle: topic.title,
        subTopicTitle: topic.summary,
        subTopicId: topic.id,
        keyConcepts: topic.keyConcepts,
      });
    });
  });

  const filteredPickerTopics = allSelectableTopics.filter((item) => {
    if (!topicSearchTerm) return true;
    const q = topicSearchTerm.toLowerCase();
    return (
      item.topicTitle.toLowerCase().includes(q) ||
      item.subTopicTitle.toLowerCase().includes(q) ||
      item.phaseTitle.toLowerCase().includes(q)
    );
  });

  const quickPicks = [
    {
      title: 'Spring Boot Bean Lifecycle & Proxy Internals',
      sub: 'How CGLIB, JDK Proxies & BeanPostProcessors Work',
      phase: 'Phase 2: Spring Boot 3 Core',
      id: 'p2-st-bean-lifecycle',
    },
    {
      title: 'Hibernate N+1 Query Problem & EntityGraphs',
      sub: 'Join Fetch vs EntityGraph vs BatchSize in Spring Data JPA',
      phase: 'Phase 3: Data Access & Transactions',
      id: 'p3-st-n-plus-1',
    },
    {
      title: 'Spring Security 6 SecurityFilterChain & JWT',
      sub: 'Stateless JWT Auth, OncePerRequestFilter & CORS/CSRF Rules',
      phase: 'Phase 5: Spring Security & Auth',
      id: 'p5-st-jwt-filter',
    },
    {
      title: 'Kafka Partitions, Consumer Groups & Rebalance Traps',
      sub: 'High-Throughput Partitioning, Offset Management & Dead Letter Queues',
      phase: 'Phase 8: Kafka & Async Messaging',
      id: 'p8-st-kafka-offsets',
    },
    {
      title: 'Virtual Threads (Project Loom) in Spring Boot 3.2+',
      sub: 'Platform Threads vs Virtual Threads & Carrier Pinning Gotchas',
      phase: 'Phase 2: Spring Boot 3 Core',
      id: 'p2-st-virtual-threads',
    },
    {
      title: 'Resilience4j Circuit Breaker & Retry State Machine',
      sub: 'CLOSED, OPEN, HALF-OPEN States & Fallback Methods with Feign',
      phase: 'Phase 6: Microservices & Cloud',
      id: 'p6-st-circuit-breaker',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-16">
      {/* Top Banner & Context */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl shadow-emerald-950/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Engine • On-Demand Deep Dive</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Topic & Subtopic Masterclass Generator
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate human-developer-grade technical breakdowns, complete production Java 21 / Spring Boot 3 code, real-world architectural flows, and senior interview drills directly powered by the Google Gemini API.
            </p>
          </div>

          {/* API Key Status Pill & Actions */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <button
              onClick={() => setShowKeyDrawer(!showKeyDrawer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                hasEnvKey || sessionKey
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>
                {hasEnvKey
                  ? 'Key: Configured (.env.local)'
                  : sessionKey
                  ? 'Key: Active (Session)'
                  : '⚠️ Set Gemini API Key'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showKeyDrawer ? 'rotate-180' : ''}`} />
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Model: {usedModel || 'gemini-2.5-flash'}
            </span>
          </div>
        </div>

        {/* Collapsible Key Config Drawer */}
        {showKeyDrawer && (
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">How Gemini API Key Works:</strong>
                <p className="text-slate-400 mt-0.5">
                  You can set your key permanently in <code className="text-emerald-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">/Users/ujjawal/Desktop/fs/Java/.env.local</code> as:
                </p>
                <div className="mt-1.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-400 border border-slate-800 select-all">
                  GEMINI_API_KEY=your_gemini_api_key_here
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Get a 100% free API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline font-semibold"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </div>
            </div>

            {/* Quick Session Input Field */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="password"
                placeholder="Or paste key for this session (AIzaSy...)"
                value={sessionKey}
                onChange={(e) => handleSaveSessionKey(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => {
                  setShowKeyDrawer(false);
                  if (sessionKey) handleGenerate();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Key & Close</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Selected Topic Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
              {currentTopic.phaseTitle || 'Spring Boot Architecture'}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{currentTopic.subTopicTitle || currentTopic.topicTitle}</span>
            </h2>
            {currentTopic.keyConcepts && currentTopic.keyConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentTopic.keyConcepts.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    • {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsTopicPickerOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Switch Topic</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Deep Dive Focus:</span>

          {[
            { id: 'deep-dive', label: '📖 360° Comprehensive Guide' },
            { id: 'code-walkthrough', label: '💻 Production Code & Config' },
            { id: 'interview-drill', label: '🎯 Senior Interview Drills' },
            { id: 'troubleshooting', label: '⚠️ Gotchas & Memory Leaks' },
          ].map((modeItem) => (
            <button
              key={modeItem.id}
              onClick={() => {
                setGenerationMode(modeItem.id as any);
                // check cache for this mode
                const key = getCacheKey(currentTopic, modeItem.id);
                const cached = localStorage.getItem(key);
                if (cached) {
                  setGeneratedMarkdown(cached);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                generationMode === modeItem.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {modeItem.label}
            </button>
          ))}
        </div>

        {/* Custom Focus Query (Optional) */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Optional specific question (e.g. How does @Transactional handle checked exceptions?)..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full"
          />

          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Deep Dive...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Masterclass Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-red-300">Generation Error</h4>
            <p>{error}</p>
            {!hasEnvKey && !sessionKey && (
              <button
                onClick={() => setShowKeyDrawer(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/60 hover:bg-red-900 text-white font-bold rounded-lg text-xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Open Key Settings</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Blank Page State (Before Generation) */}
      {!generatedMarkdown && !isGenerating && !error && (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">
              Ready to generate deep dive on &ldquo;{currentTopic.subTopicTitle || currentTopic.topicTitle}&rdquo;
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click &ldquo;Generate Masterclass Notes&rdquo; above to prompt Gemini with high-signal engineering questions, production architectural diagrams, runnable code, and interview traps.
            </p>
          </div>

          {/* Quick Pick Tiles */}
          <div className="pt-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Or Explore High-Yield Enterprise Topics:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickPicks.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const selected: DeepDiveTopicContext = {
                      phaseTitle: item.phase,
                      topicTitle: item.title,
                      subTopicTitle: item.sub,
                      subTopicId: item.id,
                    };
                    setCurrentTopic(selected);
                    loadCachedNotes(selected);
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer transition-all group"
                >
                  <span className="text-[10px] text-emerald-400/80 font-bold block mb-1">
                    {item.phase}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isGenerating && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold">
            <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            <span>Consulting Principal Architect Engine via Gemini API...</span>
          </div>

          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-800/60 rounded w-full" />
            <div className="h-4 bg-slate-800/60 rounded w-5/6" />
            <div className="h-32 bg-slate-950 rounded-xl border border-slate-800/80" />
            <div className="h-4 bg-slate-800/60 rounded w-2/3" />
            <div className="h-24 bg-slate-950 rounded-xl border border-slate-800/80" />
          </div>
        </div>
      )}

      {/* Generated Deep Dive Article Content */}
      {generatedMarkdown && !isGenerating && (
        <div className="space-y-6">
          {/* Top Article Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Masterclass Notes Ready</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                • {usedModel || 'gemini-2.5-flash'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Markdown */}
              <button
                onClick={handleCopyAll}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                title="Copy entire markdown notes"
              >
                {copiedFull ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              {/* Save to Personal Notes */}
              <button
                onClick={handleSaveToTrackerNotes}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                title="Save into your study progress notes"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved (+50 XP)!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to My Notes</span>
                  </>
                )}
              </button>

              {/* Regenerate */}
              <button
                onClick={() => handleGenerate()}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Regenerate notes"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rendered Document */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-950/50">
            <MarkdownRenderer content={generatedMarkdown} />
          </div>

          {/* Interactive Follow-up Question Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask a Follow-Up Question or Probe Deeper</span>
            </div>

            <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Gemini to clarify any concept, debug an edge case, or write test code..."
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isGenerating || !followUpQuestion.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Topic Switcher Modal */}
      {isTopicPickerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Select Topic for Deep Dive</h3>
              </div>
              <button
                onClick={() => setIsTopicPickerOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900"
              >
                Close (ESC)
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search among 60+ topics (e.g., OOP, Kafka, Docker, Virtual Threads)..."
                  value={topicSearchTerm}
                  onChange={(e) => setTopicSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPickerTopics.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No matching topics found for &ldquo;{topicSearchTerm}&rdquo;
                </div>
              ) : (
                filteredPickerTopics.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const selected: DeepDiveTopicContext = {
                        phaseTitle: item.phaseTitle,
                        topicTitle: item.topicTitle,
                        subTopicTitle: item.subTopicTitle,
                        subTopicId: item.subTopicId,
                        keyConcepts: item.keyConcepts,
                      };
                      setCurrentTopic(selected);
                      loadCachedNotes(selected);
                      setIsTopicPickerOpen(false);
                    }}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-[85%]">
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        {item.phaseTitle}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                        {item.topicTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.subTopicTitle}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
