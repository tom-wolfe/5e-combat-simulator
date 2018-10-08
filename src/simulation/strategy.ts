import { Action, ActionStrategy } from '@sim/models';

import * as Actions from './actions';
import * as Targets from './targets';

export const first: ActionStrategy = (current, actions, targets, encounter) => {
  return {
    action: Actions.first(actions, encounter),
    targets: Targets.first(targets, encounter)
  };
}

export const random: ActionStrategy = (current, actions, targets, encounter) => {
  return {
    action: Actions.random(actions, encounter),
    targets: Targets.random(targets, encounter, 1)
  };
}

export const mostDamageRandomTarget: ActionStrategy = (current, actions, targets, encounter) => {
  return {
    action: Actions.highestAverage(actions).action,
    targets: Targets.random(targets, encounter, 1)
  };
}

export const smartOffense: ActionStrategy = (current, actions, targets, encounter) => {
  let action: Action;
  const thingsItCanKill = Targets.canKill(actions, targets);
  if (thingsItCanKill.length > 0) {
    // If you can kill off something, do it with the least force. Prioritizing the thing that can hurt you the most.
    targets = Targets.mostDangerous(thingsItCanKill);
    action = Actions.leastForce(actions, targets);
  } else {
    // Otherwise, do the most damage to the strongest creature.
    action = Actions.highestAverage(actions).action;
    targets = Targets.mostDangerous(targets);
  }

  return { action, targets };
}
