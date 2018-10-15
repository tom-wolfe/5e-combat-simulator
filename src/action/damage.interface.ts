import { DamageType } from './damage-type.type';

export interface Damage {
  amount: number;
  type: DamageType;
  magical?: boolean;
}
