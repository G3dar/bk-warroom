import { useState, useCallback, createElement, useMemo } from 'react';
import type { Step } from 'react-joyride';

const TUTORIAL_STORAGE_KEY = 'bk-tutorial-completed';

// Helper to create formatted content
const createContent = (html: string) => {
  return createElement('div', {
    dangerouslySetInnerHTML: { __html: html },
    className: 'tutorial-content'
  });
};

// Helper to detect mobile devices
const isMobileDevice = () => {
  return window.innerWidth < 1024; // lg breakpoint
};

export const useTutorial = () => {
  const [runTutorial, setRunTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const allTutorialSteps: Step[] = [
    {
      target: 'body',
      title: 'Welcome to the BK War Room!',
      content: createContent(`
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 12px;">
          This is your <strong style="color: #FF8732;">command center</strong> for managing customer complaints and feedback.
        </p>
        <p style="font-size: 15px; line-height: 1.5; color: #666;">
          Let's take a <strong>quick tour</strong> of all the powerful features at your fingertips.
        </p>
        <p style="font-size: 13px; margin-top: 12px; color: #999;">
          Press <kbd style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">ESC</kbd> anytime to exit
        </p>
      `),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="header-stats"]',
      title: 'Live Statistics',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Monitor <strong style="color: #007AFF;">real-time metrics</strong> including:
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Total complaints</li>
          <li>Today's count</li>
          <li>Priority cases</li>
          <li>Average anger levels</li>
        </ul>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="search-bar"]',
      title: 'Smart Search',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Search across <strong>everything</strong> instantly:
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Names</li>
          <li>Messages</li>
          <li>Locations</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Updates as you type!
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sidebar"]',
      title: 'Filter Panel',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Powerful filtering with <strong style="color: #FF8732;">visual cards</strong> showing:
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Category breakdown with percentages</li>
          <li>Anger level distribution</li>
          <li>Filter by US state</li>
          <li>Top 20 most frequent keywords</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Combine multiple filters for precise results
        </p>
      `),
      placement: 'right',
      disableBeacon: true,
      data: { desktopOnly: true },
    },
    {
      target: '[data-tour="complaint-feed"]',
      title: 'Message Feed',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Browse all complaints with rich cards showing:
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Customer info</li>
          <li>Anger level</li>
          <li>Category</li>
          <li>Preview</li>
          <li>⭐ Star icon to favorite messages</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Use <strong>↑↓</strong> arrow keys to navigate. Starred messages auto-sort to top.
        </p>
      `),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="keyword-filters"]',
      title: 'Clickable Keywords',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Discover the <strong style="color: #FF8732;">top 20 most frequent keywords</strong> from all complaints!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Click any keyword to filter messages</li>
          <li>See keyword frequency counts</li>
          <li>Identify common complaint themes</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Great for spotting patterns and trends
        </p>
      `),
      placement: 'right',
      disableBeacon: true,
      data: { desktopOnly: true },
    },
    {
      target: '[data-tour="complaint-feed"]',
      title: 'Message Feed',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Browse all complaints with rich cards showing customer info, anger levels, and previews
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin-top: 10px; color: #666;">
          Use <strong>↑↓</strong> arrow keys to navigate. Starred messages auto-sort to top.
        </p>
      `),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="conversation-panel"]',
      title: 'Conversation Panel',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Click any message card to view the <strong style="color: #007AFF;">full conversation thread</strong>
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Complete SMS history (iMessage-style)</li>
          <li>Extracted details & escalation status</li>
          <li>Full Screen view option</li>
        </ul>
      `),
      placement: 'left',
      disableBeacon: true,
      data: { desktopOnly: true, autoOpenConversation: true },
    },
    {
      target: '[data-tour="tone-rating"]',
      title: 'Train the AI Model',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          <strong style="color: #FF8732;">Rate every AI response</strong> with the thumbs up/down buttons!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li><strong>👍 Thumbs Up</strong> - Good tone and response quality</li>
          <li><strong>👎 Thumbs Down</strong> - Poor tone or inappropriate response</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Your ratings help train the AI to respond better to complaints
        </p>
      `),
      placement: 'left',
      disableBeacon: true,
      data: { desktopOnly: true },
    },
    {
      target: '[data-tour="analytics-link"]',
      title: 'Keyword Analytics',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Dive deeper into <strong style="color: #007AFF;">keyword trends</strong> and patterns!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Interactive charts</li>
          <li>Top 20 keywords visualization</li>
        </ul>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          Click to explore detailed analytics
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: 'body',
      title: '🎉 You\'re All Set!',
      content: createContent(`
        <div style="text-align: center;">
          <p style="font-size: 18px; font-weight: bold; color: #1e293b; margin: 10px 0;">
            Congratulations!
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #64748b; margin: 10px 0;">
            You now know all the <strong style="color: #FF8732;">powerful features</strong> of the BK War Room!
          </p>
          <p style="font-size: 14px; line-height: 1.6; margin: 16px 0;">
            Ready to get started? Start exploring and managing complaints more efficiently
          </p>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 12px;">
            Click the purple <strong>Welcome Tour</strong> button anytime to restart this tour
          </p>
        </div>
      `),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  // Filter steps based on device type
  const tutorialSteps = useMemo(() => {
    const isMobile = isMobileDevice();
    return allTutorialSteps.filter(step => {
      // Skip desktop-only steps on mobile
      if (isMobile && step.data?.desktopOnly) {
        return false;
      }
      return true;
    });
  }, []);

  const startTutorial = useCallback(() => {
    setStepIndex(0);
    setRunTutorial(true);
  }, []);

  const stopTutorial = useCallback(() => {
    setRunTutorial(false);
    setStepIndex(0);
  }, []);

  const completeTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    stopTutorial();
  }, [stopTutorial]);

  const resetTutorial = useCallback(() => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    startTutorial();
  }, [startTutorial]);

  const isTutorialCompleted = useCallback(() => {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  }, []);

  return {
    runTutorial,
    stepIndex,
    tutorialSteps,
    setStepIndex,
    startTutorial,
    stopTutorial,
    completeTutorial,
    resetTutorial,
    isTutorialCompleted,
  };
};
