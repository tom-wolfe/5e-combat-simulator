import { ActionModel, Damage, DamageRoll, Hit } from '@sim/action';
import { Creature } from '@sim/creature';
import { RollDice } from '@sim/random';
import { DiceStrategy } from './dice-strategy.type';

function doesHit(action: ActionModel, target: Creature, roll: RollDice): Hit {
  if (action.method === 'attack') {
    return toHit(action, target, roll);
  } else {
    return savingThrow(action, target);
  }
}

function toHit(action: ActionModel, target: Creature, roll: RollDice): Hit {
  const d20 = roll('1d20');
  if (d20 === 20) { return 'crit'; };
  return d20 + (action.mod || 0) >= target.ac ? 'hit' : 'miss';
}

function savingThrow(action: ActionModel, target: Creature): Hit {
  return target.makeSave(action.save, action.mod);
}

function rollAllDamage(action: ActionModel, roll: RollDice, modifier?: DiceStrategy): Damage[] {
  return action.damages.map(d => rollDamage(d, roll, modifier));
}

function rollDamage(damage: DamageRoll, roll: RollDice, modifier?: DiceStrategy): Damage {
  const dmg: Damage = {
    amount: (modifier || normalDamage)(damage, roll),
    type: damage.type,
    magical: !!damage.magical
  };
  return dmg;
}

function normalDamage(damage: DamageRoll, roll: RollDice): number {
  let amount = 0;
  if (damage.dice) { amount += (roll(damage.dice) || 0); }
  if (damage.mod) { amount += (damage.mod || 0); }
  return amount;
}

export const Attack = {
  doesHit,
  toHit,
  savingThrow,
  rollAllDamage,
  rollDamage,
  normalDamage
};
