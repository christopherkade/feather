import { describe, it, expect } from "vitest";
import { assignToPods } from "../lib/pods/assign";

describe("assignToPods", () => {
  it("splits players into pods of 4", () => {
    const players = Array.from({ length: 10 }).map((_, i) => ({
      id: `${i}`,
      name: `P${i}`,
    }));
    const pods = assignToPods(players, 4);
    expect(pods.length).toBe(3);
    expect(pods[0].length).toBe(4);
    expect(pods[1].length).toBe(4);
    expect(pods[2].length).toBe(2);
  });
});
