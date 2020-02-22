# Ts-timeframe.js v0.1.6

A reliable, lightweight, fine grained javascript library for high performance backend applications, built with Typescript and with 100% code coverage.
It allows to measure individual events, but also to trigger callbacks according to defined rules.

This module **is not suitable to use on the browser**, (at least for now) because it depends on process.hrtime.
It was created because I was seeing too many code using Date ms to measure performance and ms accuracy is not enough sometimes.

## Installation

Using npm:

```shell
$ npm i --save @nelsongomes/ts-timeframe
```

Simple usage example in typescript (constructor default is ms, 3 decimals):

```ts
import { Timeline } from "@nelsongomes/ts-timeframe";

// we start timeline
const timeline = new Timeline();

const event = timeline.startEvent();
// we do something
event.end();

timeline.end();

console.log(timeline.duration());
// { unit: 'ms', duration: 0.140346 }
```

More complex usage:

```ts
import { ITimelineUnit, Timeline } from "@nelsongomes/ts-timeframe";

// timeline in microseconds, no decimals in precision
const timeline = new Timeline(ITimelineUnit.Microseconds, 0);

// label the event and add info for the callback to receive
const event = timeline.startEvent(["database", "delete"], {
  server: "host1",
  table: "customers"
});

try {
  // we do something
} finally {
  event.end();
}

timeline.end();

// get timeline duration
console.log(timeline.duration().duration);
console.log(timeline.generateAnalyticInfo());
```

Sample output:

```
143.081
***** Analytic Information for this Timeline *****
Total events: 1
Grand duration: 143 µs
Events duration: 25 µs

***** Event Detail for this Timeline *****
#1: [started: 91 µs, duration: 25 µs, labels: database,delete]
```

Changing defaults (callable once) and adding slowEvents rules:

```ts
import { ITimelineUnit, Timeline } from "@nelsongomes/ts-timeframe";

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
        message: "Database too slow"
      }
    },
    {
      callback: () => {
        /* some action */
      },
      rule: {
        duration: 3000,
        matchAnylabel: ["api"],
        message: "Api calls too slow"
      }
    }
  ]
});

// timeline in microseconds, no decimals in precision
const timeline = new Timeline(ITimelineUnit.Microseconds, 0);

// label the event and add info for the callback to receive
const event1 = timeline.startEvent(["database", "delete"], {
  server: "host1",
  table: "customers",
  query: "select abc"
});

try {
  // we do something
} finally {
  event1.end();
}

const event2 = timeline.startEvent();
event2.end();

timeline.end();

// get timeline duration
console.log(timeline.duration().duration);
console.log(timeline.generateAnalyticInfo());
```

Sample output:

```
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
