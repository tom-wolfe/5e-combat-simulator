import { Action } from '@sim/action';
import { Creature } from '@sim/creature';
import { max, min } from '@sim/util';
import { RandomProvider } from 'dice-typescript';
import * as _ from 'lodash';

export const Actions = {
  first(actions: Action[]): Action {
    return actions[0];
  },
  random(actions: Action[], random: RandomProvider): Action {
    return actions[random.numberBetween(0, actions.length - 1)]
  },
  highestAverage(actions: Action[]): { action: Action, damage: number } {
    const result = max(actions, a => a.averageDamageTotal);
    return { action: result.object, damage: result.value };
  },
  leastForce(actions: Action[], targets: Creature[]): Action {
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
};
