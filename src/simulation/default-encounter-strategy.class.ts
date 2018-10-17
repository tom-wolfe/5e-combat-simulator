import { EncounterStrategy } from '@sim/encounter';
import { ActionStrategy, Approaches, ApproachStrategy, Criticals, DiceStrategy, Strategies } from '@sim/strategy';

export class DefaultEncounterStrategy implements EncounterStrategy {
  approach: ApproachStrategy = Approaches.smart;
  offensive: ActionStrategy = Strategies.smartOffense;
  defensive: ActionStrategy = Strategies.smartDefense;
  critical: DiceStrategy = Criticals.rollTwice;
}
