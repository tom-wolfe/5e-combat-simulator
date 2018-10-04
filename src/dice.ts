import * as Random from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

export type DiceFunction = (input: string) => number;

export const roll: DiceFunction = input => {
  const i = input.toLowerCase().split('d').map(Number);
  return random.dice(i[1], i[0]).reduce((p, c) => p + c, 0);
};
