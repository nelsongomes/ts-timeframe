import { ITimelineUnit } from "../../src/types/timeline-types";
import { delta, getDeltaUnitsReadable } from "../../src/util/time";

describe("Time functions", () => {
  test("should calc delta correctly", async () => {
    expect(delta([0, 0], [0, 0])).toEqual([0, 0]);
    expect(delta([99, 999999999], [99, 999999999])).toEqual([0, 0]);

    expect(delta([0, 999999999], [1, 1])).toEqual([0, 2]);
    expect(delta([0, 0], [1, 1])).toEqual([1, 1]);
    expect(delta([0, 400], [1, 600])).toEqual([1, 200]);
  });

  test("should getDeltaUnitsReadable()", async () => {
    expect(
      getDeltaUnitsReadable([0, 0], [1, 1], ITimelineUnit.Seconds, 3)
    ).toEqual("1.000 s");
    expect(
      getDeltaUnitsReadable([0, 0], [1, 1], ITimelineUnit.Milliseconds, 0)
    ).toEqual("1000 ms");
    expect(
      getDeltaUnitsReadable([0, 0], [1, 1], ITimelineUnit.Nanoseconds, 0)
    ).toEqual("1000000001 ns");
  });
});
