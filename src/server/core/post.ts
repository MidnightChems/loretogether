import { context, reddit } from '@devvit/web/server';

// TypeScript interface for splash screen configuration
interface SplashConfig {
  appDisplayName: string;
  backgroundUri: string;
  buttonLabel: string;
  description: string;
  heading: string;
  appIconUri: string;
  entryUri?: string;
}

// Centralized custom splash screen configuration with LoreTogether branding
export const CUSTOM_SPLASH_CONFIG: SplashConfig = {
  appDisplayName: 'LoreTogether',
  backgroundUri: 'lore-splash.png',
  buttonLabel: 'Lore Together',
  description: 'A Choose-your-own-story builder',
  heading: 'Welcome to LoreTogether! - Sample Story',
  appIconUri: 'lore-icon.png',
  entryUri: 'index.html',
};

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: CUSTOM_SPLASH_CONFIG,
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'loretogether',
  });
};
