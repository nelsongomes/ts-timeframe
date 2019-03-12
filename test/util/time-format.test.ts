import {
  getReadableDeltaMicroseconds,
  getReadableDeltaMilliseconds,
  getReadableDeltaNanoseconds,
  getReadableDeltaSeconds
} from '../../src/util/time-format';

describe('Time-format helper functions', () => {
  describe('time delta functions', () => {
    test('should call getReadableDeltaSeconds', async () => {
      expect(getReadableDeltaSeconds([0, 0], [0, 1])).toBe('0.000');
      expect(getReadableDeltaSeconds([0, 1], [1, 1])).toBe('1.000');
      expect(getReadableDeltaSeconds([0, 1], [0, 1000000])).toBe('0.001');
      expect(getReadableDeltaSeconds([0, 1], [0, 1000000], 0)).toBe('0');
    });

    test('should call getReadableDeltaMilliseconds', async () => {
      expect(getReadableDeltaMilliseconds([0, 0], [0, 1])).toBe('0.000');
      expect(getReadableDeltaMilliseconds([0, 1], [1, 1002001])).toBe(
        '1001.002'
      );
      expect(getReadableDeltaMilliseconds([0, 1], [0, 1001001])).toBe('1.001');
      expect(getReadableDeltaMilliseconds([0, 1], [0, 1001])).toBe('0.001');
      expect(getReadableDeltaMilliseconds([0, 1], [0, 1001], 0)).toBe('0');
    });

    test('should call getReadableDeltaMicroseconds', async () => {
      expect(getReadableDeltaMicroseconds([0, 0], [0, 1])).toBe('0.001');
      expect(getReadableDeltaMicroseconds([0, 0], [1, 1])).toBe('1000000.001');
      expect(getReadableDeltaMicroseconds([0, 0], [0, 1001])).toBe('1.001');
      expect(getReadableDeltaMicroseconds([0, 0], [0, 1001001])).toBe(
        '1001.001'
      );
      expect(getReadableDeltaMicroseconds([0, 0], [0, 1001001], 0)).toBe(
        '1001'
      );
    });

    test('should call getReadableDeltaNanoseconds', async () => {
      expect(getReadableDeltaNanoseconds([0, 0], [0, 1])).toBe('1.000');
      expect(getReadableDeltaNanoseconds([0, 0], [0, 0.001])).toBe('0.001');
      expect(getReadableDeltaNanoseconds([0, 0], [0, 1000])).toBe('1000.000');
      expect(getReadableDeltaNanoseconds([0, 0], [0, 1000], 0)).toBe('1000');
    });
  });
});
