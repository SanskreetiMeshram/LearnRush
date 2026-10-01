const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getLocalDateKey(date = new Date()) {
  const d = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateKey(baseDate = new Date()) {
  const d =
    baseDate instanceof Date && !Number.isNaN(baseDate.getTime())
      ? new Date(baseDate.getTime())
      : new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
}

export function parseLocalDateKey(dateKey) {
  if (typeof dateKey !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const d = new Date(year, month, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

export function getLast7Days(baseDate = new Date()) {
  const today =
    baseDate instanceof Date && !Number.isNaN(baseDate.getTime())
      ? new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
      : new Date();
  const todayKey = getLocalDateKey(today);
  const days = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const dateKey = getLocalDateKey(d);
    const weekdayIndex = d.getDay();
    days.push({
      dateKey,
      dayShort: SHORT_WEEKDAYS[weekdayIndex],
      dayFull: FULL_WEEKDAYS[weekdayIndex],
      monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: dateKey === todayKey,
    });
  }

  return days;
}

export function formatReadableDate(isoOrDateStr) {
  if (!isoOrDateStr) return '';
  const localParsed = parseLocalDateKey(isoOrDateStr);
  const d = localParsed || new Date(isoOrDateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
