# Ts-timeframe.js v0.1.0

A reliable, lightweight, fine grained javascript library for high performance backend applications, built with Typescript and with 100% code coverage.
It allows to measure individual events, but also to trigger callbacks according to defined rules.

## Installation

Using npm:

```shell
$ npm i --save ts-timeframe
```

Simple usage example in typescript (constructor default is ms, 3 decimals):

```ts
import { Timeline } from "ts-timeframe";

// we start timeline
const timeline = new Timeline();

const event = timeline.startEvent();
// we do something
event.end();

timeline.end();

// get timeline duration
timeline.duration();
```

More complex usage:

```ts
import { Timeline, ITimelineUnit } from "ts-timeframe";

// timeline in microseconds, no decimals in precision
const timeline = new Timeline(ITimelineUnit.Microseconds, 0);

// label the event and add info for the callback to receive
const event = timeline.startEvent(["database", "delete"], {
  table: "x",
  server: "1"
});
// we do something
event.end();

timeline.end();

// get timeline duration
timeline.duration();
timeline.generateAnalyticInfo();
```

Sample output:

```
***** Analytic Information for this Timeline *****
Total events: 1
Grand duration: 299.99900 µs
Events duration: 100.00000 µs

***** Event Detail for this Timeline *****
#1: [started: 99.99900 µs, duration: 100.00000 µs, labels: database,mysql]
```

Changing defaults (callable once) and adding slowEvents rules:

```ts
import { Timeline } from "ts-timeframe";

Timeline.init({
  unit: ITimelineUnit.Milliseconds, // default unit for constructor class
  precision: 5, // decimals for unit

  // a list of event rules to trigger a callback
  // if they take longer than duration and label matches
  // with this you can log queries or requests,
  // all callbacks are called after timeline end.
  slowEvents: [
    {
      callback: () => {
        /* some action */
      },
      rule: {
        duration: 100,
        matchAnylabel: ['database'],
        message: 'Database too slow'
      }
    },
    {
      callback: () => {
        /* some action */
      },
      rule: {
        duration: 3000,
        matchAnylabel: ['api'],
        message: 'Api calls too slow'
      }
    }
  ]
});

(...)
```
