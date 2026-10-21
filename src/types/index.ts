export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'architect';

export interface QuizQuestion {
  id: string;
  topicId: string;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  whyWrong?: { [optionIndex: number]: string };
}

export interface SubSubTopic {
  id: string;
  title: string;
  conceptDetails: string;
  codeSnippet?: string;
  keyTakeaways: string[];
  interviewTrap?: string;
  docUrl?: string;
  docLabel?: string;
  youtube: {
    channelName: string;
    searchQuery: string;
    url: string;
  };
  quizzes?: QuizQuestion[];
}

export interface SubTopic {
  id: string;
  topicId: string;
  title: string;
  overview: string;
  subSubTopics: SubSubTopic[];
  docUrl?: string;
  docLabel?: string;
  youtube: {
    channelName: string;
    searchQuery: string;
    url: string;
  };
  quizzes?: QuizQuestion[];
}

export interface Topic {
  id: string;
  phaseId: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  codeExample?: string;
  youtubeSearchUrl: string;
  interviewTip?: string;
  quizzes: QuizQuestion[];
  subTopics?: SubTopic[];
}

export interface Phase {
  id: number;
  title: string;
  subtitle: string;
  weeksCompressed: string;
  originalWeeks: string;
  priority: 'Must' | 'Should' | 'Differentiator';
  targetWeek: string;
  whyItMatters: string;
  fastTrackFocus: string;
  overviewVideoQuery: string;
  topics: Topic[];
  miniProject: {
    title: string;
    description: string;
    requirements: string[];
    verificationSteps: string[];
  };
  interviewQuestions: {
    question: string;
    answer: string;
    keyPoints: string[];
  }[];
  resources: {
    label: string;
    url: string;
    type: 'course' | 'docs' | 'repo' | 'video' | 'practice';
  }[];
  capstoneContribution: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  criteria: string;
  xpReward: number;
}

export interface Milestone {
  id: string;
  title: string;
  phaseIds: number[];
  targetWeek: number;
  description: string;
  rewardBadgeId: string;
  xpReward: number;
  isJuniorMilestone?: boolean;
}

export interface StudySessionLog {
  id: string;
  date: string;
  hoursSpent: number;
  isWeekend: boolean;
  phaseId: number;
  notes?: string;
}

export interface UserProgressState {
  completedTopics: string[]; // topic/subtopic IDs
  completedMiniProjects: number[]; // phase IDs
  completedChecklistItems: string[];
  quizScores: {
    [quizId: string]: {
      passed: boolean;
      difficulty: DifficultyLevel;
      attempts: number;
      lastScore: number;
    };
  };
  xp: number;
  level: number;
  currentStreak: number;
  lastActiveDate: string;
  studyLogs: StudySessionLog[];
  startDate: string; // ISO date string
  unlockedBadgeIds: string[];
  preferredDifficulty: DifficultyLevel;
  notes: { [topicId: string]: string };
}
