import { DamageRoll } from '@sim/action';
import { RollDice } from '@sim/random';

export type DiceStrategy = (damage: DamageRoll, roll: RollDice) => number;
