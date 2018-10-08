import { DamageRoll, DiceStrategy, RollDice } from '@sim/models';
import { MaxProvider } from '@sim/random/providers';
import { Dice } from 'dice-typescript';

export const rollTwice: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  const base = roll(damage.dice);
  return base + roll(damage.dice) + (damage.mod || 0);
}

export const doubleDice: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  return (roll(damage.dice) * 2) + (damage.mod || 0);
}

export const maxPlus: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  const max = new Dice(null, new MaxProvider());
  return max.roll(damage.dice).total + roll(damage.dice) + (damage.mod || 0);
}
