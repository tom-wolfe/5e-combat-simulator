import * as Models from '@sim/models';
import * as Actions from '@sim/simulation/actions';
import * as Attack from '@sim/simulation/attack';
import * as Targets from '@sim/simulation/targets';
import * as _ from 'lodash';

export class Creature {
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

  rollInitiative(roll: Models.RollDice) {
    this.initiative = roll('1d20') + this.model.initiativeMod;
  }

  takeDamage(damages: Models.Damage[], half: boolean) {
    let damage = this.totalDamage(damages);
    if (half) { damage = Math.floor(damage / 2); }
    this.hp -= damage;
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

  turn(strategy: Models.EncounterStrategy, creatures: Creature[], legendary: boolean = false) {
    this.regenerate();
    this.resetLegendaryActions();

    const approach = strategy.approach(this, strategy);
    const action = approach === 'offensive'
      ? this.offensive(strategy, creatures, legendary)
      : this.defensive(strategy, creatures, legendary);
    this.consumeResource(action, legendary);
  }

  makeSave(save: Models.Ability, dc: number, roll: Models.RollDice): Models.Hit {
    const d20 = roll('1d20');
    if (d20 === 20) { return 'miss'; };
    if (!save || !dc) { throw Error('Saving throw action requires a save ability and DC.'); }
    return d20 + this.model.saves[save] >= dc ? 'miss' : 'hit';
  }

  private offensive(strategy: Models.EncounterStrategy, creatures: Creature[], legendary: boolean = false): Models.TargetedAction {
    const actions = Actions.possibleActions(this, legendary);
    const targets = Targets.opposing(this, creatures).filter(c => c.hp > 0);
    const action = strategy.offensive(this, actions, targets, strategy);
    if (!action.action || action.targets.length === 0) {
      return;
    }
    if (action.action.method === 'attack') {
      this.attack(strategy, action.action, action.targets);
    } else {
      this.save(strategy, action.action, action.targets);
    }
    return action;
  }

  private defensive(strategy: Models.EncounterStrategy, creatures: Creature[], legendary: boolean = false): Models.TargetedAction {
    // TODO: Implement defensive action.
    throw Error('Defensive action not implemented!');
  }

  private attack(strategy: Models.EncounterStrategy, action: Models.Action, targets: Creature[]) {
    targets.forEach(target => {
      const hit = Attack.doesHit(action, target, strategy.roll);
      if (hit === 'miss') {

      } else {
        const damages = Attack.rollAllDamage(action, strategy.roll, hit === 'crit' ? strategy.critical : null);
        target.takeDamage(damages, false);
      }
    });
  }

  private save(strategy: Models.EncounterStrategy, action: Models.Action, targets: Creature[]) {
    // TODO: This is flat out wrong!
    const damages = Attack.rollAllDamage(action, strategy.roll);
    targets.forEach(target => {
      let hit = Attack.doesHit(action, target, strategy.roll);
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
