import { Action } from '@sim/action';
import { ActionStrategy } from './action-strategy.type';
import { Actions } from './actions';
import { Targets } from './targets';

const first: ActionStrategy = (creature, actions, targets, encounter) => {
  return {
    action: Actions.first(actions),
    targets: Targets.first(targets),
  };
}

const random: ActionStrategy = (creature, actions, targets, encounter) => {
  return {
    action: Actions.random(actions, encounter.dice.random),
    targets: Targets.random(targets, encounter.dice.random, 1)
  };
}

const mostDamageRandomTarget: ActionStrategy = (creature, actions, targets, encounter) => {
  return {
    action: Actions.highestAverage(actions).action,
    targets: Targets.random(targets, encounter.dice.random, 1)
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

const smartDefense: ActionStrategy = (creature, actions, targets, encounter) => {
  const allies = targets.filter(c => c.hp <= 0);
  return {
    action: Actions.highestAverage(actions).action,
    targets: Targets.mostDangerous(allies)
  };
}

export const Strategies = {
  first,
  random,
  mostDamageRandomTarget,
  smartOffense,
  smartDefense
};
