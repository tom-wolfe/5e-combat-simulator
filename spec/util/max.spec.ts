import { max } from '@sim/util/max';

const targets = [
  { name: 'X', value: 10 },
  { name: 'Y', value: 20 },
  { name: 'Z', value: 5 },
];

describe('max', () => {
  it('should take the largest value.', () => {
    const m = max(targets, t => t.value);
    expect(m.object).toBe(targets[1]);
  })
});
