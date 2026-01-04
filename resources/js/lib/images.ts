/**
 * Image path utilities for handling theme-aware images and optimization
 * Images are now bundled through Vite for cache-busting and optimization
 */

// Dashboard mockups
import dashboardLight from '@images/dashboard-mockups/light.png'
import dashboardDark from '@images/dashboard-mockups/dark.png'

// Feature mockups - Create Task
import createTaskLight from '@images/feature-mockups/create-task/light.png'
import createTaskDark from '@images/feature-mockups/create-task/dark.png'

// Feature mockups - Submission View
import submissionViewLight from '@images/feature-mockups/submission-view/light.png'
import submissionViewDark from '@images/feature-mockups/submission-view/dark.png'

// Feature mockups - Evaluation Flow
import evaluationFlowLight from '@images/feature-mockups/evaluation-flow/light.png'
import evaluationFlowDark from '@images/feature-mockups/evaluation-flow/dark.png'

// Feature mockups - Language Teachers
import languageTeachersLight from '@images/feature-mockups/language-teachers/light.png'
import languageTeachersDark from '@images/feature-mockups/language-teachers/dark.png'

// Feature mockups - Feedback Simple
import feedbackSimpleLight from '@images/feature-mockups/feedback-simple/light.png'
import feedbackSimpleDark from '@images/feature-mockups/feedback-simple/dark.png'

// Task mockups
import taskWritingLight from '@images/task-mockup/writing/light.png'
import taskWritingDark from '@images/task-mockup/writing/dark.png'

// Logo
import logoSvg from '@images/logo/logo.svg'
import faviconPng from '../../../public/favicon.png'

// Social icons
import telegramIcon from '@images/social-media/telegram.png'

export interface ThemedImage {
  light: string
  dark: string
}

/**
 * Dashboard mockups (bundled with cache-busting)
 */
export const dashboardMockups: ThemedImage = {
  light: dashboardLight,
  dark: dashboardDark,
}

/**
 * Feature mockups (bundled with cache-busting)
 */
export const featureMockups = {
  createTask: {
    light: createTaskLight,
    dark: createTaskDark,
  },
  submissionView: {
    light: submissionViewLight,
    dark: submissionViewDark,
  },
  evaluationFlow: {
    light: evaluationFlowLight,
    dark: evaluationFlowDark,
  },
  languageTeachers: {
    light: languageTeachersLight,
    dark: languageTeachersDark,
  },
  feedbackSimple: {
    light: feedbackSimpleLight,
    dark: feedbackSimpleDark,
  },
} as const

/**
 * Task mockups (bundled with cache-busting)
 */
export const taskMockups = {
  writing: {
    light: taskWritingLight,
    dark: taskWritingDark,
  },
} as const

/**
 * Logo assets (bundled with cache-busting)
 */
export const logo = {
  svg: logoSvg,
  favicon: faviconPng,
} as const

/**
 * Social media icons (bundled with cache-busting)
 */
export const socialIcons = {
  telegram: telegramIcon,
} as const

/**
 * OG images for social sharing
 * These remain as static paths since social crawlers need predictable URLs
 * Keep these in public/images/og/ for proper meta tag handling
 */
export const ogImages = {
  welcome: '/images/og/welcome.png',
  pricing: '/images/og/pricing.png',
  tasks: '/images/og/tasks.png',
  writingTask: '/images/og/writing-task.png',
  quizTask: '/images/og/quiz-task.png',
} as const
