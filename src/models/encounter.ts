import { RandomProvider } from 'dice-typescript';

import { Creature, CreatureType } from './creature';
import { RollDice } from './dice';
import { ApproachStrategy, CriticalStrategy, DefensiveStrategy, OffensiveStrategy } from './strategy';

export interface Encounter {
  random?: RandomProvider;
  roll?: RollDice;
  approach?: ApproachStrategy;
  offensive?: OffensiveStrategy;
  defensive?: DefensiveStrategy;
  critical?: CriticalStrategy;
  creatures: Creature[];
}

export interface EncounterResult {
  winner: CreatureType;
  survivors: string[];
  rounds: number;
}
