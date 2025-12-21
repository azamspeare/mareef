/**
 * Image path utilities for handling theme-aware images and optimization
 */

export interface ThemedImage {
  light: string
  dark: string
}

/**
 * Image paths for dashboard mockups
 */
export const dashboardMockups: ThemedImage = {
  light: '/images/dashboard-mockups/light.png',
  dark: '/images/dashboard-mockups/dark.png',
}

/**
 * Image paths for feature mockups
 */
export const featureMockups = {
  createTask: {
    light: '/images/feature-mockups/create-task/light.png',
    dark: '/images/feature-mockups/create-task/dark.png',
  },
  submissionView: {
    light: '/images/feature-mockups/submission-view/light.png',
    dark: '/images/feature-mockups/submission-view/dark.png',
  },
  evaluationFlow: {
    light: '/images/feature-mockups/evaluation-flow/light.png',
    dark: '/images/feature-mockups/evaluation-flow/dark.png',
  },
  languageTeachers: {
    light: '/images/feature-mockups/language-teachers/light.png',
    dark: '/images/feature-mockups/language-teachers/dark.png',
  },
  feedbackSimple: {
    light: '/images/feature-mockups/feedback-simple/light.png',
    dark: '/images/feature-mockups/feedback-simple/dark.png',
  },
} as const

/**
 * Image paths for task mockups
 */
export const taskMockups = {
  writing: {
    light: '/images/task-mockup/writing/light.png',
    dark: '/images/task-mockup/writing/dark.png',
  },
} as const

/**
 * OG images for social sharing (must be absolute paths for crawlers)
 */
export const ogImages = {
  welcome: '/images/og/welcome.png',
  pricing: '/images/og/pricing.png',
  tasks: '/images/og/tasks.png',
  writingTask: '/images/og/writing-task.png',
} as const

/**
 * Social media icons
 */
export const socialIcons = {
  telegram: '/images/social-media/telegram.png',
} as const
