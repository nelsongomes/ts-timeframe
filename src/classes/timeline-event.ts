import { TimelineTimestamp } from '../types/timeline-types';
import { now } from '../util/time';

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

  public end(): void {
    this.endTime = now();
  }
}
