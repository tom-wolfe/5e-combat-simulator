import { DiceRoll } from '../../src/dice';

export function constant(roll: number): DiceRoll {
  return _ => roll;
}

export function sequential(...rolls: number[]): DiceRoll {
  const r = [...rolls];
  return _ => r.splice(0, 1)[0];
}
