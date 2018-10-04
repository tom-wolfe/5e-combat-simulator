import * as _ from 'lodash';

import { DiceRoll } from './dice';
import { EncounterCreature, Creature, CreatureType } from './models/creature';
import { EncounterResult } from './models/encounter';

export class Encounter {
  constructor(private dice: DiceRoll) { }

  begin(creatures: Creature[]): EncounterCreature[] {
    const output: EncounterCreature[] = creatures.map(c => _.merge({}, c, { hp: 0, initiative: 0 }));
    output.forEach(c => {
      c.hp = c.maxHp;
      c.initiative = this.dice('1d20') + c.initiativeBonus;
    });
    return output;
  }

  turnOrder(creatures: EncounterCreature[]): EncounterCreature[] {
    return _.orderBy(creatures, c => c.initiative, 'desc');
  }

  round(creatures: EncounterCreature[]) {
    this.turnOrder(creatures).forEach(c => {
      if (c.hp > 0) {
        this.turn(c, creatures);
      }
    });
  }

  target(creature: Creature, creatures: EncounterCreature[]): EncounterCreature {
    const targets = creatures.filter(c => c.type !== creature.type && c.hp > 0);
    return targets[0];
  }

  toHit(creature: EncounterCreature, target: EncounterCreature): boolean {
    return this.dice('1d20') + creature.toHit >= target.ac;
  }

  damage(creature: EncounterCreature, target: EncounterCreature) {
    target.hp -= this.dice(creature.damage);
  }

  attack(creature: EncounterCreature, target: EncounterCreature) {
    if (!this.toHit(creature, target)) { return; }
    this.damage(target, creature);
  }

  turn(creature: EncounterCreature, creatures: EncounterCreature[]) {
    const target = this.target(creature, creatures);
    if (!target) { return; }
    this.attack(creature, target);
  }

  winner(creatures: EncounterCreature[]): CreatureType {
    if (creatures.filter(c => c.type === 'player' && c.hp > 0).length === 0) { return 'monster'; }
    if (creatures.filter(c => c.type === 'monster' && c.hp > 0).length === 0) { return 'player'; }
    return undefined;
  }

  run(creatures: Creature[]): EncounterResult {
    const round = this.begin(creatures);
    let winner: CreatureType;
    while (!(winner = this.winner(round))) {
      this.round(round);
    }
    return {
      winner,
      survivors: round.map(c => c.name)
    };
  }
}
