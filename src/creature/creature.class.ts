import { ActionModel, Damage, Hit, TargetedAction } from '@sim/action';
import { Encounter } from '@sim/encounter';
import { Actions, Targets, Attack } from '@sim/strategy';
import * as _ from 'lodash';
import { Ability } from './ability.type';
import { CreatureType } from './creature-type.type';
import { CreatureModel } from './creature.model';
import { Legendary } from './legendary.interface';
import { SpellSlots } from './spell-slots.interface';

export class Creature {
  ac: number;
  name: string;
  hp: number;
  initiative: number;
  type: CreatureType;
  legendary: Legendary;
  spellSlots: SpellSlots;
  actions: ActionModel[];

  constructor(private encounter: Encounter, private model: CreatureModel) {
    this.ac = model.ac;
    this.name = model.name;
    this.hp = model.maxHp;
    this.type = model.type;
    this.legendary = { ...model.legendary };
    this.spellSlots = { ...model.spellSlots };
    this.actions = [...model.actions];
  }

  rollInitiative() {
    this.initiative = this.encounter.strategy.roll('1d20') + this.model.initiativeMod;
  }

  takeDamage(damages: Damage[], half: boolean) {
    let damage = this.totalDamage(damages);
    if (half) { damage = Math.floor(damage / 2); }
    this.hp -= damage;
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
    this.consumeResource(action, legendary);
  }

  private consumeResource(action: TargetedAction, legendary: boolean) {
    if (!action) { return; }
    if (action.action.uses !== undefined) { action.action.uses--; }
    if (legendary && action.action.legendary) { this.legendary.actions -= action.action.legendary; }
    if (action.castLevel) { this.spellSlots[action.castLevel]--; }
  }

  makeSave(save: Ability, dc: number): Hit {
    const d20 = this.encounter.strategy.roll('1d20');
    if (d20 === 20) { return 'miss'; };
    if (!save || !dc) { throw Error('Saving throw action requires a save ability and DC.'); }
    return d20 + this.model.saves[save] >= dc ? 'miss' : 'hit';
  }

  private offensive(legendary: boolean = false): TargetedAction {
    const actions = Actions.possibleActions(this, legendary);
    const targets = Targets.opposing(this, this.encounter.creatures).filter(c => c.hp > 0);
    const action = this.encounter.strategy.offensive(this, actions, targets, this.encounter.strategy);
    if (!action.action || action.targets.length === 0) {
      return;
    }
    if (action.action.method === 'attack') {
      this.attack(action.action, action.targets);
    } else {
      this.save(action.action, action.targets);
    }
    return action;
  }

  private defensive(legendary: boolean = false): TargetedAction {
    // TODO: Implement defensive action.
    throw Error('Defensive action not implemented!');
  }

  private attack(action: ActionModel, targets: Creature[]) {
    targets.forEach(target => {
      const hit = Attack.doesHit(action, target, this.encounter.strategy.roll);
      if (hit !== 'miss') {
        const damages = Attack.rollAllDamage(
          action, this.encounter.strategy.roll,
          hit === 'crit' ? this.encounter.strategy.critical : null
        );
        target.takeDamage(damages, false);
      }
    });
  }

  private save(action: ActionModel, targets: Creature[]) {
    // TODO: This is flat out wrong!
    const damages = Attack.rollAllDamage(action, this.encounter.strategy.roll);
    targets.forEach(target => {
      let hit = Attack.doesHit(action, target, this.encounter.strategy.roll);
      if (hit !== 'miss' && target.legendary && target.legendary.resistances > 0) {
        hit = 'miss';
        target.legendary.resistances--;
      }
      target.takeDamage(damages, true);
    });
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
