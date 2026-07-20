import * as cheerio from 'cheerio';
import { fetchHtml } from './util/http.js';
import { parseSubheaderDayMonth, parseTime, resolveYear } from './util/dates.js';
import type { Programme, WallClock } from './types.js';

const CHANNEL_PAGE_URL = (code: string) => `https://www.meuguia.tv/programacao/canal/${code}`;

export function parseChannelPage(
  html: string,
  channelCode: string,
  referenceDate: Date = new Date(),
): Programme[] {
  const $ = cheerio.load(html);
  const items = $('ul.mw').first().children('li').toArray();

  const programmes: Programme[] = [];
  let currentDay: { day: number; month: number; year: number } | null = null;

  for (const el of items) {
    const li = $(el);

    if (li.hasClass('subheader')) {
      const parsed = parseSubheaderDayMonth(li.text());
      if (!parsed) continue;
      const previous: WallClock | null = currentDay
        ? { ...currentDay, hour: 0, minute: 0 }
        : null;
      const year = resolveYear(parsed.day, parsed.month, previous, referenceDate);
      currentDay = { day: parsed.day, month: parsed.month, year };
      continue;
    }

    if (li.hasClass('divider') || !currentDay) continue;

    const timeText = li.find('.lileft.time').first().text();
    const time = parseTime(timeText);
    const title = li.find('h2').first().text().trim();
    if (!time || !title) continue;

    const category = li.find('h3').first().text().trim() || undefined;

    programmes.push({
      channelCode,
      title,
      category,
      start: {
        year: currentDay.year,
        month: currentDay.month,
        day: currentDay.day,
        hour: time.hour,
        minute: time.minute,
      },
    });
  }

  for (let i = 0; i < programmes.length - 1; i++) {
    programmes[i].stop = { ...programmes[i + 1].start };
  }

  return programmes;
}

export async function scrapeChannel(
  code: string,
  referenceDate: Date = new Date(),
): Promise<Programme[]> {
  const html = await fetchHtml(CHANNEL_PAGE_URL(code));
  return parseChannelPage(html, code, referenceDate);
}
