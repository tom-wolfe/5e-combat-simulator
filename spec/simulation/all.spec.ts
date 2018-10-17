import { CreatureModel } from '@sim/creature';
import { Simulator } from '@sim/simulation';

const dartagnan: CreatureModel = {
  name: 'D\'artagnan',
  type: 'player',
  ac: 19,
  maxHp: 36,
  initiativeMod: -1,
  spellSlots: { 1: 3 },
  saves: { str: 6, dex: -1, con: 5, int: +2, wis: -2, cha: 1 },
  actions: [
    {
      name: 'Lux Aeterna', method: 'attack', mod: 8,
      damages: [
        { dice: '1d10', mod: 6, type: 'slashing', magical: true },
        { dice: '1d8', mod: 0, type: 'radiant', magical: true }
      ]
    },
    {
      name: 'Fire Bolt', method: 'attack', mod: 4,
      damages: [
        { dice: '1d10', mod: 3, type: 'fire', magical: true },
      ]
    },
    {
      name: 'Thunderwave', method: 'save', mod: 12, save: 'con', spellLevel: 1,
      damages: [
        { dice: '3d8', mod: 0, type: 'thunder', magical: true },
      ]
    },
    {
      name: 'Potion of Healing', method: 'heal', uses: 1,
      damages: [
        { dice: '2d4', mod: 2 },
      ]
    },
    // TODO: Action surge.
    // TODO: Second Wind
    // TODO: Shield.
  ],
};

const sebastian: CreatureModel = {
  name: 'Sebastian',
  type: 'player',
  ac: 18,
  maxHp: 27,
  initiativeMod: 3,
  spellSlots: { 1: 4, },
  saves: { str: -1, dex: +3, con: +3, int: +5, wis: +2, cha: +0 },
  actions: [
    {
      name: 'Sacred Flame', method: 'save', mod: 13, save: 'dex',
      damages: [{ dice: '1d8', type: 'radiant', magical: true }]
    },
    {
      name: 'Crossbow', method: 'attack', mod: 5,
      damages: [{ dice: '1d8', mod: 3, type: 'piercing', magical: false }]
    },
    {
      name: 'Catapult', method: 'save', mod: 13, save: 'dex', spellLevel: 1,
      damages: [{ dice: '3d8', mod: 0, type: 'bludgeoning', magical: true }]
    },
    {
      name: 'Eldritch Blast', method: 'attack', mod: 5,
      damages: [{ dice: '1d10', mod: 0, type: 'force', magical: true }]
    },
    {
      name: 'Arms of Hadar', method: 'save', mod: 13, save: 'str', spellLevel: 1, halfOnSave: true,
      damages: [{ dice: '2d6', mod: 0, type: 'necrotic', magical: true }]
    },
    {
      name: 'Guiding Bolt', method: 'attack', mod: 5, spellLevel: 1,
      damages: [{ dice: '4d6', mod: 0, type: 'radiant', magical: true }]
    },
    {
      name: 'Potion of Healing', method: 'heal', uses: 1,
      damages: [
        { dice: '2d4', mod: 2 },
      ]
    },
    {
      name: 'Cure Wounds', method: 'heal', spellLevel: 1,
      damages: [
        { dice: '1d8', mod: 3 },
      ]
    },
    // TODO: Hellish rebuke.
    // TODO: Guiding Bolt advantage.
    // TODO: Healing pool.
    // TODO: Fire flask. Silver bomb. Acid flask
  ],
};

const patricia: CreatureModel = {
  name: 'Patricia',
  type: 'player',
  ac: 13,
  maxHp: 27,
  initiativeMod: 2,
  saves: { str: 6, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Fire Bolt', method: 'attack', mod: 6,
      damages: [{ dice: '1d8', type: 'fire', magical: true }]
    }
  ],
};

const neferi: CreatureModel = {
  name: 'Neferi',
  type: 'player',
  ac: 15,
  maxHp: 25,
  initiativeMod: 11,
  saves: { str: 0, dex: 5, con: 1, int: 2, wis: 1, cha: 2 },
  actions: [
    {
      name: 'Staff + Sneak Attack', method: 'attack', mod: 6,
      damages: [
        { dice: '1d8', mod: 4, type: 'bludgeoning' },
        { dice: '2d6', type: 'bludgeoning' }
      ]
    },
    {
      name: 'Scimitar of Warning', method: 'attack', mod: 7,
      damages: [
        { dice: '1d8', mod: 5, type: 'slashing', magical: true },
        { dice: '2d6', type: 'bludgeoning', magical: true }
      ]
    }
  ],
};

const vennris: CreatureModel = {
  name: 'Vennris',
  type: 'player',
  ac: 14,
  maxHp: 27,
  initiativeMod: 3,
  saves: { str: 6, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Fire Bolt', method: 'attack', mod: 6,
      damages: [{ dice: '1d8', type: 'fire', magical: true }]
    }
  ],
};

const monster: CreatureModel = {
  name: 'Vampire',
  type: 'monster',
  ac: 16,
  maxHp: 102,
  initiativeMod: 3,
  legendary: {
    resistances: 3,
    actions: 3,
  },
  regeneration: 10,
  alterations: [
    { alteration: 'resistant', type: 'necrotic' },
    { alteration: 'resistant', type: 'bludgeoning', mundaneOnly: true },
    { alteration: 'resistant', type: 'piercing', mundaneOnly: true },
    { alteration: 'resistant', type: 'slashing', mundaneOnly: true }
  ],
  saves: { str: 4, dex: 3, con: 4, int: 3, wis: 5, cha: 6 },
  actions: [
    {
      name: 'Multiattack (Grapple / Bite)', method: 'attack', mod: 7,
      legendary: 3,
      damages: [
        { dice: '1d6', mod: 4, type: 'piercing' },
        { dice: '2d6', mod: 0, type: 'necrotic' }
      ]
    },
    {
      name: 'Arms of Hadar',
      method: 'save', save: 'str', mod: 15, halfOnSave: true, uses: 1,
      damages: [{ dice: '4d6', mod: 0, type: 'cold' }]
    },
    {
      name: 'Blight',
      method: 'save', save: 'con', mod: 15, halfOnSave: true, uses: 1,
      damages: [{ dice: '6d8', mod: 0, type: 'cold' }]
    },
    {
      name: 'Shadow of Moil',
      method: 'attack', mod: 999, uses: 2,
      damages: [{ dice: '2d6', mod: 0, type: 'cold' }]
    }
  ],
};

const creatures: CreatureModel[] = [dartagnan, sebastian, patricia, neferi, vennris, monster];

describe('ALL', () => {
  it('runs without error.', () => {
    const simulator = new Simulator();
    const battles = 1000;
    const result = simulator.simulate(creatures, battles);

    const success = result.wins.player / battles * 100;
    let message = '\n';
    message += `Players have a ${success.toFixed(2)}% chance of success.`;
    Object.keys(result.survivors).forEach(s => {
      const n = result.survivors[s] / battles * 100;
      message += `\n${s} has a ${n.toFixed(2)}% chance of surviving.`;
    });
    message += `\nBattle lasted an average of ${result.averageRounds} rounds.`;

    console.log(message);
  });
});
