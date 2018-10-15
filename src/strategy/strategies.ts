import { Action } from '@sim/action';
import { Creature } from '@sim/creature';
import * as _ from 'lodash';
import { ActionStrategy } from './action-strategy.type';
import { Actions } from './actions';
import { Targets } from './targets';

const first: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.first(actions, encounter);
  return {
    action,
    targets: Targets.first(targets, encounter),
  };
}

const random: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.random(actions, encounter);
  return {
    action,
    targets: Targets.random(targets, encounter, 1)
  };
}

const mostDamageRandomTarget: ActionStrategy = (creature, actions, targets, encounter) => {
  const action = Actions.highestAverage(actions).action;
  return {
    action,
    targets: Targets.random(targets, encounter, 1)
  };
}

const smartOffense: ActionStrategy = (creature, actions, targets, encounter) => {
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

  return { action, targets };
}

export const Strategies = {
  first,
  random,
  mostDamageRandomTarget,
  smartOffense
};
