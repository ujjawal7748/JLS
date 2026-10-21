'use client';

import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { PHASES_DATA } from '../data/curriculumData';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Zap,
  TrendingUp,
  Plus,
  Flame,
  Award,
} from 'lucide-react';

export const SchedulePlannerView: React.FC = () => {
  const { progress, logStudySession, weeklyHoursLogged, weeklyHoursTarget } = useTracker();

  // Pomodoro Timer State (25 minutes = 1500 seconds)
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedPhaseForTimer, setSelectedPhaseForTimer] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto log 25 mins = ~0.42 hrs
      logStudySession(0.42, selectedPhaseForTimer, 'Pomodoro focus session completed');
      alert('⏰ Pomodoro session completed! 25 minutes logged (+13 XP). Take a 5-minute break!');
      setTimerSeconds(1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, selectedPhaseForTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick manual logging states
  const [customHours, setCustomHours] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [customPhase, setCustomPhase] = useState<number>(0);

  const handleCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = parseFloat(customHours);
    if (!isNaN(hrs) && hrs > 0) {
      logStudySession(hrs, customPhase, customNotes);
      setCustomHours('');
      setCustomNotes('');
    }
  };

  // 14-Week Schedule Definition
  const SCHEDULE_WEEKS = [
    {
      weekNum: 1,
      phaseId: 0,
      focus: 'Phase 0 (Java, SQL, Git, HTTP)',
      deliverable: 'A console app with collections and streams, plus 20 SQL queries.',
      hoursTarget: '30 hrs (Weekday 3h/d + Weekend 6-7h/d)',
    },
    {
      weekNum: 2,
      phaseId: 1,
      focus: 'Phase 1 (Spring Core, Boot, REST)',
      deliverable: 'REST CRUD API with validation, global error handling, and DTOs.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 3,
      phaseId: 2,
      focus: 'Phase 2 (JPA and Hibernate)',
      deliverable: 'PostgreSQL, relationships, pagination, N+1 reproduced and fixed.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 4,
      phaseId: 3,
      focus: 'Phase 3 (Spring Security 6)',
      deliverable: 'Register, login, JWT access/refresh tokens, ADMIN and USER roles.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 5,
      phaseId: 4,
      focus: 'Phase 4 (Testing, AOP, CI/CD)',
      deliverable: 'Unit & slice tests, Testcontainers PostgreSQL test, GitHub Actions CI.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 6,
      phaseId: 5,
      focus: 'Phase 5 (Redis and Kafka)',
      deliverable: 'Order event to Kafka, consumer updates Redis cache with TTL.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 7,
      phaseId: 6,
      focus: 'Phase 6 (Microservices - Part 1)',
      deliverable: 'Services + Eureka + Spring Cloud Gateway routing.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 8,
      phaseId: 6,
      focus: 'Phase 6 (Microservices - Part 2)',
      deliverable: 'Circuit breakers (Resilience4j), fallback, and Zipkin tracing.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 9,
      phaseId: 7,
      focus: 'Phase 7 (Docker and Kubernetes)',
      deliverable: 'Multi-stage builds, Docker Compose, one service deployed to Minikube.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 10,
      phaseId: 8,
      focus: 'Phase 8 (Patterns - Outbox & Idempotency)',
      deliverable: 'Idempotent payment endpoint (SETNX) and Transactional Outbox table.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 11,
      phaseId: 8,
      focus: 'Phase 8 (Patterns - SAGA & Rate Limiting)',
      deliverable: 'Choreography SAGA with compensation, DLT, and Token-Bucket limiter.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 12,
      phaseId: 9,
      focus: 'Phase 9 (Reactive Programming)',
      deliverable: 'WebFlux + R2DBC service with an SSE live order tracker endpoint.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 13,
      phaseId: 10,
      focus: 'Phase 10 (Spring AI, RAG & MCP)',
      deliverable: 'A small RAG app on PGVector and one MCP server tool.',
      hoursTarget: '30 hrs',
    },
    {
      weekNum: 14,
      phaseId: 10,
      focus: 'Polish, Capstone & Mock Interviews',
      deliverable: 'GitHub README, architecture diagram, resume bullets, mock interviews.',
      hoursTarget: '30 hrs',
    },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            3-Month Pacing Schedule & Focus Timer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            14-Week compressed roadmap at ~30 hrs/week (Weekday 3h/day • Weekend 6–7h/day).
          </p>
        </div>

        {/* Weekly Progress Tracker */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 px-4 rounded-2xl border border-slate-800">
          <Clock className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              This Week's Logged Hours
            </span>
            <span className="text-sm font-extrabold text-white">
              {weeklyHoursLogged}h <span className="text-slate-400 font-normal">/ {weeklyHoursTarget}h target</span>
            </span>
          </div>
        </div>
      </div>

      {/* Focus Timer & Quick Logger (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Focus Timer */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              25-Minute Study Pomodoro
            </span>

            <select
              value={selectedPhaseForTimer}
              onChange={(e) => setSelectedPhaseForTimer(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
            >
              {PHASES_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  Phase {p.id}: {p.title.split(':')[1]?.trim() || p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Clock Display */}
          <div className="my-6">
            <div className="text-5xl md:text-6xl font-black font-mono text-white tracking-widest drop-shadow-md">
              {formatTimer(timerSeconds)}
            </div>
            <span className="text-xs text-slate-400 mt-2 block">
              {isTimerRunning ? 'Deep work session in progress...' : 'Ready to start focus block'}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Focus
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(1500);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Log Hours */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Log Study Session
          </h3>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => logStudySession(3.0, selectedPhaseForTimer, 'Weekday study block (3h)')}
              className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-colors"
            >
              <span className="text-xs font-bold text-emerald-400 block">+3.0 Hours</span>
              <span className="text-[10px] text-slate-400">Weekday Target (+90 XP)</span>
            </button>

            <button
              onClick={() => logStudySession(6.5, selectedPhaseForTimer, 'Weekend deep dive (6.5h)')}
              className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-colors"
            >
              <span className="text-xs font-bold text-cyan-400 block">+6.5 Hours</span>
              <span className="text-[10px] text-slate-400">Weekend Deep Work (+195 XP)</span>
            </button>
          </div>

          {/* Custom Log Form */}
          <form onSubmit={handleCustomLog} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                placeholder="Custom hours (e.g. 2.5)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <select
                value={customPhase}
                onChange={(e) => setCustomPhase(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {PHASES_DATA.map((p) => (
                  <option key={p.id} value={p.id}>
                    Phase {p.id}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Session notes (e.g. solved N+1, built JWT filter)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={!customHours}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Record Study Session
            </button>
          </form>
        </div>
      </div>

      {/* 14-Week Calendar & Curriculum Schedule Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          The 14-Week Compressed Schedule
        </h2>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Week</th>
                  <th className="py-3 px-4">Calendar Dates</th>
                  <th className="py-3 px-4">Phase Focus</th>
                  <th className="py-3 px-4">Must-Have Deliverable at End of Week</th>
                  <th className="py-3 px-4 text-right">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {SCHEDULE_WEEKS.map((w) => {
                  let dateLabel = `Week ${w.weekNum}`;
                  if (mounted) {
                    const weekStart = new Date(progress.startDate || '2026-10-21');
                    weekStart.setDate(weekStart.getDate() + (w.weekNum - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    dateLabel = `${weekStart.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })} – ${weekEnd.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}`;
                  }

                  const isJuniorWeek = w.weekNum === 6;

                  return (
                    <tr
                      key={w.weekNum}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isJuniorWeek ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        Week {w.weekNum}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {dateLabel}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-300 whitespace-nowrap">
                        {w.focus}
                        {isJuniorWeek && (
                          <span className="ml-2 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                            ⭐ Apply for Junior Roles
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 leading-relaxed max-w-md">{w.deliverable}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 whitespace-nowrap">
                        {w.hoursTarget}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
