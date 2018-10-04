import * as _ from 'lodash';
import { Dice, RandomProvider } from 'dice-typescript';

import { Creature, CreatureType, EncounterCreature } from '@sim/models/creature';
import { EncounterResult } from '@sim/models/encounter';

export class Encounter {
  private dice: Dice;
  constructor(provider?: RandomProvider) {
    this.dice = new Dice(null, provider)
  }

  roll(input: string) {
    return this.dice.roll(input).total;
  }

  begin(creatures: Creature[]): EncounterCreature[] {
    const output: EncounterCreature[] = creatures.map(c => _.merge({}, c, { hp: 0, initiative: 0 }));
    output.forEach(c => {
      c.hp = c.maxHp;
      c.initiative = this.roll('1d20') + c.initiativeBonus;
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
    return this.roll('1d20') + creature.toHit >= target.ac;
  }

  calculateDamage(creature: EncounterCreature) {
    return this.roll(creature.damage);
  }

  dealDamage(creature: EncounterCreature, damage: number) {
    creature.hp -= damage;
  }

  attack(creature: EncounterCreature, target: EncounterCreature) {
    if (!this.toHit(creature, target)) { return; }
    const damage = this.calculateDamage(creature);
    this.dealDamage(target, damage);
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
      survivors: round.filter(c => c.hp > 0).map(c => c.name)
    };
  }
}
