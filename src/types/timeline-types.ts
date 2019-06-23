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
  unit: ITimelineUnit;
  slowEvents?: ITimelineRuleInstance[];
}

export interface ITimelineConfig {
  defaultLabels: [string];
}

export interface ITimelineRule {
  duration: number;
  matchAnylabel: [string];
  message: string;
}
export interface ITimelineRuleInstance {
  rule: ITimelineRule;
  callback: Callback<ITimelineRule & { unit: ITimelineUnit; details: any }>;
}

export type Callback<T> = (err: Error | null, reply: T) => void;
export type TimelineTimestamp = [number, number]; // [seconds, nanoseconds]
