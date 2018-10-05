import { EncounterCreature } from '@sim/models/creature';
import * as Target from '@sim/simulation/target';

const targets: EncounterCreature[] = [
  { name: '', ac: 10, hp: 10, maxHp: 20, damage: { dice: '1d4', mod: 1}, initiative: 10, initiativeMod: 0, toHit: 0, type: 'player' },
  { name: '', ac: 10, hp: 10, maxHp: 20, damage: { dice: '1d4', mod: 1}, initiative: 10, initiativeMod: 0, toHit: 0, type: 'player' },
  { name: '', ac: 10, hp: 8, maxHp: 20, damage: { dice: '1d4', mod: 1}, initiative: 10, initiativeMod: 0, toHit: 0, type: 'player' },
  { name: '', ac: 10, hp: 10, maxHp: 20, damage: { dice: '2d4', mod: 1}, initiative: 10, initiativeMod: 0, toHit: 0, type: 'player' }
];

describe('target', () => {
  describe('first', () => {
    it('should take the first target.', () => {
      const target = Target.first(targets);
      expect(target).toBe(targets[0]);
    })
  });
  describe('lowestHp', () => {
    it('should take the lowest HP target.', () => {
      const target = Target.lowestHp(targets);
      expect(target).toBe(targets[2]);
    })
  });
  describe('hardestHitting', () => {
    it('should take the one with the highest average damage.', () => {
      const target = Target.hardestHitting(targets);
      expect(target).toBe(targets[3]);
    })
  });
});
