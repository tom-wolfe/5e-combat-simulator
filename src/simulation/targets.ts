import { Action, Creature, Encounter } from '@sim/models';
import { highestAverage } from '@sim/simulation/actions';
import { max } from '@sim/util';

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

export function canKill(actions: Action[], targets: Creature[]): Creature[] {
  const average = highestAverage(actions);
  return targets.filter(t => t.hp <= average.damage);
}

export function mostDangerous(targets: Creature[]): Creature[] {
  // TODO: Factor resistances and stuff.
  return [max(targets, t => highestAverage(t.actions).damage).object].filter(t => t);
}
