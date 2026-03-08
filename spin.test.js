import { describe, it, expect } from 'vitest';
import { computeTargetAngle, computeTotalTravel, segmentAtPointer } from './spin.js';

const TWO_PI = Math.PI * 2;

describe('spin angle math', () => {
  // Core property: targetAngle places the correct segment under the pointer
  it.each([
    [1, 5],   // 5 segments, winner = 1
    [0, 3],
    [2, 3],
    [6, 10],
    [9, 10],
  ])('winnerIndex=%i with %i segments lands under pointer', (winnerIndex, n) => {
    const sliceAngle = TWO_PI / n;
    const randomOffset = 0.5 * sliceAngle; // middle of segment
    const targetAngle  = computeTargetAngle(winnerIndex, n, randomOffset);
    expect(segmentAtPointer(targetAngle, n)).toBe(winnerIndex);
  });

  // Verify all offsets within the allowed 10%–90% range of a segment
  it('works across the allowed random offset range', () => {
    const n = 7, winnerIndex = 3;
    const sliceAngle = TWO_PI / n;
    for (let p = 0.1; p <= 0.9; p += 0.1) {
      const targetAngle = computeTargetAngle(winnerIndex, n, p * sliceAngle);
      expect(segmentAtPointer(targetAngle, n)).toBe(winnerIndex);
    }
  });

  // computeTotalTravel with integer nSpins brings wheel exactly to targetAngle
  it('totalTravel ends at targetAngle (mod 2π) for integer nSpins', () => {
    const targetAngle = 1.23;
    for (const startAngle of [0, 3.5, TWO_PI * 4 + 0.7]) {
      for (const nSpins of [6, 10, 15]) {
        const travel = computeTotalTravel(targetAngle, startAngle, nSpins);
        const finalAngle = (startAngle + travel) % TWO_PI;
        expect(finalAngle).toBeCloseTo(targetAngle, 10);
      }
    }
  });

  // Regression: non-integer nSpins breaks the landing (documents the original bug)
  it('REGRESSION: non-integer nSpins shifts final angle (the original bug)', () => {
    const n = 5, winnerIndex = 2;
    const sliceAngle = TWO_PI / n;
    const randomOffset = 0.5 * sliceAngle;
    const targetAngle = computeTargetAngle(winnerIndex, n, randomOffset);
    const startAngle  = 0;

    const badNSpins  = 6.73;  // float — the old bug
    const badTravel  = computeTotalTravel(targetAngle, startAngle, badNSpins);
    const badFinal   = (startAngle + badTravel) % TWO_PI;

    // badFinal is NOT close to targetAngle
    expect(Math.abs(badFinal - targetAngle)).toBeGreaterThan(0.1);
  });
});
