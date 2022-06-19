# Ts-timeframe.js

A reliable, lightweight, fine grained javascript library for high performance backend applications, built with Typescript and with 100% code coverage. Supports measurement in second, millisecond, microsecond and nanoseconds units.
It allows to measure individual events, but also to trigger callbacks according to defined rules.

This module **is not suitable to use on the browser**, (at least for now) because it depends on process.hrtime.
It was created because I was seeing too many code using Date ms to measure performance and ms accuracy is not enough sometimes.

## Installation

Using npm:

```shell
npm i --save ts-timeframe
```

Simple usage example measuring in miliseconds:

```ts
import { getDeltaMilliseconds, now, delay } from "ts-timeframe";

// we obtain start time with full precision
const start = now();

// do something
await delay(1);

// you can also use functions getDeltaUnits, getDeltaSeconds, getDeltaMicroseconds and getDeltaNanoseconds
console.log(getDeltaMilliseconds(start, now()));
```

Sample output:

```shell
0.149413
```

Simple usage example in typescript (constructor default is ms, 3 decimals):

```ts
import { Timeline } from "ts-timeframe";

// we start timeline in microseconds, no decimals in precision
const timeline = new Timeline(ITimelineUnit.Microseconds, 0);

timeline.measureEvent(async () => {
  // await for something
});

timeline.end();

console.log(timeline.getDuration());
console.log(timeline.generateAnalyticInfo());
```

Sample output (default is ms):

```shell
0.149413
***** Analytic Information for this Timeline *****
Total events: 1
Grand duration: 134 µs
Events duration: 24 µs

***** Event Detail for this Timeline *****
#1: [started: 83 µs, duration: 24 µs]
```

Changing defaults (callable once) and adding slowEvents rules:

```ts
import { ITimelineUnit, Timeline } from "ts-timeframe";

Timeline.init({
  unit: ITimelineUnit.Microseconds, // default unit for constructor class
  precision: 5, // decimals for unit

  // a list of event rules to trigger a callback
  // if they take longer than duration and label matches
  // with this you can log queries or requests,
  // all callbacks are called after timeline end.
  slowEvents: [
    {
      callback: (error, reply) => {
        console.log(
          `${reply.message}: details ${JSON.stringify(
            reply.details
          )} took more than ${reply.duration}${reply.unit}`
        );
      },
      rule: {
        duration: 10,
        matchAnylabel: ["database"],
        message: "Database too slow",
      },
    },
    {
      callback: () => {
        /* some action */
      },
      rule: {
        duration: 3000,
        matchAnylabel: ["api"],
        message: "Api calls too slow",
      },
    },
  ],
});

// timeline in microseconds, no decimals in precision
const timeline = new Timeline(ITimelineUnit.Microseconds, 0);

timeline.measureEvent(
  async () => {
    // await for something
  },
  // label the event and add info for the callback to receive
  ["database", "delete"],
  {
    server: "host1",
    table: "customers",
    query: "select abc",
  }
);

const event2 = timeline.startEvent();
event2.end();

timeline.end();

// get timeline duration
console.log(timeline.getDuration());
console.log(timeline.generateAnalyticInfo());
```

Sample output:

```shell
Database too slow: details {"server":"host1","table":"customers","query":"select abc"} took more than 10µs
135.109
***** Analytic Information for this Timeline *****
Total events: 2
Grand duration: 135 µs
Events duration: 28 µs

***** Event Detail for this Timeline *****
#1: [started: 74 µs, duration: 26 µs, labels: database,delete]
#2: [started: 110 µs, duration: 3 µs, labels: ]
```
