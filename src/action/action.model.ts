import { Ability } from '@sim/creature';
import { DamageRoll } from './damage-roll.interface';
import { Method } from './method.type';

export interface ActionModel {
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
