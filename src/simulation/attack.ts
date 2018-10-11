import * as Models from '@sim/models';
import { Action, Damage, DamageRoll, DiceStrategy, RollDice } from '@sim/models';
import { Creature } from './creature';

export function doesHit(action: Models.Action, target: Creature, roll: RollDice): Models.Hit {
  if (action.method === 'attack') {
    return toHit(action, target, roll);
  } else {
    return savingThrow(action, target, roll);
  }
}

export function toHit(action: Action, target: Creature, roll: RollDice): Models.Hit {
  const d20 = roll('1d20');
  if (d20 === 20) { return 'crit'; };
  return d20 + (action.mod || 0) >= target.ac ? 'hit' : 'miss';
}

export function savingThrow(action: Models.Action, target: Creature, roll: RollDice): Models.Hit {
  return target.makeSave(action.save, action.mod, roll);
}

export function rollAllDamage(action: Models.Action, roll: RollDice, modifier?: DiceStrategy): Damage[] {
  return action.damages.map(d => rollDamage(d, roll, modifier));
}

export function rollDamage(damage: DamageRoll, roll: RollDice, modifier?: DiceStrategy): Damage {
  const dmg: Damage = {
    amount: (modifier || normalDamage)(damage, roll),
    type: damage.type,
    magical: !!damage.magical
  };
  return dmg;
}

export function normalDamage(damage: DamageRoll, roll: RollDice): number {
  let amount = 0;
  if (damage.dice) { amount += (roll(damage.dice) || 0); }
  if (damage.mod) { amount += (damage.mod || 0); }
  return amount;
}
