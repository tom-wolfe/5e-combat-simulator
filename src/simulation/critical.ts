import { CriticalStrategy, DamageRoll, RollDice } from '@sim/models';
import { MaxProvider } from '@sim/random/providers';
import { Dice } from 'dice-typescript';

export const rollTwice: CriticalStrategy = (damage: DamageRoll, roll: RollDice): number => {
  return roll(damage.dice) + roll(damage.dice) + damage.mod;
}

export const doubleDice: CriticalStrategy = (damage: DamageRoll, roll: RollDice): number => {
  return (roll(damage.dice) * 2) + damage.mod;
}

export const maxPlus: CriticalStrategy = (damage: DamageRoll, roll: RollDice): number => {
  const max = new Dice(null, new MaxProvider());
  return max.roll(damage.dice).total + roll(damage.dice) + damage.mod;
}
