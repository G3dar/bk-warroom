import { useState, useCallback, createElement } from 'react';
import type { Step } from 'react-joyride';

const TUTORIAL_STORAGE_KEY = 'bk-tutorial-completed';

// Helper to create formatted content
const createContent = (html: string) => {
  return createElement('div', {
    dangerouslySetInnerHTML: { __html: html },
    className: 'tutorial-content'
  });
};

export const useTutorial = () => {
  const [runTutorial, setRunTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const tutorialSteps: Step[] = [
    {
      target: 'body',
      title: '👋 Welcome to the BK War Room!',
      content: createContent(`
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 12px;">
          This is your <strong style="color: #FF8732;">command center</strong> for managing customer complaints and feedback.
        </p>
        <p style="font-size: 15px; line-height: 1.5; color: #666;">
          Let's take a <strong>quick tour</strong> of all the powerful features at your fingertips! 🚀
        </p>
        <p style="font-size: 13px; margin-top: 12px; color: #999;">
          💡 Press <kbd style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">ESC</kbd> anytime to exit
        </p>
      `),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="header-stats"]',
      title: '📊 Live Statistics',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6;">
          Monitor <strong style="color: #007AFF;">real-time metrics</strong> including:
        </p>
        <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>📈 <strong>Total</strong> complaints</li>
          <li>🆕 <strong>Today's</strong> count</li>
          <li>🔴 <strong>Priority</strong> cases</li>
          <li>😤 <strong>Average anger</strong> levels</li>
        </ul>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="live-indicator"]',
      title: '🟢 Live Status',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6;">
          The <strong style="color: #34C759;">pulsing green dot</strong> shows the system is <em>actively monitoring</em> for new complaints in real-time! ⚡
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="search-bar"]',
      title: '🔍 Smart Search',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 8px;">
          Search across <strong>everything</strong> instantly:
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
          <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">👤 Names</span>
          <span style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">💬 Messages</span>
          <span style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">📍 Locations</span>
        </div>
        <p style="font-size: 13px; margin-top: 10px; color: #666;">
          ⚡ Updates as you type!
        </p>
      `),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sidebar"]',
      title: '🎯 Advanced Filters',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Filter complaints by <strong style="color: #FF8732;">multiple criteria</strong>:
        </p>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>🏷️ Category</li>
          <li>😤 Anger level</li>
          <li>🗺️ US state</li>
          <li>🔑 Keywords</li>
        </ul>
        <p style="font-size: 13px; margin-top: 10px; padding: 8px; background: #f0f9ff; border-left: 3px solid #007AFF; border-radius: 4px;">
          💡 <strong>Pro tip:</strong> Combine filters for precise results!
        </p>
      `),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '[data-tour="category-filters"]',
      title: '🏷️ Category Filters',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6;">
          Beautiful <strong style="color: #9333EA;">visual cards</strong> show complaint distribution with:
        </p>
        <div style="margin: 12px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
            <span style="font-size: 20px;">📊</span>
            <span style="font-size: 14px;">Counts & percentages</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
            <span style="font-size: 20px;">🎨</span>
            <span style="font-size: 14px;">Color-coded progress bars</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
            <span style="font-size: 20px;">👆</span>
            <span style="font-size: 14px;">Click to filter instantly</span>
          </div>
        </div>
      `),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '[data-tour="keyword-filters"]',
      title: '🔑 Keyword Power',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Select <strong style="color: #007AFF;">multiple keywords</strong> to narrow down complaints instantly!
        </p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border-radius: 12px; margin: 10px 0;">
          <div style="font-size: 24px; font-weight: bold; text-align: center;">Top 20</div>
          <div style="font-size: 12px; text-align: center; opacity: 0.9;">Most frequent keywords</div>
        </div>
        <p style="font-size: 13px; color: #666;">
          ✨ Each shows occurrence count
        </p>
      `),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '[data-tour="complaint-feed"]',
      title: '📱 Message Feed',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Browse all complaints with rich cards showing:
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; font-size: 13px;">
          <div style="background: #f0f9ff; padding: 8px; border-radius: 8px; text-align: center;">👤 Customer info</div>
          <div style="background: #fef3f2; padding: 8px; border-radius: 8px; text-align: center;">😤 Anger level</div>
          <div style="background: #fff7ed; padding: 8px; border-radius: 8px; text-align: center;">🏷️ Category</div>
          <div style="background: #f0fdf4; padding: 8px; border-radius: 8px; text-align: center;">💬 Preview</div>
        </div>
        <p style="font-size: 13px; margin-top: 10px; padding: 6px 10px; background: #1e293b; color: white; border-radius: 6px; text-align: center;">
          ⌨️ Use <strong>↑↓</strong> arrow keys to navigate!
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
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 12px; border-radius: 12px; margin: 10px 0;">
          <div style="font-size: 13px; line-height: 1.6;">
            ✓ Auto-sort to top<br/>
            ✓ Saved for quick access<br/>
            ✓ Persistent storage
          </div>
        </div>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="keyword-badge"]',
      title: '🏷️ Clickable Keywords',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Keywords are <strong style="color: #9333EA;">auto-extracted</strong> from each complaint using AI!
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          <strong style="color: #007AFF;">👆 Click any badge</strong> to instantly filter and find similar issues
        </p>
        <div style="background: #f0f9ff; padding: 10px; border-radius: 8px; border-left: 3px solid #007AFF; margin-top: 10px;">
          <span style="font-size: 13px;">💡 Great for spotting trending problems!</span>
        </div>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="conversation-panel"]',
      title: '💬 Full Conversation',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Click any message to see the <strong style="color: #007AFF;">complete SMS thread</strong>!
        </p>
        <div style="margin: 12px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 14px;">
            <span>📱</span> <strong>iMessage-style</strong> bubbles
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 14px;">
            <span>📊</span> <strong>Extracted details</strong> card
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 14px;">
            <span>👑</span> <strong>Escalation status</strong>
          </div>
        </div>
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
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px; border-radius: 12px; margin: 10px 0;">
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">🤖 AI Training</div>
          <div style="font-size: 13px; opacity: 0.95;">Your feedback helps improve the model's tone and communication style</div>
        </div>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          ✨ Better responses = Happier customers
        </p>
      `),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="live-view-button"]',
      title: '🎬 Live View Experience',
      content: createContent(`
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Watch conversations <strong style="color: #FF8732;">unfold in real-time</strong> with beautiful animations!
        </p>
        <div style="background: linear-gradient(135deg, #FF8732 0%, #D62300 100%); color: white; padding: 14px; border-radius: 12px; margin: 10px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 13px;">
            <span>✨</span> Messages appear one by one
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 13px;">
            <span>💬</span> Typing indicators
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 13px;">
            <span>🎨</span> Anger-level themed backgrounds
          </div>
        </div>
        <p style="font-size: 13px; text-align: center; margin-top: 8px;">
          <strong>It's like watching a live chat! 🍿</strong>
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
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; border-radius: 10px; text-align: center; font-size: 13px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📊</div>
            <div>Interactive Charts</div>
          </div>
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 10px; border-radius: 10px; text-align: center; font-size: 13px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📉</div>
            <div>Top 20 Keywords</div>
          </div>
        </div>
        <p style="font-size: 13px; color: #666; text-align: center; margin-top: 8px;">
          📍 Click to explore trends!
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
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px; border-radius: 12px; margin: 10px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 13px;">
            <span>🎨</span> Color-coded bars
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 13px;">
            <span>💬</span> Hover for exact counts
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 13px;">
            <span>📈</span> Spot trends at a glance
          </div>
        </div>
      `),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: 'body',
      title: '🎉 You\'re All Set!',
      content: createContent(`
        <div style="text-align: center;">
          <div style="font-size: 60px; margin: 10px 0;">🍔✨</div>
          <p style="font-size: 18px; font-weight: bold; color: #1e293b; margin: 10px 0;">
            Congratulations!
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #64748b; margin: 10px 0;">
            You now know all the <strong style="color: #FF8732;">powerful features</strong> of the BK War Room!
          </p>
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px; border-radius: 16px; margin: 16px 0;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Ready to get started?</div>
            <div style="font-size: 14px; opacity: 0.95;">Start exploring and managing complaints more efficiently! 🚀</div>
          </div>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 12px;">
            💡 Click the purple <strong>Help</strong> button anytime to restart this tour
          </p>
        </div>
      `),
      placement: 'center',
      disableBeacon: true,
    },
  ];

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
