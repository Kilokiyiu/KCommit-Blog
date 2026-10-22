export function formatDate(date: Date | string, style: 'short' | 'long' = 'short') {
  const value = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(
    'zh-CN',
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' },
  ).format(value);
}

export function readingMinutes(body: string | undefined) {
  const words = (body ?? '').replace(/\s+/g, '').length;
  return Math.max(1, Math.round(words / 400) || 1);
}
