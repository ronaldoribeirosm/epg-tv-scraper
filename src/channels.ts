export interface ChannelDef {
  code: string;
  name: string;
  category: string;
}

export const CHANNELS: ChannelDef[] = [
  // Aberta
  { code: 'GRD', name: 'Globo', category: 'Aberta' },
  { code: 'SBT', name: 'SBT', category: 'Aberta' },
  { code: 'REC', name: 'Record TV', category: 'Aberta' },
  { code: 'BAN', name: 'Band', category: 'Aberta' },
  { code: 'RTV', name: 'Rede TV', category: 'Aberta' },
  { code: 'CUL', name: 'TV Cultura', category: 'Aberta' },
  { code: 'TED', name: 'TV Brasil', category: 'Aberta' },
  { code: 'GAZ', name: 'TV Gazeta', category: 'Aberta' },
  { code: 'RCN', name: 'Record News', category: 'Aberta' },
  { code: 'C21', name: 'Canal 21', category: 'Aberta' },
  { code: 'MTV', name: 'MTV', category: 'Aberta' },
  { code: 'VDA', name: 'Rede Vida', category: 'Aberta' },
  { code: 'TAP', name: 'TV Aparecida', category: 'Aberta' },

  // Notícias
  { code: 'GLN', name: 'Globo News', category: 'Noticias' },
  { code: 'CNN', name: 'CNN International', category: 'Noticias' },
  { code: 'BBC', name: 'BBC World News', category: 'Noticias' },
  { code: 'NEW', name: 'Band News', category: 'Noticias' },
  { code: 'BIT', name: 'Bloomberg', category: 'Noticias' },
  { code: 'DWL', name: 'Deutsche Welle', category: 'Noticias' },

  // Esportes
  { code: 'SPO', name: 'SporTV', category: 'Esportes' },
  { code: 'SP2', name: 'SporTV 2', category: 'Esportes' },
  { code: 'SP3', name: 'SporTV 3', category: 'Esportes' },
  { code: 'ESP', name: 'ESPN', category: 'Esportes' },
  { code: 'ES2', name: 'ESPN 2', category: 'Esportes' },
  { code: 'ES3', name: 'ESPN 3', category: 'Esportes' },
  { code: 'ES4', name: 'ESPN 4', category: 'Esportes' },
  { code: 'ES5', name: 'ESPN 5', category: 'Esportes' },
  { code: 'BSP', name: 'Band Sports', category: 'Esportes' },
  { code: '135', name: 'Combate', category: 'Esportes' },
  { code: '121', name: 'Premiere Clubes', category: 'Esportes' },
  { code: 'OFF', name: 'OFF HD', category: 'Esportes' },

  // Filmes
  { code: 'HBO', name: 'HBO', category: 'Filmes' },
  { code: 'HB2', name: 'HBO 2', category: 'Filmes' },
  { code: 'HFA', name: 'HBO Family', category: 'Filmes' },
  { code: 'HPL', name: 'HBO Plus', category: 'Filmes' },
  { code: 'HFE', name: 'HBO Signature', category: 'Filmes' },
  { code: 'TNT', name: 'TNT', category: 'Filmes' },
  { code: 'TCM', name: 'TCM - Turner Classic Movies', category: 'Filmes' },
  { code: 'SPA', name: 'SPACE', category: 'Filmes' },
  { code: 'MPX', name: 'Megapix', category: 'Filmes' },
  { code: 'PAR', name: 'Paramount Channel', category: 'Filmes' },
  { code: 'MGM', name: 'AMC', category: 'Filmes' },
  { code: 'CBR', name: 'Canal Brasil', category: 'Filmes' },
  { code: 'MNX', name: 'Cinemax', category: 'Filmes' },
  { code: 'TC1', name: 'Telecine Premium', category: 'Filmes' },
  { code: 'TC2', name: 'Telecine Action', category: 'Filmes' },
  { code: 'TC3', name: 'Telecine Touch', category: 'Filmes' },
  { code: 'TC4', name: 'Telecine Pipoca', category: 'Filmes' },
  { code: 'TC5', name: 'Telecine Cult', category: 'Filmes' },
  { code: 'TC6', name: 'Telecine Fun', category: 'Filmes' },

  // Séries
  { code: 'AXN', name: 'AXN', category: 'Series' },
  { code: 'SET', name: 'Sony', category: 'Series' },
  { code: 'WBT', name: 'Warner Channel', category: 'Series' },
  { code: 'USA', name: 'Universal Channel', category: 'Series' },
  { code: 'TBS', name: 'TBS', category: 'Series' },
  { code: 'TNS', name: 'TNT Séries', category: 'Series' },
  { code: 'ANX', name: 'Lifetime', category: 'Series' },
  { code: 'MDO', name: 'A&E', category: 'Series' },
  { code: 'HAL', name: 'Studio Universal', category: 'Series' },
  { code: 'APL', name: 'Animal Planet', category: 'Series' },
  { code: 'BRA', name: 'Film & Arts', category: 'Series' },
  { code: 'EUR', name: 'Eurochannel', category: 'Series' },
  { code: 'DHD', name: 'Discovery HD Theater', category: 'Series' },

  // Documentários
  { code: 'DIS', name: 'Discovery Channel', category: 'Documentarios' },
  { code: 'DSC', name: 'Discovery Science', category: 'Documentarios' },
  { code: 'DTU', name: 'Discovery Turbo', category: 'Documentarios' },
  { code: 'DIW', name: 'Discovery World', category: 'Documentarios' },
  { code: 'HEA', name: 'Discovery Home & Health', category: 'Documentarios' },
  { code: 'HIS', name: 'History Channel', category: 'Documentarios' },
  { code: 'TRV', name: 'TLC', category: 'Documentarios' },

  // Infantil
  { code: 'CAR', name: 'Cartoon Network', category: 'Infantil' },
  { code: 'GOB', name: 'Gloob', category: 'Infantil' },
  { code: 'DIK', name: 'Discovery Kids', category: 'Infantil' },
  { code: 'NIC', name: 'Nickelodeon', category: 'Infantil' },
  { code: 'NJR', name: 'Nick Jr.', category: 'Infantil' },
  { code: 'TOC', name: 'Tooncast', category: 'Infantil' },
  { code: 'BAB', name: 'Baby TV', category: 'Infantil' },

  // Variedades
  { code: 'GNT', name: 'GNT', category: 'Variedades' },
  { code: 'MSW', name: 'Multishow', category: 'Variedades' },
  { code: 'VIV', name: 'Viva', category: 'Variedades' },
  { code: 'CCE', name: 'Comedy Central', category: 'Variedades' },
  { code: 'FUT', name: 'Futura', category: 'Variedades' },
  { code: 'MSH', name: 'Bis', category: 'Variedades' },
];

export function findChannel(code: string): ChannelDef | undefined {
  return CHANNELS.find((c) => c.code === code);
}
