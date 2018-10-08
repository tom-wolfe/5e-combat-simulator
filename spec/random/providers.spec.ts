import { AverageProvider, MaxProvider } from '@sim/random/providers';

describe('dice utils', () => {
  describe('ConstantProvider', () => {
    it('should provide the same dice roll all the time.', () => {
      const provider = new AverageProvider()
      expect(provider.numberBetween(1, 100)).toBe(50.5);
      expect(provider.numberBetween(1, 6)).toBe(3.5);
      expect(provider.numberBetween(1, 8)).toBe(4.5);
    })
  });
  describe('MaxProvider', () => {
    it('should provide the given list of dice rolls.', () => {
      const provider = new MaxProvider()
      expect(provider.numberBetween(1, 100)).toBe(100);
      expect(provider.numberBetween(1, 6)).toBe(6);
      expect(provider.numberBetween(1, 8)).toBe(8);
    })
  });
});
