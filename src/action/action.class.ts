import { Creature } from '@sim/creature';
import { Encounter } from '@sim/encounter';
import { AverageProvider, RollDice } from '@sim/random';
import { DiceStrategy } from '@sim/strategy';
import { Dice } from 'dice-typescript';
import * as _ from 'lodash';
import { ActionModel } from './action.model';
import { DamageRoll } from './damage-roll.interface';
import { Damage } from './damage.interface';
import { Hit } from './hit.type';
import { Method } from './method.type';

function normalDiceStrategy(damage: DamageRoll, roll: RollDice): number {
  let amount = 0;
  if (damage.dice) { amount += (roll(damage.dice) || 0); }
  if (damage.mod) { amount += (damage.mod || 0); }
  return amount;
}

export class Action {
  private _average: Damage[];
  private _averageDiceTotal: number;
  private _uses: number;

  constructor(private encounter: Encounter, private creature: Creature, private model: ActionModel) {
    this._uses = model.uses;
    const dice = new Dice(null, new AverageProvider());
    this._average = this.rollCustomDice(normalDiceStrategy, i => dice.roll(i).total);
    this._averageDiceTotal = _.sum(this._average.map(a => a.amount));
  }

  get name(): string { return this.model.name; }
  get method(): Method { return this.model.method; }
  get unlimited(): boolean {
    return this._uses === undefined && this.model.spellLevel === undefined;
  }
  get averageDice(): Damage[] { return this._average; }
  get averageDiceTotal(): number { return this._averageDiceTotal; }

  available(legendary: boolean): boolean {
    if (!!this.model.legendary !== legendary) { return false; }
    if (this.unlimited) { return true; }
    if (this._uses > 0) { return true; }
    return this.model.spellLevel <= this.creature.highestSpellSlot();
  }

  take(targets: Creature[], legendary: boolean) {
    switch (this.model.method) {
      case 'attack': this.attack(targets); break;
      case 'save': this.save(targets); break;
      case 'heal': this.heal(targets);  break;
    }
    this.expend(legendary);
  }

  private attack(targets: Creature[]) {
    targets.forEach(target => {
      const hit = this.toHit(target);
      const damage = this.rollDice(hit);
      this.encounter.transcript.attack(this.creature, hit, target, this);
      target.takeDamage(damage);
    });
  }

  private heal(targets: Creature[]) {
    const amount = _.sum(this.rollDice().map(d => d.amount));
    targets.forEach(target => {
      this.encounter.transcript.defend(this.creature, target, this);
      target.heal(amount);
    });
  }

  private expend(legendary: boolean) {
    if (this._uses !== undefined) { this._uses--; }
    if (legendary && this.model.legendary) { this.creature.legendary.actions -= this.model.legendary; }
    if (this.model.spellLevel) { this.creature.spellSlots[this.model.spellLevel]--; }
  }

  private rollDice(hit: Hit = 'hit'): Damage[] {
    if (hit === 'miss') { return []; }
    const roller = (hit === 'crit') ? this.encounter.strategy.critical : normalDiceStrategy;
    return this.rollCustomDice(roller, this.encounter.dice.roll)
  }

  private rollCustomDice(strategy: DiceStrategy, roll: RollDice): Damage[] {
    return this.model.damages.map(damage => ({
      amount: strategy(damage, roll),
      type: damage.type,
      magical: !!damage.magical
    }));
  }

  private save(targets: Creature[]) {
    const damage = this.rollDice('hit');
    targets.forEach(target => {
      this.encounter.transcript.save(this.creature, target, this);
      const targetDamage = _.cloneDeep(damage);
      const hit = target.makeSave(this.model.mod, this.model.save);
      if (hit === 'miss') {
        if (this.model.halfOnSave) {
          targetDamage.forEach(d => d.amount = Math.floor(d.amount / 2));
        } else {
          targetDamage.forEach(d => d.amount = 0);
        }
      }
      target.takeDamage(targetDamage);
    });
  }

  private toHit(target: Creature): Hit {
    const d20 = this.encounter.dice.roll('1d20');
    if (d20 === 20) { return 'crit'; };
    return target.doesHit(d20 + (this.model.mod || 0));
  }
}
