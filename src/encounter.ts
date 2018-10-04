import * as _ from 'lodash';

import { DiceFunction } from './dice';
import { EncounterCreature, Creature, CreatureType } from './models/creature';
import { EncounterResult } from './models/encounter';

export class Encounter {

  constructor(private dice: DiceFunction) { }

  begin(creatures: Creature[]): EncounterCreature[] {
    const output: EncounterCreature[] = creatures.map(c => _.merge({}, c, { hp: 0, initiative: 0 }));
    this.resetHp(output);
    this.initiative(output);
    return output;
  }

  resetHp(creatures: EncounterCreature[]) {
    creatures.forEach(c => c.hp = c.maxHp);
  }

  initiative(creatures: EncounterCreature[]) {
    creatures.forEach(c => c.initiative = this.dice('1d20') + c.initiativeBonus);
  }

  round(creatures: EncounterCreature[]) {
    _.orderBy(creatures, c => c.initiative, 'desc').forEach(c => {
      if (c.hp > 0) {
        this.turn(c, creatures);
      }
    });
  }

  turn(creature: EncounterCreature, creatures: EncounterCreature[]) {
    const targets = creatures.filter(c => c.type !== creature.type);
    if (targets.length === 0) { return; }

    const target = targets[0];
    const toHit = this.dice('1d20') + creature.toHit;
    if (toHit < target.ac) { return; }

    const damage = creature.damage(this.dice);
    target.hp -= damage;

    if (target.hp <= 0) { creatures.splice(creatures.indexOf(target), 1); }
  }

  winner(creatures: EncounterCreature[]): CreatureType {
    if (creatures.filter(c => c.type === 'player').length === 0) { return 'monster'; }
    if (creatures.filter(c => c.type === 'monster').length === 0) { return 'player'; }
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
