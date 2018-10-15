import { Action } from '@sim/action';
import { Creature } from '@sim/creature';
import { EncounterStrategy } from '@sim/encounter';
import { max, min } from '@sim/util';
import * as _ from 'lodash';

function first(actions: Action[], strategy: EncounterStrategy): Action {
  return actions[0];
}

function random(actions: Action[], strategy: EncounterStrategy): Action {
  return actions[strategy.random.numberBetween(0, actions.length - 1)]
}

function highestAverage(actions: Action[]): { action: Action, damage: number } {
  const result = max(actions, a => a.averageDamageTotal);
  return { action: result.object, damage: result.value };
}

function leastForce(actions: Action[], targets: Creature[]): Action {
  const maxHp = _.max(targets.map(t => t.hp));

  // Try for the most powerful unlimited move.
  let action = max(actions.filter(a => a.unlimited), a => a.averageDamageTotal);

  // If not, try for the least powerful limited move.
  if (action.value < maxHp) {
    action = min(actions.filter(a => !a.unlimited && a.averageDamageTotal >= maxHp), a => a.averageDamageTotal);
  }

  // Neither of those work, so just use the strongest action.
  if (!action.object) {
    action = max(actions, a => a.averageDamageTotal);
  }

  return action.object;
}

export const Actions = {
  first,
  random,
  highestAverage,
  leastForce
};
