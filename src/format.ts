const compact = new Intl.NumberFormat('en', { notation: 'compact', minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatScore(score: number) {
  if (score < 1000) return String(score);
  return compact.format(score).replace(/[A-Z]/, ' $&');
}
