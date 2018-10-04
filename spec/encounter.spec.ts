import { Encounter } from '../src/encounter';
import { EncounterCreature } from '../src/models/creature';

describe('encounter', () => {
  describe('initiative', () => {
    it('should return a d20 roll plus initiative bonus.', () => {
      const dice = _ => 5;
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: d => d(''), hp: 10, maxHp: 10, initiativeBonus: 2, initiative: 0 },
      ];
      const encounter = new Encounter(dice);
      encounter.initiative(creatures);
      expect(creatures[0].initiative).toEqual(7);
    });
  });
});
