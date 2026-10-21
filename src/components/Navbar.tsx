'use client';

import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import {
  Sparkles,
  Flame,
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Layers,
  RotateCcw,
  Download,
  Upload,
  Clock,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    progress,
    levelInfo,
    resetProgress,
    exportData,
    importData,
    weeklyHoursLogged,
    weeklyHoursTarget,
  } = useTracker();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `springboot-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const success = importData(importJson);
    if (success) {
      setImportModalOpen(false);
      setImportJson('');
      setImportError(false);
    } else {
      setImportError(true);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'curriculum', label: 'Phases & Topics', icon: BookOpen },
    { id: 'quizzes', label: 'Adaptive Quizzes', icon: HelpCircle },
    { id: 'milestones', label: 'Milestones & Badges', icon: Award },
    { id: 'schedule', label: '3-Mo Schedule & Timer', icon: Calendar },
    { id: 'interview', label: 'Interview Q&A', icon: CheckCircle2 },
    { id: 'capstone', label: 'Capstone Blueprint', icon: Layers },
    { id: 'checklists', label: 'Job Readiness', icon: CheckCircle2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-emerald-500/20 shadow-lg shadow-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-lg">
                  ☕
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Spring<span className="text-emerald-400">Master</span>
                </span>
                <span className="block text-[10px] font-medium text-emerald-500/80 uppercase tracking-widest">
                  14-Wk Job-Ready Tracker
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Stats & Controls */}
            <div className="flex items-center gap-3">
              {/* Level & XP Capsule */}
              <div
                onClick={() => setActiveTab('milestones')}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full cursor-pointer hover:border-emerald-500/50 transition-colors"
                title={`${levelInfo.currentXp} / ${levelInfo.nextLevelXp} XP to next level`}
              >
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <span>Lvl {levelInfo.level}</span>
                </div>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {progress.xp} XP
                </span>
              </div>

              {/* Streak */}
              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold"
                title="Daily Study Streak"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{progress.currentStreak}d</span>
              </div>

              {/* Weekly study hours */}
              <div
                onClick={() => setActiveTab('schedule')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold cursor-pointer hover:bg-cyan-500/20 transition-colors"
                title="Weekly Study Hours: Weekday 3h / Weekend 6.5h = 28h Target"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {weeklyHoursLogged} / {weeklyHoursTarget}h
                </span>
              </div>

              {/* Backup / Export Menu */}
              <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                <button
                  onClick={handleExport}
                  title="Export Data Backup (JSON)"
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImportModalOpen(true)}
                  title="Import Backup"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset all progress, XP, and study logs to fresh state?')) {
                      resetProgress();
                    }
                  }}
                  title="Reset Progress"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              Import Study Progress JSON
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste your exported JSON data below to restore your XP, completed topics, and quiz history.
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500"
            />
            {importError && (
              <p className="text-xs text-rose-400 mt-2">
                Invalid JSON format. Please verify the data.
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md"
              >
                Restore Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
