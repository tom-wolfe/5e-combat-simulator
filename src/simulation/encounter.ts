import { CreatureModel, CreatureType, EncounterStrategy } from '@sim/models';
import * as _ from 'lodash';

import { Creature } from './creature';

export interface EncounterResult {
  winner: CreatureType;
  survivors: Creature[];
  rounds: number;
}

export class Encounter {
  public creatures: Creature[]
  public rounds = 0;

  constructor(public strategy: EncounterStrategy, models: CreatureModel[]) {
    this.creatures = models.map(m => new Creature(m));
    this.creatures.forEach(c => c.setEncounter(this));
  }

  get survivors(): Creature[] {
    return this.creatures.filter(c => c.hp > 0);
  }

  get initiativeOrder(): Creature[] {
    return _.orderBy(this.creatures, c => c.initiative, 'desc')
  }

  run(): EncounterResult {
    this.rollInitiative();
    while (!this.winner()) { this.round(); }
    return {
      winner: this.winner(),
      rounds: this.rounds,
      survivors: this.survivors
    };
  }

  private rollInitiative() {
    this.creatures.forEach(c => c.rollInitiative());
  }

  private round() {
    this.initiativeOrder.forEach(c => {
      if (c.hp > 0) {
        c.turn(false);
        this.legendaryTurns(c);
      }
    });
    this.rounds++;
  }

  private winner(): CreatureType {
    if (this.survivors.every(c => c.type === 'player')) { return 'player'; }
    if (this.survivors.every(c => c.type === 'monster')) { return 'monster'; }
    return undefined;
  }

  private legendaryTurns(creature: Creature) {
    const legendary = this.creatures.filter(c => c.legendary && c !== creature && c.legendary.actions > 0);
    legendary.forEach(c => c.turn(true));
  }
}
