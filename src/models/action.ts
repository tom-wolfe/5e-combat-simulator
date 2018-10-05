import { Creature } from '@sim/models';

export type Hit = 'hit' | 'miss' | 'crit';

export interface Action {
  name: string;
  method: Method;
  mod: number;
  halfOnSuccess?: boolean;
  damages: DamageRoll[];
}

export type Method = 'attack' | 'save';

export type DamageType =
  'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic'
  | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';

export interface DamageRoll {
  dice?: string;
  mod?: number;
  type: DamageType;
  magical?: boolean;
}

export interface TargettedAction {
  action: Action;
  targets: Creature[];
}

export interface Damage {
  amount: number;
  type: DamageType;
  magical?: boolean;
}
