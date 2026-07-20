import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseChannelPage } from '../src/scrapeChannel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureHtml = readFileSync(join(__dirname, 'fixtures/sbt-channel-page.html'), 'utf-8');
const referenceDate = new Date(2026, 6, 20);

describe('parseChannelPage', () => {
  it('extracts every programme across all days in the page', () => {
    const programmes = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    expect(programmes).toHaveLength(38);
  });

  it('reads title, category and start time for the first programme', () => {
    const [first] = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    expect(first.title).toBe('Se Liga Brasil');
    expect(first.category).toBe('Jornalismo/Informativo');
    expect(first.channelCode).toBe('SBT');
    expect(first.start).toEqual({ year: 2026, month: 7, day: 20, hour: 6, minute: 0 });
  });

  it('infers stop time from the next programme on the same day', () => {
    const programmes = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    const primeiroImpacto = programmes[1];
    expect(primeiroImpacto.title).toBe('Primeiro Impacto');
    expect(primeiroImpacto.start).toEqual({ year: 2026, month: 7, day: 20, hour: 8, minute: 30 });
    expect(primeiroImpacto.stop).toEqual({ year: 2026, month: 7, day: 20, hour: 12, minute: 45 });
  });

  it('infers stop time across a day boundary (last show of the day -> first show of next day)', () => {
    const programmes = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    const lastOfDay1 = programmes.find((p) => p.title === 'Galvão F.C.');
    expect(lastOfDay1?.start).toEqual({ year: 2026, month: 7, day: 20, hour: 23, minute: 0 });
    expect(lastOfDay1?.stop).toEqual({ year: 2026, month: 7, day: 21, hour: 0, minute: 0 });
  });

  it('resolves the correct date for programmes on later subheaders', () => {
    const programmes = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    const copaSulAmericana = programmes.find((p) => p.title === 'Copa Sul-Americana - Ao Vivo');
    expect(copaSulAmericana?.start).toEqual({ year: 2026, month: 7, day: 21, hour: 21, minute: 15 });
  });

  it('leaves the last programme in the fetched window without a stop time', () => {
    const programmes = parseChannelPage(fixtureHtml, 'SBT', referenceDate);
    const last = programmes[programmes.length - 1];
    expect(last.title).toBe('Sortilégio');
    expect(last.stop).toBeUndefined();
  });
});
