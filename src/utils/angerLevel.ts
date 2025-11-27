import type { AngerLevel } from '../types/complaints';

const toneMapping: Record<string, { level: number; category: AngerLevel['category'] }> = {
  // Furious (8-10)
  aggressive: { level: 10, category: 'furious' },
  threatening: { level: 9, category: 'furious' },

  // Angry (6-7)
  frustrated: { level: 7, category: 'angry' },
  disgusted: { level: 7, category: 'angry' },
  betrayed: { level: 6, category: 'angry' },

  // Annoyed (4-5)
  sarcastic: { level: 5, category: 'annoyed' },
  confused: { level: 4, category: 'annoyed' },

  // Calm (1-3)
  neutral: { level: 3, category: 'calm' },
  humorous: { level: 2, category: 'calm' },
  passionate: { level: 3, category: 'calm' },
};

export function getAngerLevel(tone: string): AngerLevel {
  const normalizedTone = tone.toLowerCase().trim();
  const mapping = toneMapping[normalizedTone] || { level: 5, category: 'annoyed' as const };

  const categoryColors: Record<AngerLevel['category'], { color: string; emoji: string; label: string }> = {
    furious: { color: '#D62300', emoji: '🔴', label: 'FURIOUS' },
    angry: { color: '#FF8732', emoji: '🟠', label: 'ANGRY' },
    annoyed: { color: '#FACC15', emoji: '🟡', label: 'ANNOYED' },
    calm: { color: '#22C55E', emoji: '🟢', label: 'CALM' },
  };

  const categoryInfo = categoryColors[mapping.category];

  return {
    level: mapping.level,
    category: mapping.category,
    color: categoryInfo.color,
    emoji: categoryInfo.emoji,
    label: categoryInfo.label,
  };
}
