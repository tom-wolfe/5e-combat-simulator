import { Action, ActionForecast } from '@sim/action';
import { Creature } from '@sim/creature';
import { EncounterStrategy } from '@sim/encounter';
import { AverageProvider } from '@sim/random';
import { max } from '@sim/util';
import { Dice } from 'dice-typescript';
import { Actions } from './actions';

function allied(current: Creature, creatures: Creature[]): Creature[] {
  return creatures.filter(c => c.type === current.type);
}

function opposing(current: Creature, creatures: Creature[]): Creature[] {
  return creatures.filter(c => c.type !== current.type);
}

function first(targets: Creature[], strategy: EncounterStrategy): Creature[] {
  return [targets[0]].filter(t => t);
}

function random(targets: Creature[], strategy: EncounterStrategy, count: number): Creature[] {
  const remaining = [...targets];
  const ret: Creature[] = [];
  while (ret.length < count && remaining.length > 0) {
    const index = strategy.random.numberBetween(0, remaining.length - 1);
    targets.push(...remaining.splice(index, 1));
  }
  return ret;
}

function canKill(actions: Action[], targets: Creature[]): ActionForecast[] {
  const data: ActionForecast[] = [];
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const avgRoll = input => dice.roll(input).total;

  // Work out how much damage each action will do to each creature
  actions.forEach(action => {
    targets.forEach(target => {
      const damage = target.totalDamage(action.averageDamage);
      data.push({ target, action, damage });
    });
  });

  return data.filter(d => d.target.hp <= d.damage);
}

function mostDangerous(targets: Creature[]): Creature[] {
  return [max(targets, t => Actions.highestAverage(t.actions).damage).object].filter(t => t);
}

export const Targets = {
  allied,
  opposing,
  first,
  random,
  canKill,
  mostDangerous
};
