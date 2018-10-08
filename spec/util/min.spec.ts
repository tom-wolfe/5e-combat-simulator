import { min } from '@sim/util/min';

const targets = [
  { name: 'X', value: 10 },
  { name: 'Y', value: 20 },
  { name: 'Z', value: 5 },
];

describe('min', () => {
  it('should take the smallest value.', () => {
    const m = min(targets, t => t.value);
    expect(m.object).toBe(targets[2]);
  })
});
