import { Approaches } from '@sim/strategy';

describe('approach', () => {
  describe('offensive', () => {
    it('returns offensive.', () => {
      const result = Approaches.offensive(null, null);
      expect(result).toEqual('offensive');
    });
  });
});
