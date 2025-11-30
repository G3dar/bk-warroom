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
        </ul>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          Use <strong>↑↓</strong> arrow keys to navigate
        </p>
      `),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="star-button"]',
      title: '⭐ Star Important Messages',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Click the <strong style="color: #FBBF24;">⭐ star icon</strong> to favorite important complaints!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Auto-sort to top</li>
          <li>Saved for quick access</li>
          <li>Persistent storage</li>
        </ul>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="keyword-badge"]',
      title: 'Clickable Keywords',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Keywords are <strong style="color: #9333EA;">auto-extracted</strong> from each complaint using AI!
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          <strong style="color: #007AFF;">Click any badge</strong> to instantly filter and find similar issues
        </p>
        <p style="font-size: 13px; color: #666; margin-top: 10px;">
          Great for spotting trending problems
        </p>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="conversation-panel"]',
      title: 'Full Conversation',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Click any message to see the <strong style="color: #007AFF;">complete SMS thread</strong>!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>iMessage-style bubbles</li>
          <li>Extracted details card</li>
          <li>Escalation status</li>
        </ul>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="tone-rating"]',
      title: '👍👎 Rate Response Tone',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Give feedback on BK's AI responses!
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
          Your feedback helps improve the model's tone and communication style
        </p>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          Better responses = Happier customers
        </p>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="live-view-button"]',
      title: 'Full Screen View',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Watch conversations <strong style="color: #FF8732;">unfold in real-time</strong> with beautiful animations!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Messages appear one by one</li>
          <li>Typing indicators</li>
          <li>Anger-level themed backgrounds</li>
          <li>Rate response tone with thumbs up/down</li>
        </ul>
        <p style="font-size: 13px; margin-top: 8px; color: #666;">
          Immersive view with animations and rating
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="analytics-link"]',
      title: '📈 Keyword Analytics',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Dive deeper into <strong style="color: #007AFF;">keyword trends</strong> and patterns!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Interactive charts</li>
          <li>Top 20 keywords</li>
        </ul>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          Click to explore trends
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="analytics-chart"]',
      title: '📊 Keyword Frequency Chart',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          This <strong style="color: #007AFF;">interactive bar chart</strong> shows the top 20 keywords by frequency!
        </p>
        <ul style="margin: 0; padding-left: 0; font-size: 14px; line-height: 1.8; list-style: none;">
          <li>Color-coded bars</li>
          <li>Hover for exact counts</li>
          <li>Spot trends at a glance</li>
        </ul>
      `),
      placement: 'top',
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
