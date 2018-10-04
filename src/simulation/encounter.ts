import { Creature, CreatureType, EncounterCreature } from '@sim/models/creature';
import { CriticalStrategy } from '@sim/models/critical';
import { DamageRoll, Hit } from '@sim/models/damage';
import { EncounterResult } from '@sim/models/encounter';
import { TargetStrategy } from '@sim/models/target';
import { Dice, RandomProvider } from 'dice-typescript';
import * as _ from 'lodash';

import * as Critical from './critical';
import * as Target from './target';

export class Encounter {
  private dice: Dice;
  criticalStrategy: CriticalStrategy = Critical.rollTwice;
  targetStrategy: TargetStrategy = Target.random;

  constructor(provider?: RandomProvider) {
    this.dice = new Dice(null, provider);
  }

  critical(damage: DamageRoll): number {
    return this.criticalStrategy(this.roll.bind(this), damage);
  }

  roll(input: string): number {
    return this.dice.roll(input).total;
  }

  begin(creatures: Creature[]): EncounterCreature[] {
    const output: EncounterCreature[] = creatures.map(c => _.merge({}, c, { hp: 0, initiative: 0 }));
    output.forEach(c => {
      c.hp = c.maxHp;
      c.initiative = this.roll('1d20') + c.initiativeMod;
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

  target(creature: EncounterCreature, creatures: EncounterCreature[]): EncounterCreature {
    const targets = creatures.filter(c => c.hp > 0 && c.type !== creature.type);
    return this.targetStrategy(targets);
  }

  toHit(creature: EncounterCreature, target: EncounterCreature): Hit {
    const d20 = this.roll('1d20');
    if (d20 === 20) { return 'crit'; };
    return d20 + creature.toHit >= target.ac ? 'hit' : 'miss';
  }

  calculateDamage(creature: EncounterCreature, hit: Hit): number {
    switch (hit) {
      case 'miss': return 0;
      case 'hit': return this.roll(creature.damage.dice) + creature.damage.mod;
      case 'crit': return this.critical(creature.damage);
    }
  }

  dealDamage(creature: EncounterCreature, damage: number) {
    creature.hp -= damage;
  }

  attack(creature: EncounterCreature, target: EncounterCreature) {
    const hit = this.toHit(creature, target);
    const damage = this.calculateDamage(creature, hit);
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
