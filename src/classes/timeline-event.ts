import { ITimelineUnit, TimelineTimestamp } from '../types/timeline-types';
import { delta, getDeltaUnits, now } from '../util/time';

export class TimelineEvent {
  private startTime: TimelineTimestamp;
  private endTime?: TimelineTimestamp;
  private labels: string[];

  constructor(labels: string[]) {
    this.startTime = now();
    this.labels = labels;
  }

  public getStart(): TimelineTimestamp {
    return this.startTime;
  }

  public getEnd(): TimelineTimestamp | undefined {
    return this.endTime;
  }

  public getLabels(): string[] {
    return this.labels;
  }

  public end(): void {
    this.endTime = now();
  }

  public getDurationRaw(): TimelineTimestamp | undefined {
    if (this.endTime) {
      return delta(this.startTime, this.endTime);
    }
  }

  public getDuration(unit: ITimelineUnit): number | undefined {
    if (this.endTime) {
      return getDeltaUnits(this.startTime, this.endTime, unit);
    }
  }
}
