'use client';

import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import {
  Menu,
  Download,
  Upload,
  RotateCcw,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setMobileOpen: (open: boolean) => void;
}

const TAB_TITLES: { [key: string]: string } = {
  dashboard: 'Dashboard Overview',
  'learning-hub': 'Concept Learning Hub',
  curriculum: 'Roadmap & Topics',
  quizzes: 'Topic Quizzes',
  milestones: 'Milestones & Rewards',
  schedule: '3-Month Schedule & Focus Timer',
  interview: 'Interview Questions & Model Answers',
  capstone: 'Capstone Architecture Blueprint',
  checklists: 'Job Readiness Verification',
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setMobileOpen }) => {
  const {
    progress,
    weeklyHoursLogged,
    weeklyHoursTarget,
    exportData,
    importData,
    resetProgress,
  } = useTracker();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `springboot-study-tracker-${new Date().toISOString().split('T')[0]}.json`;
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

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            title="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hidden sm:inline text-slate-500">Roadmap</span>
            <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-600" />
            <h1 className="text-white font-bold text-sm tracking-tight">
              {TAB_TITLES[activeTab] || 'Dashboard'}
            </h1>
          </div>
        </div>

        {/* Center: Subtle study pace indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800/80 rounded-full text-slate-300 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>90-Day Schedule: Weekday 3h • Weekend 6.5h</span>
        </div>

        {/* Right: Quick Stats & Data Management */}
        <div className="flex items-center gap-2.5">
          {/* Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold"
            title="Daily Study Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{progress.currentStreak}d</span>
          </div>

          {/* Weekly Hours */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold"
            title="Hours logged past 7 days"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {weeklyHoursLogged}/{weeklyHoursTarget}h
            </span>
          </div>

          {/* Backup & Actions */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={handleExport}
              title="Export Progress Backup (JSON)"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              title="Import Progress Backup (JSON)"
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Reset your study progress to start over?')) {
                  resetProgress();
                }
              }}
              title="Reset Progress"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* JSON Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Import Progress Backup
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste your saved JSON backup below to restore your completed topics, quiz scores, and study hours.
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500"
            />
            {importError && (
              <p className="text-xs text-rose-400 mt-2">
                Invalid JSON format. Please verify your backup file.
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
