export enum ITimelineUnit {
  Microseconds = 'µs',
  Milliseconds = 'ms',
  Nanoseconds = 'ns',
  Seconds = 's'
}

export interface ITimelineDuration {
  unit: ITimelineUnit;
  duration: number;
}

export interface ITimelineSettings {
  precision: number;
  defaultUnit: ITimelineUnit;
}

export interface ITimelineConfig {
  defaultLabels: [string];
}

export type TimelineTimestamp = [number, number]; // [seconds, nanoseconds]
