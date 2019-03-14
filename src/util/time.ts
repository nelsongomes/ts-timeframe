import { ITimelineUnit, TimelineTimestamp } from '../types/timeline-types';
import {
  getReadableDeltaMicroseconds,
  getReadableDeltaMilliseconds,
  getReadableDeltaNanoseconds,
  getReadableDeltaSeconds
} from './time-format';

// #region delta functions

/**
 * Method returns time difference expressed as a string in the unit selected, with n decimal places
 * @param start time
 * @param end time
 * @param unit unit to express result
 * @param decimals
 */
export function getDeltaUnitsReadable(
  start: TimelineTimestamp,
  end: TimelineTimestamp,
  unit: ITimelineUnit,
  decimals: number
): string {
  const formatted = ` ${unit}`;

  switch (unit) {
    case ITimelineUnit.Seconds:
      return getReadableDeltaSeconds(start, end, decimals) + formatted;
    case ITimelineUnit.Milliseconds:
      return getReadableDeltaMilliseconds(start, end, decimals) + formatted;
    case ITimelineUnit.Microseconds:
      return getReadableDeltaMicroseconds(start, end, decimals) + formatted;
    case ITimelineUnit.Nanoseconds:
      return getReadableDeltaNanoseconds(start, end, decimals) + formatted;
  }
}

/**
 * Method returns number of seconds between 2 times expressed in seconds (with floating point precision)
 * @param start time
 * @param end time
 */
export function getDeltaSeconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp
): number {
  const diff = delta(start, end);
  return diff[0] + diff[1] / 1e9;
}

/**
 * Method returns number of milliseconds between 2 times expressed in milliseconds (with floating point precision)
 * @param start time
 * @param end time
 */
export function getDeltaMilliseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp
): number {
  const diff = delta(start, end);
  return diff[0] * 1e3 + diff[1] / 1e6;
}

/**
 * Method returns number of microseconds between 2 times expressed in microseconds (with floating point precision)
 * @param start time
 * @param end time
 */
export function getDeltaMicroseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp
): number {
  const diff = delta(start, end);
  return diff[0] * 1e6 + diff[1] / 1e3;
}

/**
 * Method returns number of nanoseconds between 2 times expressed in nanos (with floating point precision)
 * @param start time
 * @param end time
 */
export function getDeltaNanoseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp
): number {
  const diff = delta(start, end);
  return diff[0] * 1e9 + diff[1];
}

/**
 * Calculates the difference between 2 time structures
 * @param start
 * @param end
 */
export function delta(
  start: TimelineTimestamp,
  end: TimelineTimestamp
): TimelineTimestamp {
  const result: TimelineTimestamp = [end[0] - start[0], end[1] - start[1]];

  if (result[1] < 0) {
    result[0]--;
    result[1] = result[1] + 1e9;
  }

  return result;
}
// #endregion

// #region help functions
export function round(value: number, places: number): number {
  return value * Math.pow(10, places) * Math.pow(10, -places);
}

/**
 * Returns current time
 */
export function now(): TimelineTimestamp {
  return process.hrtime();
}

/**
 * Delays execution a few milliseconds
 * @param milliseconds
 */
export async function delay(milliseconds: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

// #endregion
