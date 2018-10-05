import { EncounterCreature } from '@sim/models/creature';

export type TargetStrategy = (targets: EncounterCreature[]) => EncounterCreature;
