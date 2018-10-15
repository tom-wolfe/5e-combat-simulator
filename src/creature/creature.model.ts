import { ActionModel } from '@sim/action';
import { AbilityScores } from './ability-scores.type';
import { CreatureType } from './creature-type.type';
import { DamageTypeAlteration } from './damage-type-alteration.interface';
import { Legendary } from './legendary.interface';
import { SpellSlots } from './spell-slots.interface';

export interface CreatureModel {
  name: string,
  type: CreatureType,
  ac: number,
  actions: ActionModel[];
  hp?: number;
  maxHp: number,
  legendary?: Legendary;
  regeneration?: number;
  alterations?: DamageTypeAlteration[];
  spellSlots?: SpellSlots;
  initiativeMod: number;
  initiative?: number;
  saves: AbilityScores;
}
