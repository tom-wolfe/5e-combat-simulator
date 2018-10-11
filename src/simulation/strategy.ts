import { Action, ActionStrategy } from '@sim/models';
import * as _ from 'lodash';

import * as Actions from './actions';
import * as Targets from './targets';
import { Creature } from './creature';

function lowestCastLevel(creature: Creature, action: Action): number {
  if (!action || !action.spellLevel) { return 0; }
  const possibleLevels = Object.keys(creature.spellSlots)
    .filter(level => creature.spellSlots[level] > 0)
    .map(Number)
    .filter(level => level >= action.spellLevel);
  return _.min(possibleLevels);
}

export const first: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.first(actions, encounter);
  return {
    action,
    targets: Targets.first(targets, encounter),
    castLevel: lowestCastLevel(creature, action)
  };
}

export const random: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.random(actions, encounter);
  return {
    action,
    targets: Targets.random(targets, encounter, 1),
    castLevel: lowestCastLevel(creature, action)
  };
}

export const mostDamageRandomTarget: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.highestAverage(actions).action;
  return {
    action,
    targets: Targets.random(targets, encounter, 1),
    castLevel: lowestCastLevel(creature, action)
  };
}

export const smartOffense: ActionStrategy = (creature, actions, targets, encounter) => {
  let action: Action;
  const thingsItCanKill = Targets.canKill(actions, targets);
  if (thingsItCanKill.length > 0) {
    // If you can kill off something, do it with the least force. Prioritizing the thing that can hurt you the most.
    targets = Targets.mostDangerous(thingsItCanKill.map(t => t.target));
    const actionsToKillTarget = thingsItCanKill.filter(d => targets.includes(d.target)).map(d => d.action);
    action = Actions.leastForce(actionsToKillTarget, targets);
  } else {
    // Otherwise, do the most damage to the strongest creature.
    action = Actions.highestAverage(actions).action;
    targets = Targets.mostDangerous(targets);
  }

  return { action, targets, castLevel: lowestCastLevel(creature, action) };
}

