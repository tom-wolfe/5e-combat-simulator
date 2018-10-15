import { Action, Damage, Hit, TargetedAction } from '@sim/action';
import { Encounter } from '@sim/encounter';
import { Targets } from '@sim/strategy';
import * as _ from 'lodash';
import { Ability } from './ability.type';
import { CreatureType } from './creature-type.type';
import { CreatureModel } from './creature.model';
import { Legendary } from './legendary.interface';
import { SpellSlots } from './spell-slots.interface';

export class Creature {
  name: string;
  hp: number;
  initiative: number;
  type: CreatureType;
  legendary: Legendary;
  spellSlots: SpellSlots;
  actions: Action[];

  constructor(private encounter: Encounter, private model: CreatureModel) {
    this.name = model.name;
    this.hp = model.maxHp;
    this.type = model.type;
    this.legendary = { ...model.legendary };
    this.spellSlots = { ...model.spellSlots };
    this.actions = model.actions.map(a => new Action(encounter, this, a));
  }

  availableActions(legendary: boolean): Action[] {
    return this.actions.filter(a => a.available(legendary));
  }

  doesHit(roll: number): Hit {
    return roll >= this.model.ac ? 'hit' : 'miss';
  }

  highestSpellSlot(): number {
    if (!this.model.spellSlots) { return undefined; }
    return _.max(Object.keys(this.spellSlots).filter(level => this.spellSlots[level] > 0).map(Number));
  }

  makeSave(dc: number, save: Ability): Hit {
    const d20 = this.encounter.dice.roll('1d20');
    if (d20 === 20) { return 'miss'; };

    let result: Hit = d20 + this.model.saves[save] >= dc ? 'miss' : 'hit';
    if (result === 'hit' && this.legendary.resistances > 0) {
      this.legendary.resistances--;
      result = 'miss';
    }
    return result;
  }

  rollInitiative() {
    this.initiative = this.encounter.dice.roll('1d20') + this.model.initiativeMod;
  }

  takeDamage(damages: Damage[]) {
    this.hp -= this.totalDamage(damages);
  }

  totalDamage(damages: Damage[]): number {
    const alterations = this.model.alterations || [];
    return _.sum(damages.map(damage => {
      const a = alterations.find(o => o.type === damage.type && (!o.mundaneOnly || !damage.magical));
      if (!a) {
        return damage.amount;
      } else {
        switch (a.alteration) {
          case 'immune': return 0;
          case 'resistant': return Math.floor(damage.amount / 2);
          case 'vulnerable': return damage.amount * 2;
        }
      }
    }));
  }

  turn(legendary: boolean = false) {
    this.regenerate();
    this.resetLegendaryActions();

    const approach = this.encounter.strategy.approach(this, this.encounter.strategy);
    const action = approach === 'offensive'
      ? this.offensive(legendary)
      : this.defensive(legendary);
    if (!action.action || action.targets.length === 0) { return; }
    action.action.take(action.targets, legendary);
  }

  private offensive(legendary: boolean = false): TargetedAction {
    const actions = this.actions.filter(a => a.available(legendary));
    const targets = Targets.opposing(this, this.encounter.creatures).filter(c => c.hp > 0);
    return this.encounter.strategy.offensive(this, actions, targets, this.encounter);
  }

  private defensive(legendary: boolean = false): TargetedAction {
    // TODO: Implement defensive action.
    throw Error('Defensive action not implemented!');
  }

  private regenerate() {
    if (!this.model.regeneration) { return; }
    this.hp = Math.min(this.hp + this.model.regeneration, this.model.maxHp);
  }

  private resetLegendaryActions() {
    if (!this.model.legendary) { return; }
    this.legendary.actions = this.model.legendary.actions;
  }

}
