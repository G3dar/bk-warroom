export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return `${diffSec}s ago`;
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else {
    return `${diffDay}d ago`;
  }
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getCategoryEmoji(category: string): string {
  const normalized = category.toLowerCase().trim();

  const emojiMap: Record<string, string> = {
    fries: '🍟',
    burgers: '🍔',
    'wrong orders': '📦',
    'wrong order': '📦',
    'wait times': '⏱️',
    'wait time': '⏱️',
    'customer service': '😤',
    cleanliness: '🏪',
    'app/tech': '📱',
    app: '📱',
    tech: '📱',
    technology: '📱',
    miscellaneous: '🌶️',
  };

  return emojiMap[normalized] || '🌶️';
}

export function normalizeCategoryName(category: string): string {
  const normalized = category.toLowerCase().trim();

  const nameMap: Record<string, string> = {
    'wrong orders': 'Wrong Orders',
    'wrong order': 'Wrong Orders',
    'wait times': 'Wait Times',
    'wait time': 'Wait Times',
    'customer service': 'Customer Service',
    'app/tech': 'App/Tech',
    app: 'App/Tech',
    tech: 'App/Tech',
    technology: 'App/Tech',
  };

  if (nameMap[normalized]) {
    return nameMap[normalized];
  }

  // Capitalize first letter of each word
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
