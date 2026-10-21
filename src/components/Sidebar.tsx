'use client';

import React from 'react';
import { useTracker } from '../context/TrackerContext';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  HelpCircle,
  Award,
  Calendar,
  CheckCircle2,
  Layers,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { progress, levelInfo } = useTracker();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navigation: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-hub', label: 'Learning Hub', icon: BookOpen },
    { id: 'curriculum', label: 'Roadmap & Topics', icon: Map },
    { id: 'quizzes', label: 'Topic Quizzes', icon: HelpCircle },
    { id: 'milestones', label: 'Milestones & Badges', icon: Award },
    { id: 'schedule', label: 'Schedule & Timer', icon: Calendar },
    { id: 'interview', label: 'Interview Questions', icon: CheckCircle2 },
    { id: 'capstone', label: 'Capstone Architecture', icon: Layers },
    { id: 'checklists', label: 'Job Readiness', icon: FileCheck2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          {!collapsed ? (
            <div
              onClick={() => {
                setActiveTab('dashboard');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-sm">
                  ☕
                </div>
              </div>
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm text-white tracking-tight group-hover:text-emerald-400 transition-colors block truncate">
                  Spring<span className="text-emerald-400">Roadmap</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  3-Month Job Prep
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setActiveTab('dashboard')}
              className="mx-auto cursor-pointer"
              title="SpringRoadmap Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-sm">
                  ☕
                </div>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                } ${collapsed ? 'justify-center' : 'justify-between'}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Capsule */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          {!collapsed ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate max-w-[120px]">
                  Lvl {levelInfo.level} Developer
                </span>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">
                  {progress.xp} XP
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {progress.currentStreak}d Streak
                </span>
                <span className="truncate">{levelInfo.title}</span>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 py-2"
              title={`Level ${levelInfo.level} • ${progress.xp} XP`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                {levelInfo.level}
              </div>
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {progress.currentStreak}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
