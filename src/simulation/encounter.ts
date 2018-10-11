import { EncounterStrategy, CreatureType } from '@sim/models';
import { Creature } from './creature';

export class Encounter {
  constructor(public strategy: EncounterStrategy, public creatures: Creature[]) {
    creatures.forEach(c => c.setEncounter(this));
  }

  rollInitiative() {
    this.creatures.forEach(c => c.rollInitiative());
  }

  winner(): CreatureType {
    if (this.creatures.every(c => c.type === 'player' && c.hp > 0)) { return 'player'; }
    if (this.creatures.every(c => c.type === 'monster' && c.hp > 0)) { return 'monster'; }
    return undefined;
  }
}
