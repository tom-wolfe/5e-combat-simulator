import { DamageType } from './damage-type.type';

export interface DamageRoll {
  dice?: string;
  mod?: number;
  type: DamageType;
  magical?: boolean;
}
