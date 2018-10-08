import { Action, Creature, Encounter } from '@sim/models';
import { AverageProvider } from '@sim/random/providers';
import { max } from '@sim/util';
import { Dice } from 'dice-typescript';
import * as _ from 'lodash';

import * as Attack from './attack';

export function possibleActions(creature: Creature, legendary: boolean): Action[] {
  // TODO: Filter by spell slots.
  let actions = creature.actions.filter(c => c.uses === undefined || c.uses > 0);
  if (legendary) {
    actions = actions.filter(a => a.legendary >= creature.legendary.actions);
  }
  return actions;
}

export function first(actions: Action[], encounter: Encounter): Action {
  return actions[0];
}

export function random(actions: Action[], encounter: Encounter): Action {
  return actions[encounter.random.numberBetween(0, actions.length - 1)]
}

export function highestAverage(actions: Action[]): { action: Action, damage: number } {
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const avgRoll = input => dice.roll(input).total;
  const result = max(actions, a => _.sum(Attack.rollAllDamage(a, avgRoll).map(d => d.amount)));
  return { action: result.object, damage: result.value };
}

export function unlimited(action: Action): boolean {
  // TODO: Check spell slots.
  return action.uses === undefined;
}

export function leastForce(actions: Action[], targets: Creature[]): Action {
  const maxHp = _.max(targets.map(t => t.hp));
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const maxRoll = input => dice.roll(input).total;

  const actionDamages = actions.map(a => ({ a, v: _.sum(Attack.rollAllDamage(a, maxRoll)) }));

  let damageVal = 0;
  // Try for the most powerful unlimited move.
  damageVal = _.max(actionDamages.filter(a => unlimited(a.a)).map(a => a.v));

  // If not, try for the least powerful limited move.
  if (damageVal < maxHp) {
    damageVal = _.min(actionDamages.filter(a => !unlimited(a.a) && a.v >= maxHp).map(a => a.v)) || 0;
  }

  // Neither of those work, so just use the strongest action.
  if (damageVal === 0) {
    damageVal = _.max(actionDamages.map(a => a.v));
  }

  return actionDamages.find(a => a.v === damageVal).a;
}

