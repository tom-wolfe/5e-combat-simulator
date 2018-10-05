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
  return d20 + (action.mod || 0) >= target.ac ? 'hit' : 'miss';
}

export function savingThrow(action: Models.Action, target: Models.Creature, roll: RollDice): Models.Hit {
  const d20 = roll('1d20');
  if (d20 === 20) { return 'miss'; };
  // TODO: Add saving throw modifier.
  return d20 >= (action.mod || 0) ? 'miss' : 'hit';
}

export function calculateDamage(action: Models.Action, hit: Models.Hit, roll: RollDice, critical: CriticalStrategy): Damage[] {
  if (roll === undefined) {
    throw Error('FUCKSAD{2');
  }
  let damages: Damage[];
  switch (action.method) {
    case 'attack': damages = attackDamage(action, hit, roll, critical); break;
    case 'save': damages = saveDamage(action, hit, roll); break;
  }
  return damages;
}

export function attackDamage(action: Models.Action, hit: Models.Hit, roll: RollDice, critical: CriticalStrategy): Damage[] {
  if (roll === undefined) {
    throw Error('FUCKSAD{2');
  }
  let damages: Damage[];
  switch (hit) {
    case 'miss': damages = []; break; // No damage.
    case 'hit': damages = rollAllDamage(action, roll, critical); break;
    case 'crit': damages = rollAllDamage(action, roll, critical); break;
  }
  return damages;
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
  if (damages.length === 0) { return 0; }
  return _.sum(damages.map(d => d.amount))
}

function rollAllDamage(action: Models.Action, roll: RollDice, critical?: CriticalStrategy): Damage[] {
  if (roll === undefined) {
    throw Error('FUCKSAD{2');
  }
  return action.damages.map(d => rollDamage(d, roll, critical));
}

function rollDamage(damage: DamageRoll, roll: RollDice, critical?: CriticalStrategy): Damage {
  if (roll === undefined) {
    throw Error('FUCKSAD{2');
  }
  const dmg: Damage = {
    amount: critical ? critical(damage, roll) : normalDamage(damage, roll),
    type: damage.type,
    magical: !!damage.magical
  }

  if (Number.isNaN(dmg.amount)) {
    console.log(JSON.stringify(roll));
    throw Error('FUCK');
  }

  return dmg;
}

function normalDamage(damage: DamageRoll, roll: RollDice): number {
  if (roll === undefined) {
    throw Error('FUCKSAD{2');
  }
  let amount = 0;
  if (damage.dice) { amount += (roll(damage.dice) || 0); }
  if (damage.mod) { amount += (damage.mod || 0); }
  return amount;
}
