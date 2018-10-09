import { Action, Creature, Encounter, ActionForecast } from '@sim/models';
import { AverageProvider } from '@sim/random/providers';
import { highestAverage } from '@sim/simulation/actions';
import { max } from '@sim/util';
import { Dice } from 'dice-typescript';

import * as Attack from './attack';

export function allied(current: Creature, encounter: Encounter): Creature[] {
  return encounter.creatures.filter(c => c.type === current.type);
}

export function opposing(current: Creature, encounter: Encounter): Creature[] {
  return encounter.creatures.filter(c => c.type !== current.type);
}

export function first(targets: Creature[], encounter: Encounter): Creature[] {
  return [targets[0]].filter(t => t);
}

export function random(targets: Creature[], encounter: Encounter, count: number): Creature[] {
  const remaining = [...targets];
  const ret: Creature[] = [];
  while (ret.length < count && remaining.length > 0) {
    const index = encounter.random.numberBetween(0, remaining.length - 1);
    targets.push(...remaining.splice(index, 1));
  }
  return ret;
}

export function canKill(actions: Action[], targets: Creature[]): ActionForecast[] {
  const data: ActionForecast[] = [];
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const avgRoll = input => dice.roll(input).total;

  // Work out how much damage each action will do to each creature
  actions.forEach(action => {
    targets.forEach(target => {
      const avgDamage = Attack.rollAllDamage(action, avgRoll, null);
      const damage = Attack.totalDamage(avgDamage, target);
      data.push({ target, action, damage });
    });
  });

  return data.filter(d => d.target.hp <= d.damage);
}

export function mostDangerous(targets: Creature[]): Creature[] {
  // TODO: Factor resistances and stuff.
  return [max(targets, t => highestAverage(t.actions).damage).object].filter(t => t);
}
