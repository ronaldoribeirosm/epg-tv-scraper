import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHANNELS } from './channels.js';
import { scrapeChannel } from './scrapeChannel.js';
import { buildXmltv } from './xmltv.js';
import { sleep } from './util/http.js';
import { horizonCutoff, wallClockKey } from './util/dates.js';
import type { ChannelResult } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = `${__dirname}/../output/guide.xml`;
const DELAY_MS = Number(process.env.EPG_DELAY_MS ?? 400);
const DAYS_AHEAD = Number(process.env.EPG_DAYS_AHEAD ?? 7);

async function run(): Promise<void> {
  const referenceDate = new Date();
  const cutoffKey = wallClockKey(horizonCutoff(referenceDate, DAYS_AHEAD));
  const results: ChannelResult[] = [];
  let failures = 0;

  for (const [index, channel] of CHANNELS.entries()) {
    try {
      const scraped = await scrapeChannel(channel.code, referenceDate);
      const programmes = scraped.filter((p) => wallClockKey(p.start) <= cutoffKey);
      results.push({ ...channel, programmes });
      console.log(`[ok] ${channel.code} (${channel.name}) — ${programmes.length} programas`);
    } catch (err) {
      failures++;
      const message = err instanceof Error ? err.message : String(err);
      results.push({ ...channel, programmes: [], error: message });
      console.warn(`[falhou] ${channel.code} (${channel.name}) — ${message}`);
    }

    if (index < CHANNELS.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  const withProgrammes = results.filter((r) => r.programmes.length > 0);
  if (withProgrammes.length === 0) {
    console.error('Nenhum canal retornou programação. Abortando sem gravar arquivo.');
    process.exit(1);
  }

  const xml = buildXmltv(withProgrammes);
  await mkdir(`${__dirname}/../output`, { recursive: true });
  await writeFile(OUTPUT_PATH, xml, 'utf-8');

  const totalProgrammes = withProgrammes.reduce((sum, r) => sum + r.programmes.length, 0);
  console.log(
    `\nConcluído: ${withProgrammes.length}/${CHANNELS.length} canais, ${totalProgrammes} programas, ${failures} falhas.`,
  );
  console.log(`Arquivo gravado em ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error('Erro inesperado durante a raspagem:', err);
  process.exit(1);
});
