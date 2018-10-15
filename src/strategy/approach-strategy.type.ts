import { Creature } from '@sim/creature';
import { Encounter } from '@sim/encounter';
import { Approach } from './approach.type';

export type ApproachStrategy = (current: Creature, encounter: Encounter) => Approach;
