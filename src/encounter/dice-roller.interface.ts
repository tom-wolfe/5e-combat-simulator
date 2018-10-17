import { RollDice } from '@sim/random';
import { RandomProvider } from 'dice-typescript';

export interface DiceRoller {
  random: RandomProvider;
  roll: RollDice;
}
