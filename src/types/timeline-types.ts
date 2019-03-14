export enum ITimelineUnit {
  Microseconds = 'µs',
  Milliseconds = 'ms',
  Nanoseconds = 'ns',
  Seconds = 's'
}

export enum ITimelineLabelMatch {
  Any = 'any',
  All = 'all'
}

export interface ITimelineDuration {
  unit: ITimelineUnit;
  duration: number;
}

export interface ITimelineSettings {
  precision: number;
  unit: ITimelineUnit;
  slowEvents?: ITimelineRule[];
}

export interface ITimelineConfig {
  defaultLabels: [string];
}

export interface ITimelineRule {
  duration: number;
  labels: [string];
  labelMatch: ITimelineLabelMatch;
  callback: Callback<{ message: string; detail: any }>;
}

export type Callback<T> = (err: Error | null, reply: T) => void;
export type TimelineTimestamp = [number, number]; // [seconds, nanoseconds]
