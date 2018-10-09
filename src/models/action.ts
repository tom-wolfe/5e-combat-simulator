import { Ability, Creature } from '@sim/models';

export type DamageType =
  'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic'
  | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';

export type Hit = 'hit' | 'miss' | 'crit';

export type Method = 'attack' | 'save';

export interface Action {
  name: string;
  method: Method;
  legendary?: number;
  save?: Ability;
  mod: number;
  halfOnSuccess?: boolean;
  damages: DamageRoll[];
  uses?: number;
  spellLevel?: number;
}

export interface DamageRoll {
  dice?: string;
  mod?: number;
  type: DamageType;
  magical?: boolean;
}

export interface TargettedAction {
  action: Action;
  targets: Creature[];
  castLevel: number;
}

export interface Damage {
  amount: number;
  type: DamageType;
  magical?: boolean;
}

export interface ActionForecast {
  action: Action;
  target: Creature;
  damage: number;
}
