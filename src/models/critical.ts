import { DamageRoll } from '@sim/models/damage';
import { DiceRoller } from '@sim/models/dice';

export type CriticalStrategy = (roller: DiceRoller, damage: DamageRoll) => number;
