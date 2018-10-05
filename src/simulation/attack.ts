import * as Models from '@sim/models';
import { RollDice, DamageRoll, Action, Damage, CriticalStrategy } from '@sim/models';
import * as _ from 'lodash';

export function doesHit(action: Models.Action, target: Models.Creature, roll: RollDice): Models.Hit {
  if (action.method === 'attack') {
    return toHit(action, target, roll);
  } else {
    return savingThrow(action, target, roll);
  }
}

export function toHit(action: Action, target: Models.Creature, roll: RollDice): Models.Hit {
  const d20 = roll('1d20');
  if (d20 === 20) { return 'crit'; };
  return d20 + action.mod >= target.ac ? 'hit' : 'miss';
}

export function savingThrow(action: Models.Action, target: Models.Creature, roll: RollDice): Models.Hit {
  const d20 = roll('1d20');
  if (d20 === 20) { return 'miss'; };
  // TODO: Add saving throw modifier.
  return d20 >= action.mod ? 'miss' : 'hit';
}

export function calculateDamage(action: Models.Action, hit: Models.Hit, roll: RollDice, critical: CriticalStrategy): Damage[] {
  switch (action.method) {
    case 'attack': return attackDamage(action, hit, roll, critical);
    case 'save': return saveDamage(action, hit, roll);
  }
}

export function attackDamage(action: Models.Action, hit: Models.Hit, roll: RollDice, critical: CriticalStrategy): Damage[] {
  switch (hit) {
    case 'miss': return []; // No damage.
    case 'hit': return rollAllDamage(action, roll);
    case 'crit': return rollAllDamage(action, roll, critical);
  }
}

export function saveDamage(action: Models.Action, hit: Models.Hit, roll: RollDice): Damage[] {
  if (hit === 'miss') {
    if (action.halfOnSuccess) {
      const damage = rollAllDamage(action, roll, null);
      damage.forEach(d => d.amount = Math.floor(d.amount / 2));
      return damage;
    } else {
      return [];
    }
  } else {
    return rollAllDamage(action, roll, null);
  }
}

export function totalDamage(damages: Damage[]): number {
  // TODO: Factor in resistance.
  return _.sum(damages.map(d => d.amount));
}

function rollAllDamage(action: Models.Action, roll: RollDice, critical?: CriticalStrategy): Damage[] {
  return action.damages.map(d => rollDamage(d, roll, critical));
}

function rollDamage(damage: DamageRoll, roll: RollDice, critical?: CriticalStrategy): Damage {
  return {
    amount: (critical || normalDamage)(damage, roll),
    type: damage.type,
    magical: !!damage.magical
  };
}

function normalDamage(damage: DamageRoll, roll: RollDice): number {
  let amount = 0;
  if (damage.dice) { amount += roll(damage.dice); }
  if (damage.mod) { amount += damage.mod; }
  return amount;
}

