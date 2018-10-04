import { CriticalStrategy } from '@sim/models/critical';
import { DamageRoll } from '@sim/models/damage';
import { DiceRoller } from '@sim/models/dice';
import { Dice, RandomProvider } from 'dice-typescript';

class MaxProvider implements RandomProvider {
  numberBetween(min: number, max: number): number {
    return max;
  }
}

export const rollTwice: CriticalStrategy = (roller: DiceRoller, damage: DamageRoll): number => {
  return roller(damage.dice) + roller(damage.dice) + damage.mod;
}

export const doubleDice: CriticalStrategy = (roller: DiceRoller, damage: DamageRoll): number => {
  return (roller(damage.dice) * 2) + damage.mod;
}

export const maxPlus: CriticalStrategy = (roller: DiceRoller, damage: DamageRoll): number => {
  const max = new Dice(null, new MaxProvider());
  return max.roll(damage.dice).total + roller(damage.dice) + damage.mod;
}
