import { create } from 'xmlbuilder2';
import { formatXmltvTime } from './util/dates.js';
import type { ChannelResult } from './types.js';

const GENERATOR_NAME = 'epg-tv-scraper';
const GENERATOR_URL = 'https://github.com/ronaldoribeirosm/epg-tv-scraper';

export function channelXmltvId(code: string): string {
  return `${code.toLowerCase()}.meuguia.tv`;
}

export function buildXmltv(results: ChannelResult[]): string {
  const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('tv', {
    'generator-info-name': GENERATOR_NAME,
    'generator-info-url': GENERATOR_URL,
  });

  for (const result of results) {
    const id = channelXmltvId(result.code);
    const channelEl = doc.ele('channel', { id });
    channelEl.ele('display-name', { lang: 'pt' }).txt(result.name);
    channelEl
      .ele('icon', { src: `https://assets.meuguia.tv/logos/${result.code.toLowerCase()}.png` })
      .up();
  }

  for (const result of results) {
    const id = channelXmltvId(result.code);
    for (const programme of result.programmes) {
      const attrs: Record<string, string> = {
        start: formatXmltvTime(programme.start),
      };
      if (programme.stop) attrs.stop = formatXmltvTime(programme.stop);
      attrs.channel = id;

      const programmeEl = doc.ele('programme', attrs);
      programmeEl.ele('title', { lang: 'pt' }).txt(programme.title);
      if (programme.category) {
        programmeEl.ele('category', { lang: 'pt' }).txt(programme.category);
      }
    }
  }

  return doc.end({ prettyPrint: true });
}
