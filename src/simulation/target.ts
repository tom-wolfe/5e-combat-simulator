import { EncounterCreature } from '@sim/models/creature';
import { TargetStrategy } from '@sim/models/target';
import * as Util from '@sim/util';
import { Dice, RandomProvider } from 'dice-typescript';
import * as Random from 'random-js';

const randomProvider = new Random(Random.engines.mt19937().autoSeed());

class AverageProvider implements RandomProvider {
  numberBetween(min: number, max: number): number {
    return (max + min) / 2;
  }
}

export const first: TargetStrategy = (targets: EncounterCreature[]): EncounterCreature => {
  return targets[0];
}

export const random: TargetStrategy = (targets: EncounterCreature[]): EncounterCreature => {
  return randomProvider.pick(targets)
}

export const lowestHp: TargetStrategy = (targets: EncounterCreature[]): EncounterCreature => {
  return Util.min(targets, t => t.hp);
}

export const hardestHitting: TargetStrategy = (targets: EncounterCreature[]): EncounterCreature => {
  const dice = new Dice(null, new AverageProvider());
  return Util.max(targets, t => dice.roll(t.damage.dice).total + t.damage.mod);
}
