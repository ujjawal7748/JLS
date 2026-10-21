'use client';

import React, { useState } from 'react';
import { TrackerProvider } from '../context/TrackerContext';
import { Navbar } from '../components/Navbar';
import { DashboardView } from '../components/DashboardView';
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

  const handleSelectTopicForQuiz = (topicId: string) => {
    setSelectedTopicForQuiz(topicId);
    setActiveTab('quizzes');
  };

  return (
    <TrackerProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Arena */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onSelectTopicForQuiz={handleSelectTopicForQuiz}
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

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Spring Boot to Microservices • 14-Week Job-Ready Curriculum & Adaptive Tracker
            </span>
            <span>
              Deployable on <strong className="text-white">Vercel</strong> • LocalStorage Persistent
            </span>
          </div>
        </footer>
      </div>
    </TrackerProvider>
  );
}
