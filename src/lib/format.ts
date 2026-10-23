export function formatDate(date: Date | string, style: 'short' | 'long' = 'short') {
  const value = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(
    'zh-CN',
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' },
  ).format(value);
}

/** 距今相对时间：刚刚 / 3 小时前 / 昨天 / 5 天前 … */
export function formatRelativeTime(date: Date | string, now = new Date()) {
  const value = typeof date === 'string' ? new Date(date) : date;
  const diffMs = value.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' });

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (abs < minute) return '刚刚';
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
  if (abs < week) return rtf.format(Math.round(diffMs / day), 'day');
  if (abs < month) return rtf.format(Math.round(diffMs / week), 'week');
  if (abs < year) return rtf.format(Math.round(diffMs / month), 'month');
  return rtf.format(Math.round(diffMs / year), 'year');
}
