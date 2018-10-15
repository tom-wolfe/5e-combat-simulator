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

function normalDamageStrategy(damage: DamageRoll, roll: RollDice): number {
  let amount = 0;
  if (damage.dice) { amount += (roll(damage.dice) || 0); }
  if (damage.mod) { amount += (damage.mod || 0); }
  return amount;
}

export class Action {
  private _average: Damage[];
  private _averageDamageTotal: number;
  private _uses: number;

  constructor(private encounter: Encounter, private creature: Creature, private model: ActionModel) {
    this._uses = model.uses;
    const dice = new Dice(null, new AverageProvider());
    this._average = this.rollCustomDamage(normalDamageStrategy, i => dice.roll(i).total);
    this._averageDamageTotal = _.sum(this._average.map(a => a.amount));
  }

  get unlimited(): boolean {
    return this._uses === undefined && this.model.spellLevel === undefined;
  }
  get averageDamage(): Damage[] { return this._average; }
  get averageDamageTotal(): number { return this._averageDamageTotal; }

  available(legendary: boolean): boolean {
    if (!!this.model.legendary !== legendary) { return false; }
    if (this.unlimited) { return true; }
    if (this._uses > 0) { return true; }
    return this.model.spellLevel <= this.creature.highestSpellSlot();
  }

  take(targets: Creature[], legendary: boolean) {
    this.model.method === 'attack' ? this.attack(targets) : this.save(targets);
    this.expend(legendary);
  }

  private attack(targets: Creature[]) {
    targets.forEach(target => {
      const hit = this.toHit(target);
      const damage = this.rollDamage(hit);
      target.takeDamage(damage);
    });
  }

  private expend(legendary: boolean) {
    if (this._uses !== undefined) { this._uses--; }
    if (legendary && this.model.legendary) { this.creature.legendary.actions -= this.model.legendary; }
    // TODO: Upcast.
    if (this.model.spellLevel) { this.creature.spellSlots[this.model.spellLevel]--; }
  }

  private rollDamage(hit: Hit): Damage[] {
    if (hit === 'miss') { return []; }
    const roller = (hit === 'crit') ? this.encounter.strategy.critical : normalDamageStrategy;
    return this.rollCustomDamage(roller, this.encounter.strategy.roll)
  }

  private rollCustomDamage(strategy: DiceStrategy, roll: RollDice): Damage[] {
    return this.model.damages.map(damage => ({
      amount: strategy(damage, roll),
      type: damage.type,
      magical: !!damage.magical
    }));
  }

  private save(targets: Creature[]) {
    const damage = this.rollDamage('hit');
    targets.forEach(target => {
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
    const d20 = this.encounter.strategy.roll('1d20');
    if (d20 === 20) { return 'crit'; };
    return target.doesHit(d20 + (this.model.mod || 0));
  }
}
