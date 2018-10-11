import * as Models from '@sim/models';
import * as Actions from '@sim/simulation/actions';
import * as Attack from '@sim/simulation/attack';
import * as Targets from '@sim/simulation/targets';
import * as _ from 'lodash';
import { Encounter } from './encounter';

export class Creature {
  private encounter: Encounter;

  ac: number;
  name: string;
  hp: number;
  initiative: number;
  type: Models.CreatureType;
  legendary: Models.Legendary
  spellSlots: Models.SpellSlots;
  actions: Models.Action[];

  constructor(private model: Models.CreatureModel) {
    this.ac = model.ac;
    this.name = model.name;
    this.hp = model.maxHp;
    this.type = model.type;
    this.legendary = { ...model.legendary };
    this.spellSlots = { ...model.spellSlots };
    this.actions = [...model.actions];
  }

  setEncounter(encounter: Encounter) {
    if (this.encounter) { throw Error('This creature has already been assigned to an encounter!'); }
    this.encounter = encounter;
  }

  rollInitiative() {
    this.initiative = this.encounter.strategy.roll('1d20') + this.model.initiativeMod;
  }

  takeDamage(damages: Models.Damage[], half: boolean) {
    let damage = this.totalDamage(damages);
    if (half) { damage = Math.floor(damage / 2); }
    this.hp -= damage;
    console.log(this.hp);
  }

  totalDamage(damages: Models.Damage[]): number {
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

  makeSave(save: Models.Ability, dc: number): Models.Hit {
    const d20 = this.encounter.strategy.roll('1d20');
    if (d20 === 20) { return 'miss'; };
    if (!save || !dc) { throw Error('Saving throw action requires a save ability and DC.'); }
    return d20 + this.model.saves[save] >= dc ? 'miss' : 'hit';
  }

  private offensive(legendary: boolean = false): Models.TargetedAction {
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

  private defensive(legendary: boolean = false): Models.TargetedAction {
    // TODO: Implement defensive action.
    throw Error('Defensive action not implemented!');
  }

  private attack(action: Models.Action, targets: Creature[]) {
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

  private save(action: Models.Action, targets: Creature[]) {
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

  private consumeResource(action: Models.TargetedAction, legendary: boolean) {
    if (!action) { return; }
    if (action.action.uses !== undefined) { action.action.uses--; }
    if (legendary && action.action.legendary) { this.legendary.actions -= action.action.legendary; }
    if (action.castLevel) { this.spellSlots[action.castLevel]--; }
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
