import {
  ITimelineDuration,
  ITimelineSettings,
  ITimelineUnit,
  TimelineTimestamp
} from '../types/timeline-types';
import {
  delta,
  getDeltaMicroseconds,
  getDeltaMilliseconds,
  getDeltaNanoseconds,
  getDeltaSeconds,
  getDeltaUnitsReadable,
  now
} from '../util/time';
import { TimelineEvent } from './timeline-event';

// Timeline configuration
const settings: ITimelineSettings = {
  precision: 3,
  unit: ITimelineUnit.Milliseconds
};

export class Timeline {
  /**
   * Method to set default settings, can only be called once
   * @param newSettings
   */
  public static init(newSettings: Partial<ITimelineSettings>) {
    // init lib once
    Object.assign(settings, newSettings);
    // lock from further inits
    Object.freeze(settings);
  }

  /**
   * Method to get current settings
   */
  public static getDefaults(): ITimelineSettings {
    return settings;
  }

  private timeLineEvents: TimelineEvent[];
  private unit: ITimelineUnit;
  private precision: number;

  /**
   * Class constructor
   * @param defaultUnit
   * @param defaultPrecision
   */
  constructor(
    defaultUnit: ITimelineUnit = settings.unit,
    defaultPrecision: number = settings.precision
  ) {
    // copy settings
    this.unit = defaultUnit;
    this.precision = defaultPrecision;

    // mark the start with a new event
    this.timeLineEvents = [];
    this.innerStart();
  }

  public end() {
    if (!this.timeLineEvents[0].getEnd()) {
      this.timeLineEvents[0].end();
    }

    // check if there are any slow calls (this is done here to minimize performance impacts)
    this.executeSlownessCallbacks();
  }

  public duration(): ITimelineDuration {
    const start = this.timeLineEvents[0].getStart();
    const end = this.timeLineEvents[0].getEnd();

    if (!end) {
      throw new Error('end() function was not called...');
    }

    let duration: number;

    switch (this.unit) {
      case ITimelineUnit.Microseconds:
        duration = getDeltaMicroseconds(start, end);
        break;
      case ITimelineUnit.Milliseconds:
        duration = getDeltaMilliseconds(start, end);
        break;
      case ITimelineUnit.Nanoseconds:
        duration = getDeltaNanoseconds(start, end);
        break;
      case ITimelineUnit.Seconds:
        duration = getDeltaSeconds(start, end);
        break;
      default:
        throw new Error('This should not happen');
    }

    return { unit: this.unit, duration };
  }

  /**
   * Returns the events count.
   */
  public count(): number {
    // first event is timeline creation event itself
    return this.timeLineEvents.length - 1;
  }

  /**
   * Sum duration of all events
   */
  public sumEventsDuration(): TimelineTimestamp {
    const sum: TimelineTimestamp = [0, 0];

    let i = 0;
    for (const iEvent of this.timeLineEvents) {
      if (i > 0) {
        const duration = iEvent.getDurationRaw();

        if (duration) {
          sum[0] += duration[0];
          sum[1] += duration[1];

          while (sum[1] > 1e9) {
            sum[0]++;
            sum[1] -= 1e9;
          }
        }
      }
      i++;
    }

    return sum;
  }

  public startEvent(labels: string[] = []): TimelineEvent {
    if (this.timeLineEvents[0].getEnd()) {
      throw new Error('Cannot start more events after timeline.end()');
    }

    const event: TimelineEvent = new TimelineEvent(labels);

    // add event to timeline
    this.timeLineEvents.push(event);

    return event;
  }

  /**
   * Returns a string with analytic information for this timeline
   */
  public generateAnalyticInfo(): string {
    if (!this.timeLineEvents[0].getEnd()) {
      throw new Error('end() function was not called...');
    }

    let output = `***** Analytic Information for this Timeline *****\n`;

    output += `Total events: ${this.count()}\n`;
    output += `Grand duration: ${getDeltaUnitsReadable(
      this.timeLineEvents[0].getStart(),
      this.timeLineEvents[0].getEnd() as TimelineTimestamp,
      this.unit,
      this.precision
    )}\n`;
    output += `Events duration: ${getDeltaUnitsReadable(
      [0, 0],
      this.sumEventsDuration(),
      this.unit,
      this.precision
    )}\n`;

    if (this.count()) {
      output += this.generateDetailedAnalyticInfo();
    }

    return output;
  }

  /**
   * Returns a string with detailed analytic information for this timeline
   */
  public generateDetailedAnalyticInfo(): string {
    const offset: TimelineTimestamp = this.timeLineEvents[0].getStart();
    let output = `\n***** Event Detail for this Timeline *****\n`;

    let i = 0;
    for (const event of this.timeLineEvents) {
      if (i > 0) {
        output += `#${i}: [started: ${getDeltaUnitsReadable(
          offset,
          this.timeLineEvents[i].getStart(),
          this.unit,
          this.precision
        )}, duration: ${getDeltaUnitsReadable(
          this.timeLineEvents[i].getStart(),
          this.timeLineEvents[i].getEnd() as TimelineTimestamp,
          this.unit,
          this.precision
        )}]\n`;
      }
      i++;
    }

    return output;
  }

  /**
   * Creates the first event, marking the timeline start
   */
  private innerStart() {
    this.timeLineEvents.push(new TimelineEvent([]));
  }

  private executeSlownessCallbacks(): void {
    // if we have slow event rules and events
    if (settings.slowEvents && settings.slowEvents.length && this.count()) {
      for (let i = 1; i < this.timeLineEvents.length; i++) {
        const currentEvent = this.timeLineEvents[i];

        // check all rules
        for (const slowEvent of settings.slowEvents) {
          const eventDuration = currentEvent.getDuration(this.unit);

          if (
            slowEvent.rule.duration > 0 &&
            eventDuration &&
            eventDuration >= slowEvent.rule.duration &&
            slowEvent.rule.matchAnylabel.some(member => {
              return currentEvent.getLabels().includes(member);
            })
          ) {
            slowEvent.callback(null, {
              ...slowEvent.rule,
              unit: settings.unit
            });
          }
        }
      }
    }
  }
}
