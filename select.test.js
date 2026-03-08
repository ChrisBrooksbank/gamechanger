import { describe, it, expect } from 'vitest';
import { pickWinner } from './select.js';

describe('pickWinner', () => {
  it('always returns an item from the list', () => {
    const items = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    for (let i = 0; i < 100; i++) {
      expect(items).toContain(pickWinner(items));
    }
  });

  it('handles a single item', () => {
    const items = [{ name: 'only' }];
    expect(pickWinner(items)).toBe(items[0]);
  });

  it('distributes picks uniformly (each option within 50%–150% of expected share)', () => {
    const items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
      .map(name => ({ name }));
    const counts = Object.fromEntries(items.map(({ name }) => [name, 0]));
    const TRIALS = 5500; // 500 per item at N=11

    for (let i = 0; i < TRIALS; i++) {
      counts[pickWinner(items).name]++;
    }

    const expected = TRIALS / items.length;
    for (const { name } of items) {
      expect(counts[name]).toBeGreaterThan(expected * 0.5);
      expect(counts[name]).toBeLessThan(expected * 1.5);
    }
  });
});
