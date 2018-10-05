import { Encounter, Creature } from '@sim/models';

export function allied(current: Creature, encounter: Encounter): Creature[] {
  return encounter.creatures.filter(c => c.type === current.type);
}

export function opposing(current: Creature, encounter: Encounter): Creature[] {
  return encounter.creatures.filter(c => c.type !== current.type);
}
