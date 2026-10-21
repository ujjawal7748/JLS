'use client';

import React, { useState } from 'react';
import { TrackerProvider } from '../context/TrackerContext';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { DashboardView } from '../components/DashboardView';
import { GFGTutorialView } from '../components/GFGTutorialView';
import { PhaseExplorerView } from '../components/PhaseExplorerView';
import { QuizArenaView } from '../components/QuizArenaView';
import { MilestonesView } from '../components/MilestonesView';
import { SchedulePlannerView } from '../components/SchedulePlannerView';
import { FlashcardsView } from '../components/FlashcardsView';
import { CapstoneArchitectView } from '../components/CapstoneArchitectView';
import { ChecklistsView } from '../components/ChecklistsView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const handleSelectTopicForQuiz = (topicId: string) => {
    setSelectedTopicForQuiz(topicId);
    setActiveTab('quizzes');
  };

  return (
    <TrackerProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Right Main Body (Offset by sidebar width) */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Minimized Top Header */}
          <Navbar activeTab={activeTab} setMobileOpen={setMobileSidebarOpen} />

          {/* Main Content Arena */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                setActiveTab={setActiveTab}
                onSelectTopicForQuiz={handleSelectTopicForQuiz}
              />
            )}

            {activeTab === 'gfg-hub' && (
              <GFGTutorialView
                onSelectTopicForQuiz={handleSelectTopicForQuiz}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'curriculum' && (
              <PhaseExplorerView
                onSelectTopicForQuiz={handleSelectTopicForQuiz}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'quizzes' && (
              <QuizArenaView
                selectedTopicId={selectedTopicForQuiz}
                onSelectTopic={(topicId) => setSelectedTopicForQuiz(topicId)}
              />
            )}

            {activeTab === 'milestones' && <MilestonesView setActiveTab={setActiveTab} />}

            {activeTab === 'schedule' && <SchedulePlannerView />}

            {activeTab === 'interview' && <FlashcardsView />}

            {activeTab === 'capstone' && <CapstoneArchitectView />}

            {activeTab === 'checklists' && <ChecklistsView />}
          </main>

          {/* Footer (Human developer style) */}
          <footer className="border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-medium">
                Spring Boot to Microservices • Personal Study Guide & Progress Tracker
              </span>
              <span className="text-slate-400">
                Paced for 90 Days • LocalStorage Saved
              </span>
            </div>
          </footer>
        </div>
      </div>
    </TrackerProvider>
  );
}
