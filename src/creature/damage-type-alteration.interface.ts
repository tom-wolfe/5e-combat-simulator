import { DamageAlteration } from './damage-alteration.interface';
import { DamageType } from '@sim/action';

export interface DamageTypeAlteration {
  alteration: DamageAlteration;
  type: DamageType;
  mundaneOnly?: boolean;
}
