import { Action, ActionModel } from '@sim/action';
import { Creature } from '@sim/creature';
import { EncounterStrategy } from '@sim/encounter';
import { AverageProvider } from '@sim/random';
import { max, min } from '@sim/util';
import { Dice } from 'dice-typescript';
import * as _ from 'lodash';
import { Attack } from './attack';

function possibleActions(creature: Creature, legendary: boolean): ActionModel[] {
  let actions = creature.actions.filter(c => c.uses === undefined || c.uses > 0);

  if (creature.spellSlots) {
    const highestSlot = _.max(Object.keys(creature.spellSlots).filter(level => creature.spellSlots[level] > 0).map(Number));
    actions = actions.filter(a => a.spellLevel === undefined || a.spellLevel <= highestSlot);
  }

  if (legendary) {
    actions = actions.filter(a => a.legendary >= creature.legendary.actions);
  }
  return actions;
}

function first(actions: ActionModel[], strategy: EncounterStrategy): ActionModel {
  return actions[0];
}

function random(actions: ActionModel[], strategy: EncounterStrategy): ActionModel {
  return actions[strategy.random.numberBetween(0, actions.length - 1)]
}

function highestAverage(actions: ActionModel[]): { action: ActionModel, damage: number } {
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const avgRoll = input => dice.roll(input).total;
  const result = max(actions, a => _.sum(Attack.rollAllDamage(a, avgRoll).map(d => d.amount)));
  return { action: result.object, damage: result.value };
}

function unlimited(action: ActionModel): boolean {
  return action.uses === undefined && action.spellLevel === undefined;
}

function leastForce(actions: ActionModel[], targets: Creature[]): ActionModel {
  const maxHp = _.max(targets.map(t => t.hp));
  const avgProvider = new AverageProvider();
  const dice = new Dice(null, avgProvider);
  const maxRoll = input => dice.roll(input).total;

  const actionDamages = actions.map(a => ({ a, v: _.sum(Attack.rollAllDamage(a, maxRoll)) }));

  // Try for the most powerful unlimited move.
  let action = max(actionDamages.filter(a => unlimited(a.a)), a => a.v);

  // If not, try for the least powerful limited move.
  if (action.value < maxHp) {
    action = min(actionDamages.filter(a => !unlimited(a.a) && a.v >= maxHp), a => a.v);
  }

  // Neither of those work, so just use the strongest action.
  if (!action.object) {
    action = max(actionDamages, a => a.v);
  }

  return action.object.a;
}

export const Actions = {
  possibleActions,
  first,
  random,
  highestAverage,
  unlimited,
  leastForce
};
