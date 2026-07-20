import type { WallClock } from '../types.js';

const SUBHEADER_DATE_RE = /(\d{1,2})\s*\/\s*(\d{1,2})/;
const TIME_RE = /^(\d{1,2}):(\d{2})$/;

export function parseSubheaderDayMonth(text: string): { day: number; month: number } | null {
  const match = SUBHEADER_DATE_RE.exec(text);
  if (!match) return null;
  return { day: Number(match[1]), month: Number(match[2]) };
}

export function parseTime(text: string): { hour: number; minute: number } | null {
  const match = TIME_RE.exec(text.trim());
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/**
 * The site never prints a year, only "dd/mm". Programmes are always listed in
 * chronological order, so a month that goes backwards relative to the previous
 * entry means the schedule crossed into the next calendar year (December -> January).
 */
export function resolveYear(
  day: number,
  month: number,
  previous: WallClock | null,
  referenceDate: Date,
): number {
  if (!previous) return referenceDate.getFullYear();
  const wentBackwards = month < previous.month || (month === previous.month && day < previous.day);
  return wentBackwards ? previous.year + 1 : previous.year;
}

export function wallClockKey(w: WallClock): number {
  return ((((w.year * 100 + w.month) * 100 + w.day) * 100 + w.hour) * 100) + w.minute;
}

export function formatXmltvTime(w: WallClock, utcOffset = '-0300'): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${w.year}${pad(w.month)}${pad(w.day)}${pad(w.hour)}${pad(w.minute)}00 ${utcOffset}`;
}

/** End-of-day cutoff N calendar days after referenceDate, used to cap how far ahead the EPG reaches. */
export function horizonCutoff(referenceDate: Date, daysAhead: number): WallClock {
  const utc = new Date(Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()));
  utc.setUTCDate(utc.getUTCDate() + daysAhead);
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
    hour: 23,
    minute: 59,
  };
}
