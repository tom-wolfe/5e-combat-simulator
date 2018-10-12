import { EncounterStrategy, CreatureType } from '@sim/models';
import { Creature } from './creature';

export class Encounter {
  constructor(public strategy: EncounterStrategy, public creatures: Creature[]) {
    creatures.forEach(c => c.setEncounter(this));
  }

  get survivors(): Creature[] {
    return this.creatures.filter(c => c.hp > 0);
  }

  rollInitiative() {
    this.creatures.forEach(c => c.rollInitiative());
  }

  winner(): CreatureType {
    if (this.survivors.every(c => c.type === 'player')) { return 'player'; }
    if (this.survivors.every(c => c.type === 'monster')) { return 'monster'; }
    return undefined;
  }
}
