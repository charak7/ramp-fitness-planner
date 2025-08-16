export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function formatText(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

export function generateMotivationalQuote() {
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can do it. It's your mind you have to convince.",
    "Success isn't given. It's earned in the gym.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Champions train, losers complain.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Don't limit your challenges, challenge your limits.",
    "The groundwork for all happiness is good health."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
