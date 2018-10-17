import { Creature, CreatureModel } from '@sim/creature';
import { DiceRoller, Encounter } from '@sim/encounter';
import { ConstantProvider } from '@spec/utils/dice';
import { Damage } from '@sim/action';

const model: CreatureModel = {
  name: '1',
  type: 'player',
  ac: 10,
  actions: [],
  initiativeMod: 1,
  maxHp: 20,
  regeneration: 10,
  saves: { str: 0, dex: 0, con: 0, int: 0, wis: 3, cha: 0 },
  legendary: { actions: 3, resistances: 0 },
  alterations: [
    { type: 'fire', alteration: 'resistant' },
    { type: 'psychic', alteration: 'immune' },
    { type: 'thunder', alteration: 'vulnerable' },
    { type: 'slashing', alteration: 'immune', mundaneOnly: true }
  ]
};

describe('creature', () => {
  describe('constructor', () => {
    it('should start with the same values as the model.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      expect(creature.name).toEqual(model.name);
      expect(creature.type).toEqual(model.type);
      expect(creature.hp).toEqual(model.maxHp);
      expect(creature.legendary.actions).toEqual(model.legendary.actions);
      expect(creature.legendary.resistances).toEqual(model.legendary.resistances);
    });
  });
  describe('doesHit', () => {
    it('should count ac when determining if an attack hits.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      expect(creature.doesHit(9)).toEqual('miss');
      expect(creature.doesHit(10)).toEqual('hit');
      expect(creature.doesHit(11)).toEqual('hit');
    });
  });
  describe('heal', () => {
    it('should recover hp.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      creature.hp = 10;
      expect(creature.heal(5)).toEqual(15);
    });
    it('should heal up from zero.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      creature.hp = -100;
      expect(creature.heal(5)).toEqual(5);
    });
    it('should not heal over max hp.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      creature.hp = 5;
      expect(creature.heal(100)).toEqual(model.maxHp);
    });
  });
  describe('makeSave', () => {
    it('should add ability modifier to a save.', () => {
      const roller: DiceRoller = {
        random: new ConstantProvider(10),
        roll: _ => 10
      };
      const encounter = new Encounter(null, roller);
      const creature = new Creature(encounter, model);
      expect(creature.makeSave(10, 'wis')).toEqual('miss');
      expect(creature.makeSave(12, 'wis')).toEqual('miss');
      expect(creature.makeSave(15, 'wis')).toEqual('hit');
    });
    it('should be able to use legendary resistance to make a save.', () => {
      const roller: DiceRoller = {
        random: new ConstantProvider(10),
        roll: _ => 10
      };
      const encounter = new Encounter(null, roller);
      const creature = new Creature(encounter, model);
      creature.legendary.resistances = 1;
      expect(creature.makeSave(999, 'wis')).toEqual('miss');
      expect(creature.legendary.resistances).toEqual(0);
      expect(creature.makeSave(999, 'wis')).toEqual('hit');
    });
  });
  describe('rollInitiative', () => {
    it('should add initiative modifier.', () => {
      const roller: DiceRoller = {
        random: new ConstantProvider(10),
        roll: _ => 10
      };
      const encounter = new Encounter(null, roller);
      const creature = new Creature(encounter, model);
      expect(creature.rollInitiative()).toEqual(11);
    });
  });
  describe('takeDamage', () => {
    it('should subtract damage from HP.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 6 },
        { amount: 4 }
      ];
      expect(creature.takeDamage(damage)).toEqual(10);
    });
    it('should not drop hp below zero.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 9999, type: 'fire' },
      ];
      expect(creature.takeDamage(damage)).toEqual(0);
    });
  });
  describe('totalDamage', () => {
    it('should add all damage together.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 6 },
        { amount: 4 }
      ];
      expect(creature.totalDamage(damage)).toEqual(10);
    });
    it('should half resistant damage.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 7, type: 'fire' },
      ];
      expect(creature.totalDamage(damage)).toEqual(3);
    });
    it('should not be immune to magical damage.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      expect(creature.totalDamage([
        { amount: 7, type: 'slashing', magical: false },
      ])).toEqual(0);
      expect(creature.totalDamage([
        { amount: 7, type: 'slashing', magical: true },
      ])).toEqual(7);
    });
    it('should null immune damage.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 7, type: 'psychic' },
      ];
      expect(creature.totalDamage(damage)).toEqual(0);
    });
    it('should double vulnerable damage.', () => {
      const encounter = new Encounter(null, null);
      const creature = new Creature(encounter, model);
      const damage: Damage[] = [
        { amount: 7, type: 'thunder' },
      ];
      expect(creature.totalDamage(damage)).toEqual(14);
    });
  });
  describe('turn', () => {
    describe('turn', () => {
      it('should reset legendary actions on a regular turn.', () => {
        const encounter = new Encounter();
        const creature = new Creature(encounter, model);
        creature.legendary.actions = 0;
        creature.turn(false);
        expect(creature.legendary.actions).toEqual(3);
      });
      it('should not reset legendary actions on a legendary turn.', () => {
        const encounter = new Encounter();
        const creature = new Creature(encounter, model);
        creature.legendary.actions = 1;
        creature.turn(true);
        expect(creature.legendary.actions).toEqual(1);
      });
      it('should regenerate health on a regular turn.', () => {
        const encounter = new Encounter();
        const creature = new Creature(encounter, model);
        creature.hp = 10;
        creature.turn(false);
        expect(creature.hp).toEqual(20);
      });
      it('should not regenerate health over max.', () => {
        const encounter = new Encounter();
        const creature = new Creature(encounter, model);
        creature.hp = 15;
        creature.turn(false);
        expect(creature.hp).toEqual(20);
      });
      it('should not regenerate health on a legendary turn.', () => {
        const encounter = new Encounter();
        const creature = new Creature(encounter, model);
        creature.hp = 10;
        creature.turn(true);
        expect(creature.hp).toEqual(10);
      });
    });
  });
});
