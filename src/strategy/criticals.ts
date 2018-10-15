import { DamageRoll } from '@sim/action';
import { MaxProvider, RollDice } from '@sim/random';
import { Dice } from 'dice-typescript';
import { DiceStrategy } from './dice-strategy.type';

const rollTwice: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  const base = roll(damage.dice);
  return base + roll(damage.dice) + (damage.mod || 0);
}

const doubleDice: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  return (roll(damage.dice) * 2) + (damage.mod || 0);
}

const maxPlus: DiceStrategy = (damage: DamageRoll, roll: RollDice): number => {
  const max = new Dice(null, new MaxProvider());
  return max.roll(damage.dice).total + roll(damage.dice) + (damage.mod || 0);
}

export const Criticals = {
  rollTwice,
  doubleDice,
  maxPlus
};
