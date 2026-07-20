export interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface Programme {
  channelCode: string;
  title: string;
  category?: string;
  start: WallClock;
  stop?: WallClock;
}

export interface ChannelResult {
  code: string;
  name: string;
  category: string;
  programmes: Programme[];
  error?: string;
}
