import { Creature } from '@sim/creature';
import { Encounter } from '@sim/encounter';
import { ActionModel } from './action.model';

export class Action {
  uses: number;

  constructor(private encounter: Encounter, private creature: Creature, private model: ActionModel) {
    if (model.uses) { this.uses = model.uses; }
  }

  expend(legendary: boolean) {
    if (this.uses !== undefined) { this.uses--; }
    if (legendary && this.model.legendary) { this.creature.legendary.actions -= this.model.legendary; }
    // TODO: Upcast.
    if (this.model.spellLevel) { this.creature.spellSlots[this.model.spellLevel]--; }
  }
}
