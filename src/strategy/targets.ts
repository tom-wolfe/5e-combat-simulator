import { Action, ActionForecast } from '@sim/action';
import { Creature } from '@sim/creature';
import { max } from '@sim/util';
import { RandomProvider } from 'dice-typescript';
import { Actions } from './actions';

export const Targets = {
  allied(current: Creature, creatures: Creature[]): Creature[] {
    return creatures.filter(c => c.type === current.type);
  },
  opposing(current: Creature, creatures: Creature[]): Creature[] {
    return creatures.filter(c => c.type !== current.type);
  },
  first(targets: Creature[]): Creature[] {
    return [targets[0]].filter(t => t);
  },
  random(targets: Creature[], provider: RandomProvider, count: number): Creature[] {
    const remaining = [...targets];
    const ret: Creature[] = [];
    while (ret.length < count && remaining.length > 0) {
      const index = provider.numberBetween(0, remaining.length - 1);
      targets.push(...remaining.splice(index, 1));
    }
    return ret;
  },
  canKill(actions: Action[], targets: Creature[]): ActionForecast[] {
    const data: ActionForecast[] = [];
    // Work out how much damage each action will do to each creature
    actions.forEach(action => {
      targets.forEach(target => {
        const damage = target.totalDamage(action.averageDamage);
        data.push({ target, action, damage });
      });
    });

    return data.filter(d => d.target.hp <= d.damage);
  },
  mostDangerous(targets: Creature[]): Creature[] {
    return [max(targets, t => Actions.highestAverage(t.actions).damage).object].filter(t => t);
  }
};
