const Encounter = require('./encounter');

const creatures = [
  { name: 'Test', type: 'player', ac: 10, toHit: 0, damage: d => d('2d8') + 4, hp: 10, initiativeBonus: 5 }
];

describe('encounter', () => {
  describe('initiative', () => {
    it('should return a d20 roll plus initiative bonus.', () => {
      const dice = _ => 5;
      const creatures = [{ initiativeBonus: 5 }];
      const encounter = Encounter(dice);
      const result = encounter.initiative(creatures);
      expect(result[0].initiative).toEqual(10);
    });
  });
});