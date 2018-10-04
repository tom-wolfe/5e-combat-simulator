import { Encounter } from '../src/encounter';

describe('encounter', () => {
  describe('initiative', () => {
    it('should return a d20 roll plus initiative bonus.', () => {
      const dice = _ => 5;
      const creatures = [{ initiativeBonus: 5 }];
      const encounter = new Encounter(dice);
      const result = encounter.initiative(creatures);
      expect(result[0].initiative).toEqual(10);
    });
  });
});
