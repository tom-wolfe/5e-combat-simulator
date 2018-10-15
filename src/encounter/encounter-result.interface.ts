import { Creature, CreatureType } from '@sim/creature';
import { EncounterTranscript } from './encounter-transcript.interface';

export interface EncounterResult {
  winner: CreatureType;
  survivors: Creature[];
  rounds: number;
  transcript: EncounterTranscript;
}
