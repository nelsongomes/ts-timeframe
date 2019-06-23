import { Timeline } from '../../src/classes/timeline';
import {
  ITimelineSettings,
  ITimelineUnit
} from '../../src/types/timeline-types';
import * as time from '../../src/util/time';

const initParameters: ITimelineSettings = {
  precision: 5,
  slowEvents: [
    {
      callback: jest.fn(() => {
        /* some action */
      }),
      rule: {
        duration: 100,
        matchAnylabel: ['database'],
        message: 'Database too slow'
      }
    },
    {
      callback: jest.fn(() => {
        /* some action */
      }),
      rule: {
        duration: 3000,
        matchAnylabel: ['api'],
        message: 'Api calls too slow'
      }
    }
  ],
  unit: ITimelineUnit.Microseconds
};

describe('Timeline', () => {
  describe('should use constructor', () => {
    describe('without Timeline init', () => {
      test('properly ended, with default constructor unit', async () => {
        const timeline = new Timeline();

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        expect(timeline.duration().duration).toBeGreaterThan(0);
        expect(timeline.duration().unit).toBe(ITimelineUnit.Milliseconds);
      });

      test('properly ended, with unit seconds', async () => {
        const timeline = new Timeline(ITimelineUnit.Seconds, 0);

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        expect(timeline.duration().duration).toBeGreaterThan(0);
        expect(timeline.duration().unit).toBe(ITimelineUnit.Seconds);
      });

      test('properly ended, with unit milliseconds', async () => {
        const timeline = new Timeline(ITimelineUnit.Milliseconds);

        await time.delay(50);

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        expect(timeline.duration().duration).toBeGreaterThan(50);
        expect(timeline.duration().unit).toBe(ITimelineUnit.Milliseconds);
      });

      test('properly ended, with unit microseconds', async () => {
        const timeline = new Timeline(ITimelineUnit.Microseconds);

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        expect(timeline.duration().duration).toBeGreaterThan(0);
        expect(timeline.duration().unit).toBe(ITimelineUnit.Microseconds);
      });

      test('properly ended, with unit nanoseconds', async () => {
        const timeline = new Timeline(ITimelineUnit.Nanoseconds);

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        expect(timeline.duration().duration).toBeGreaterThan(0);
        expect(timeline.duration().unit).toBe(ITimelineUnit.Nanoseconds);
      });

      test('properly ended, with invalid unit', async () => {
        const timeline = new Timeline('xxx' as ITimelineUnit);

        expect(timeline instanceof Timeline).toBe(true);
        expect(timeline.count()).toBe(0);

        // terminate timeline
        timeline.end();

        try {
          timeline.duration();
          fail('Should have thrown an error');
        } catch (e) {
          expect((e as Error).message).toBe('This should not happen');
        }
      });

      test('unproperly ended', async () => {
        const timeline = new Timeline();

        try {
          timeline.duration();
          fail();
        } catch (error) {
          expect((error as Error).message).toBe(
            'end() function was not called...'
          );
        }
      });

      test('should throw an error if new event is added after timeline.end()', async () => {
        const timeline = new Timeline();

        try {
          timeline.end();
          timeline.startEvent();
          fail();
        } catch (error) {
          expect((error as Error).message).toBe(
            'Cannot start more events after timeline.end()'
          );
        }
      });
    });
  });

  describe('initialization', () => {
    test('should work first init', async () => {
      Timeline.init(initParameters);

      const timeline = new Timeline();
      timeline.end();

      // check init parameters set
      expect(Timeline.getDefaults()).toMatchObject(initParameters);
    });

    test('should fail second init', async () => {
      try {
        Timeline.init({
          precision: 5,
          unit: ITimelineUnit.Microseconds
        });
        fail();
      } catch (e) {
        // check init parameters unchanged
        expect(Timeline.getDefaults()).toMatchObject(initParameters);
      }
    });
  });

  describe('slow events must trigger a callback on end()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('no events', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0]) // first call
        .mockReturnValueOnce([0, 99999]); // second call

      const timeline = new Timeline();
      timeline.end();

      if (initParameters.slowEvents && initParameters.slowEvents[0]) {
        expect(initParameters.slowEvents[0].callback).toBeCalledTimes(0);
      } else {
        fail();
      }
      expect(spy).toBeCalledTimes(2);
    });

    test('slow event, not matching label', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0])
        .mockReturnValueOnce([0, 99999])
        .mockReturnValueOnce([0, 199999])
        .mockReturnValueOnce([0, 999999]);

      const timeline = new Timeline();
      const event = timeline.startEvent(['wronglabel']);
      event.end();

      timeline.end();

      if (initParameters.slowEvents && initParameters.slowEvents[0]) {
        expect(initParameters.slowEvents[0].callback).toBeCalledTimes(0);
      } else {
        fail();
      }
      expect(spy).toBeCalledTimes(4);
    });

    test('slow event, matching label', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0])
        .mockReturnValueOnce([0, 99999])
        .mockReturnValueOnce([0, 199999])
        .mockReturnValueOnce([0, 999999]);

      const timeline = new Timeline();
      const event = timeline.startEvent(['database', 'mysql']);
      event.end();

      timeline.end();

      if (initParameters.slowEvents && initParameters.slowEvents[0]) {
        expect(initParameters.slowEvents[0].callback).toBeCalledTimes(1);
      } else {
        fail();
      }
      expect(spy).toBeCalledTimes(4);
    });
  });

  describe('should generate Timeline analytics', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    test('with no events', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0]) // first call
        .mockReturnValueOnce([0, 99999]); // second call

      const timeline = new Timeline();
      timeline.end();

      expect(spy).toBeCalledTimes(2);
      expect(timeline.generateAnalyticInfo()).toMatchSnapshot();
    });

    test('without calling timeline.end()', async () => {
      const spy = jest.spyOn(time, 'now').mockReturnValueOnce([0, 0]); // first call

      const timeline = new Timeline();

      expect(spy).toBeCalledTimes(1);
      try {
        expect(timeline.generateAnalyticInfo()).toMatchSnapshot();
        fail();
      } catch (error) {
        expect((error as Error).message).toBe(
          'end() function was not called...'
        );
      }
    });

    test('one event', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0]) // timeline constructor

        .mockReturnValueOnce([0, 99999]) // startEvent()
        .mockReturnValueOnce([0, 199999]) // endEvent

        .mockReturnValueOnce([0, 299999]); // timeline end

      const timeline = new Timeline(ITimelineUnit.Microseconds);
      const event = timeline.startEvent(['database', 'mysql']);
      event.end();

      timeline.end();

      expect(spy).toBeCalledTimes(4);
      expect(timeline.generateAnalyticInfo()).toMatchSnapshot();
    });

    test('multiple events', async () => {
      const spy = jest
        .spyOn(time, 'now')
        .mockReturnValueOnce([0, 0]) // timeline constructor

        .mockReturnValueOnce([0, 0]) // startEvent()
        .mockReturnValueOnce([0, 999999999]) // endEvent

        .mockReturnValueOnce([0, 99999]) // startEvent()
        .mockReturnValueOnce([0, 199999]) // endEvent

        .mockReturnValueOnce([1, 299999]); // timeline end

      const timeline = new Timeline(ITimelineUnit.Microseconds);
      const event = timeline.startEvent();
      event.end();

      const event2 = timeline.startEvent();
      event2.end();

      timeline.end();

      expect(spy).toBeCalledTimes(6);
      expect(timeline.generateAnalyticInfo()).toMatchSnapshot();
    });
  });
});
