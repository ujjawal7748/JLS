'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgressState, DifficultyLevel, StudySessionLog } from '../types';
import { PHASES_DATA } from '../data/curriculumData';
import { BADGES_DATA, MILESTONES_DATA } from '../data/milestonesData';
import confetti from 'canvas-confetti';

interface TrackerContextType {
  progress: UserProgressState;
  toggleTopicCompletion: (topicId: string) => void;
  toggleMiniProjectCompletion: (phaseId: number) => void;
  toggleChecklistItem: (itemId: string) => void;
  recordQuizResult: (
    quizId: string,
    passed: boolean,
    difficulty: DifficultyLevel,
    isCorrectStreak: number
  ) => void;
  setPreferredDifficulty: (difficulty: DifficultyLevel) => void;
  logStudySession: (hours: number, phaseId: number, notes?: string) => void;
  saveTopicNote: (topicId: string, note: string) => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  triggerConfetti: () => void;
  levelInfo: {
    level: number;
    title: string;
    currentXp: number;
    nextLevelXp: number;
    progressPercent: number;
  };
  totalTopicsCount: number;
  completedTopicsCount: number;
  overallProgressPercent: number;
  weeklyHoursLogged: number;
  weeklyHoursTarget: number;
}

const STORAGE_KEY = 'springboot_tracker_v1';

const INITIAL_STATE: UserProgressState = {
  completedTopics: [],
  completedMiniProjects: [],
  completedChecklistItems: [],
  quizScores: {},
  xp: 0,
  level: 1,
  currentStreak: 1,
  lastActiveDate: '2026-10-21',
  studyLogs: [],
  startDate: '2026-10-21',
  unlockedBadgeIds: [],
  preferredDifficulty: 'medium',
  notes: {},
};

export const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const LEVEL_TITLES = [
  'Novice Java Developer',
  'Junior Backend Initiate',
  'Spring Core Apprentice',
  'REST API Craftsman',
  'Hibernate ORM Specialist',
  'Security & Auth Sentinel',
  'Enterprise Quality Engineer',
  'Event-Driven Architect',
  'Cloud Native Commander',
  'Distributed Systems Sage',
  'Senior Microservices Prodigy',
];

export const TrackerProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<UserProgressState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [weeklyHoursLogged, setWeeklyHoursLogged] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress({
          ...INITIAL_STATE,
          ...parsed,
        });
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update weeklyHoursLogged safely on client
  useEffect(() => {
    if (!isLoaded) return;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const logged = progress.studyLogs
      .filter((log) => new Date(log.date) >= sevenDaysAgo)
      .reduce((sum, log) => sum + log.hoursSpent, 0);
    setWeeklyHoursLogged(logged);
  }, [progress.studyLogs, isLoaded]);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to persist progress to localStorage', e);
    }
  }, [progress, isLoaded]);

  // Check for streak & date update on load
  useEffect(() => {
    if (!isLoaded) return;
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastActive = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round(
        (currentDate.getTime() - lastActive.getTime()) / (1000 * 3600 * 24)
      );

      if (diffDays === 1) {
        // Kept streak!
        setProgress((prev) => ({
          ...prev,
          currentStreak: prev.currentStreak + 1,
          lastActiveDate: today,
          xp: prev.xp + 20, // Daily login XP
        }));
      } else if (diffDays > 1) {
        // Reset streak
        setProgress((prev) => ({
          ...prev,
          currentStreak: 1,
          lastActiveDate: today,
        }));
      }
    }
  }, [isLoaded]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti trigger', e);
    }
  };

  // Check milestones and badges whenever progress updates
  const checkBadgesAndMilestones = (updated: UserProgressState): UserProgressState => {
    const newlyUnlocked: string[] = [...updated.unlockedBadgeIds];
    let addedXp = 0;

    // Check Phase completions for badges
    PHASES_DATA.forEach((phase) => {
      const allPhaseTopicIds = phase.topics.map((t) => t.id);
      const allTopicsDone = allPhaseTopicIds.every((id) => updated.completedTopics.includes(id));
      const miniProjectDone = updated.completedMiniProjects.includes(phase.id);

      // Map phase to badge
      let targetBadgeId = '';
      if (phase.id === 0) targetBadgeId = 'badge-java-craftsman';
      else if (phase.id === 1) targetBadgeId = 'badge-bean-master';
      else if (phase.id === 2) targetBadgeId = 'badge-orm-whisperer';
      else if (phase.id === 3) targetBadgeId = 'badge-security-sentinel';
      else if (phase.id === 5) targetBadgeId = 'badge-kafka-wrangler';
      else if (phase.id === 6) targetBadgeId = 'badge-cloud-commander';
      else if (phase.id === 7) targetBadgeId = 'badge-k8s-captain';
      else if (phase.id === 8) targetBadgeId = 'badge-distributed-sage';
      else if (phase.id === 9) targetBadgeId = 'badge-reactive-virtuoso';
      else if (phase.id === 10) targetBadgeId = 'badge-ai-pioneer';

      if (targetBadgeId && allTopicsDone && miniProjectDone && !newlyUnlocked.includes(targetBadgeId)) {
        newlyUnlocked.push(targetBadgeId);
        const badge = BADGES_DATA.find((b) => b.id === targetBadgeId);
        if (badge) addedXp += badge.xpReward;
        triggerConfetti();
      }
    });

    // Check Junior Ready Milestone (Phases 0-4)
    const juniorPhases = [0, 1, 2, 3, 4];
    const juniorReady = juniorPhases.every((pId) => {
      const ph = PHASES_DATA.find((p) => p.id === pId);
      if (!ph) return false;
      const topicsOk = ph.topics.every((t) => updated.completedTopics.includes(t.id));
      const projectOk = updated.completedMiniProjects.includes(pId);
      return topicsOk && projectOk;
    });

    if (juniorReady && !newlyUnlocked.includes('badge-junior-ready')) {
      newlyUnlocked.push('badge-junior-ready');
      addedXp += 800;
      triggerConfetti();
    }

    // Grand finish
    const allPhasesDone = PHASES_DATA.every((ph) => {
      const topicsOk = ph.topics.every((t) => updated.completedTopics.includes(t.id));
      const projectOk = updated.completedMiniProjects.includes(ph.id);
      return topicsOk && projectOk;
    });

    if (allPhasesDone && !newlyUnlocked.includes('badge-grand-architect')) {
      newlyUnlocked.push('badge-grand-architect');
      addedXp += 1500;
      triggerConfetti();
    }

    if (newlyUnlocked.length !== updated.unlockedBadgeIds.length) {
      return {
        ...updated,
        unlockedBadgeIds: newlyUnlocked,
        xp: updated.xp + addedXp,
      };
    }
    return updated;
  };

  const toggleTopicCompletion = (topicId: string) => {
    setProgress((prev) => {
      const isCompleted = prev.completedTopics.includes(topicId);
      const newCompleted = isCompleted
        ? prev.completedTopics.filter((id) => id !== topicId)
        : [...prev.completedTopics, topicId];

      const xpDelta = isCompleted ? -50 : 50;
      const updated: UserProgressState = {
        ...prev,
        completedTopics: newCompleted,
        xp: Math.max(0, prev.xp + xpDelta),
      };

      if (!isCompleted) triggerConfetti();
      return checkBadgesAndMilestones(updated);
    });
  };

  const toggleMiniProjectCompletion = (phaseId: number) => {
    setProgress((prev) => {
      const isCompleted = prev.completedMiniProjects.includes(phaseId);
      const newProjects = isCompleted
        ? prev.completedMiniProjects.filter((id) => id !== phaseId)
        : [...prev.completedMiniProjects, phaseId];

      const xpDelta = isCompleted ? -150 : 150;
      const updated: UserProgressState = {
        ...prev,
        completedMiniProjects: newProjects,
        xp: Math.max(0, prev.xp + xpDelta),
      };

      if (!isCompleted) triggerConfetti();
      return checkBadgesAndMilestones(updated);
    });
  };

  const toggleChecklistItem = (itemId: string) => {
    setProgress((prev) => {
      const isCompleted = prev.completedChecklistItems.includes(itemId);
      const newItems = isCompleted
        ? prev.completedChecklistItems.filter((id) => id !== itemId)
        : [...prev.completedChecklistItems, itemId];

      return {
        ...prev,
        completedChecklistItems: newItems,
        xp: Math.max(0, prev.xp + (isCompleted ? -30 : 30)),
      };
    });
  };

  const recordQuizResult = (
    quizId: string,
    passed: boolean,
    difficulty: DifficultyLevel,
    isCorrectStreak: number
  ) => {
    setProgress((prev) => {
      const prevRecord = prev.quizScores[quizId];
      const attempts = (prevRecord?.attempts || 0) + 1;
      let earnedXp = 0;

      if (passed && (!prevRecord || !prevRecord.passed)) {
        // First time passing
        const diffMultiplier =
          difficulty === 'easy' ? 20 : difficulty === 'medium' ? 35 : difficulty === 'hard' ? 50 : 75;
        earnedXp = diffMultiplier + isCorrectStreak * 10;
        triggerConfetti();
      }

      const updatedScores = {
        ...prev.quizScores,
        [quizId]: {
          passed: passed || (prevRecord?.passed ?? false),
          difficulty,
          attempts,
          lastScore: passed ? 100 : 0,
        },
      };

      return {
        ...prev,
        quizScores: updatedScores,
        xp: prev.xp + earnedXp,
      };
    });
  };

  const setPreferredDifficulty = (difficulty: DifficultyLevel) => {
    setProgress((prev) => ({
      ...prev,
      preferredDifficulty: difficulty,
    }));
  };

  const logStudySession = (hours: number, phaseId: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      date: today,
      hoursSpent: hours,
      isWeekend,
      phaseId,
      notes,
    };

    const earnedXp = Math.round(hours * 30);

    setProgress((prev) => ({
      ...prev,
      studyLogs: [newLog, ...prev.studyLogs],
      xp: prev.xp + earnedXp,
    }));

    triggerConfetti();
  };

  const saveTopicNote = (topicId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [topicId]: note,
      },
    }));
  };

  const resetProgress = () => {
    setProgress(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportData = () => {
    return JSON.stringify(progress, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed.xp === 'number') {
        setProgress(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Level computation: 400 XP per level
  const xpPerLevel = 400;
  const currentLevelNumber = Math.min(10, Math.floor(progress.xp / xpPerLevel) + 1);
  const currentLevelXp = progress.xp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));
  const levelTitle = LEVEL_TITLES[currentLevelNumber - 1] || 'Distributed Systems Legend';

  const levelInfo = {
    level: currentLevelNumber,
    title: levelTitle,
    currentXp: currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent,
  };

  // Total topics count
  const totalTopicsCount = PHASES_DATA.reduce((acc, p) => acc + p.topics.length, 0);
  const completedTopicsCount = progress.completedTopics.length;
  const overallProgressPercent = Math.min(
    100,
    Math.round((completedTopicsCount / Math.max(1, totalTopicsCount)) * 100)
  );

  // Weekly study hours target
  // Target: Weekday 3 hr/day * 5 = 15 hr. Weekend 6.5 hr/day * 2 = 13 hr. Total target = 28 hr.
  const weeklyHoursTarget = 28;

  return (
    <TrackerContext.Provider
      value={{
        progress,
        toggleTopicCompletion,
        toggleMiniProjectCompletion,
        toggleChecklistItem,
        recordQuizResult,
        setPreferredDifficulty,
        logStudySession,
        saveTopicNote,
        resetProgress,
        exportData,
        importData,
        triggerConfetti,
        levelInfo,
        totalTopicsCount,
        completedTopicsCount,
        overallProgressPercent,
        weeklyHoursLogged,
        weeklyHoursTarget,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
