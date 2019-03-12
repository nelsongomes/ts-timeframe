import { TimelineTimestamp } from '../types/timeline-types';
import {
  getDeltaMicroseconds,
  getDeltaMilliseconds,
  getDeltaNanoseconds,
  getDeltaSeconds,
  round
} from './time';

// #region delta functions readable
/**
 * Time expressed in seconds
 * @param start time
 * @param end time
 * @param decimals optional number of decimals (default 3)
 * Returns formatted string
 */
export function getReadableDeltaSeconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp,
  decimals: number = 3
): string {
  return `${getDeltaSeconds(start, end).toFixed(decimals)}`;
}

/**
 * Time expressed in milliseconds
 * @param start time
 * @param end time
 * @param decimals optional number of decimals (default 3)
 * Returns formatted string
 */
export function getReadableDeltaMilliseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp,
  decimals: number = 3
): string {
  return `${getDeltaMilliseconds(start, end).toFixed(decimals)}`;
}

/**
 * Time expressed in microseconds
 * @param start time
 * @param end time
 * @param decimals optional number of decimals (default 3)
 * Returns formatted string
 */
export function getReadableDeltaMicroseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp,
  decimals: number = 3
): string {
  return `${round(getDeltaMicroseconds(start, end), 3).toFixed(decimals)}`;
}

/**
 * Time expressed in microseconds
 * @param start time
 * @param end time
 * @param decimals optional number of decimals (default 3)
 * Returns formatted string
 */
export function getReadableDeltaNanoseconds(
  start: TimelineTimestamp,
  end: TimelineTimestamp,
  decimals: number = 3
): string {
  return `${round(getDeltaNanoseconds(start, end), 3).toFixed(decimals)}`;
}
// #endregion
