import { Creature } from '@sim/creature';
import { Approach } from './approach.type';
import { EncounterStrategy } from '@sim/encounter';

export type ApproachStrategy = (current: Creature, strategy: EncounterStrategy) => Approach;
