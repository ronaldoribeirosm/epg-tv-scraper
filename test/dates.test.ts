import { describe, expect, it } from 'vitest';
import {
  formatXmltvTime,
  parseSubheaderDayMonth,
  parseTime,
  resolveYear,
  wallClockKey,
} from '../src/util/dates.js';

describe('parseSubheaderDayMonth', () => {
  it('extracts day and month from a weekday subheader', () => {
    expect(parseSubheaderDayMonth('segunda-feira, 20/7')).toEqual({ day: 20, month: 7 });
    expect(parseSubheaderDayMonth('quarta-feira, 3/12')).toEqual({ day: 3, month: 12 });
  });

  it('returns null when there is no date in the text', () => {
    expect(parseSubheaderDayMonth('sem data aqui')).toBeNull();
  });
});

describe('parseTime', () => {
  it('parses HH:MM', () => {
    expect(parseTime('06:00')).toEqual({ hour: 6, minute: 0 });
    expect(parseTime('23:45')).toEqual({ hour: 23, minute: 45 });
  });

  it('rejects malformed input', () => {
    expect(parseTime('not a time')).toBeNull();
  });
});

describe('resolveYear', () => {
  const referenceDate = new Date(2026, 6, 20);

  it('uses the reference year for the first day', () => {
    expect(resolveYear(20, 7, null, referenceDate)).toBe(2026);
  });

  it('keeps the same year while the month moves forward', () => {
    const previous = { year: 2026, month: 7, day: 20, hour: 0, minute: 0 };
    expect(resolveYear(21, 7, previous, referenceDate)).toBe(2026);
  });

  it('rolls over to the next year when the month goes backwards (Dec -> Jan)', () => {
    const previous = { year: 2026, month: 12, day: 31, hour: 0, minute: 0 };
    expect(resolveYear(1, 1, previous, referenceDate)).toBe(2027);
  });
});

describe('wallClockKey', () => {
  it('sorts chronologically', () => {
    const earlier = { year: 2026, month: 7, day: 20, hour: 23, minute: 0 };
    const later = { year: 2026, month: 7, day: 21, hour: 0, minute: 0 };
    expect(wallClockKey(earlier)).toBeLessThan(wallClockKey(later));
  });
});

describe('formatXmltvTime', () => {
  it('formats with the fixed America/Sao_Paulo offset', () => {
    const w = { year: 2026, month: 7, day: 20, hour: 6, minute: 0 };
    expect(formatXmltvTime(w)).toBe('20260720060000 -0300');
  });
});
