const TWO_PI = Math.PI * 2;
const TOP    = Math.PI * 1.5;   // pointer at 12 o'clock (3π/2)

/**
 * Returns the currentAngle that places winnerIndex under the top pointer.
 * randomOffset must be in [0, sliceAngle).
 */
export function computeTargetAngle(winnerIndex, nSegments, randomOffset) {
  const sliceAngle = TWO_PI / nSegments;
  const targetPointerAngle = winnerIndex * sliceAngle + randomOffset;
  return (TOP - targetPointerAngle + TWO_PI * 2) % TWO_PI;
}

/**
 * Total angular distance the wheel must travel (always positive, always >= 2π).
 * nSpins MUST be a non-negative integer.
 */
export function computeTotalTravel(targetAngle, startAngle, nSpins) {
  const s = startAngle % TWO_PI;
  return (targetAngle - s + TWO_PI) % TWO_PI + nSpins * TWO_PI;
}

/**
 * Which segment index is currently under the top pointer.
 */
export function segmentAtPointer(currentAngle, nSegments) {
  const sliceAngle = TWO_PI / nSegments;
  return Math.floor(((TOP - currentAngle) % TWO_PI + TWO_PI) % TWO_PI / sliceAngle);
}
