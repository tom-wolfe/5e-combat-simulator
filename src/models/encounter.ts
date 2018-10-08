import { RandomProvider } from 'dice-typescript';

import { Creature, CreatureType } from './creature';
import { RollDice } from './dice';
import { ActionStrategy, ApproachStrategy, DiceStrategy } from './strategy';

export interface Encounter {
  random?: RandomProvider;
  roll?: RollDice;
  approach?: ApproachStrategy;
  offensive?: ActionStrategy;
  defensive?: ActionStrategy;
  critical?: DiceStrategy;
  creatures: Creature[];
}

export interface EncounterResult {
  winner: CreatureType;
  survivors: string[];
  rounds: number;
}
