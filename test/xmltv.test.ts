import { describe, expect, it } from 'vitest';
import { buildXmltv, channelXmltvId } from '../src/xmltv.js';
import type { ChannelResult } from '../src/types.js';

const sample: ChannelResult[] = [
  {
    code: 'SBT',
    name: 'SBT',
    category: 'Aberta',
    programmes: [
      {
        channelCode: 'SBT',
        title: 'Se Liga Brasil',
        category: 'Jornalismo/Informativo',
        start: { year: 2026, month: 7, day: 20, hour: 6, minute: 0 },
        stop: { year: 2026, month: 7, day: 20, hour: 8, minute: 30 },
      },
    ],
  },
];

describe('channelXmltvId', () => {
  it('namespaces the channel code under meuguia.tv', () => {
    expect(channelXmltvId('SBT')).toBe('sbt.meuguia.tv');
  });
});

describe('buildXmltv', () => {
  it('produces a valid XMLTV document with channel and programme elements', () => {
    const xml = buildXmltv(sample);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<tv generator-info-name="epg-tv-scraper"');
    expect(xml).toContain('<channel id="sbt.meuguia.tv">');
    expect(xml).toContain('<display-name lang="pt">SBT</display-name>');
    expect(xml).toContain('<icon src="https://assets.meuguia.tv/logos/sbt.png"/>');
    expect(xml).toContain(
      '<programme start="20260720060000 -0300" stop="20260720083000 -0300" channel="sbt.meuguia.tv">',
    );
    expect(xml).toContain('<title lang="pt">Se Liga Brasil</title>');
    expect(xml).toContain('<category lang="pt">Jornalismo/Informativo</category>');
  });

  it('omits the stop attribute when a programme has no known stop time', () => {
    const noStop: ChannelResult[] = [
      {
        ...sample[0],
        programmes: [{ ...sample[0].programmes[0], stop: undefined }],
      },
    ];
    const xml = buildXmltv(noStop);
    expect(xml).toContain('<programme start="20260720060000 -0300" channel="sbt.meuguia.tv">');
  });
});
