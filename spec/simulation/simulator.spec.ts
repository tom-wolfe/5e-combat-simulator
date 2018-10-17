
// const creatures: CreatureMode[] = [
//   { name: '1', type: 'player', ac: 10, actions: [], initiativeMod: 0, maxHp: 10, saves: null },
//   { name: '2', type: 'player', ac: 10, actions: [], initiativeMod: 1, maxHp: 10, saves: null },
//   { name: '3', type: 'player', ac: 10, actions: [], initiativeMod: 2, maxHp: 10, saves: null },
//   { name: '4', type: 'player', ac: 10, actions: [], initiativeMod: 3, maxHp: 10, saves: null }
// ];

describe('simulator', () => {
  // describe('begin', () => {
  //   it('should roll initiative and reset HP.', () => {
  //     const simulator = new Simulator();
  //     const encounter = _.cloneDeep(creatures);
  //     encounter.roll = _n => 5;
  //     simulator.begin(encounter);

  //     expect(encounter[0].initiative).toEqual(5);
  //     expect(encounter[1].initiative).toEqual(6);
  //     expect(encounter[2].initiative).toEqual(7);
  //     expect(encounter[3].initiative).toEqual(8);
  //   });
  // });
  // describe('turnOrder', () => {
  //   it('should return creatures in descending order of initiative.', () => {
  //     const simulator = new Simulator();
  //     const encounter = _.cloneDeep(templateEncounterModel);
  //     encounter.roll = _n => 5;
  //     simulator.begin(encounter);
  //     const creatures = simulator.turnOrder(encounter.creatures);
  //     expect(creatures[0].initiative).toEqual(8);
  //     expect(creatures[1].initiative).toEqual(7);
  //     expect(creatures[2].initiative).toEqual(6);
  //     expect(creatures[3].initiative).toEqual(5);
  //   });
  // });
  // describe('dealDamage', () => {
  //   it('should reduce HP by the damage dealt.', () => {
  //     const target: CreatureModel = {
  //       name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2, saves: null
  //     };
  //     const simulator = new Simulator();
  //     simulator.dealDamage(target, [{ amount: 4, type: 'fire' }], false);
  //     expect(target.hp).toBe(6);
  //   });
  //   it('should reduce HP by half the damage dealt.', () => {
  //     const target: CreatureModel = {
  //       name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2, saves: null
  //     };
  //     const simulator = new Simulator();
  //     simulator.dealDamage(target, [{ amount: 5, type: 'fire' }], true);
  //     expect(target.hp).toBe(8);
  //   });
  // });
  // describe('winner', () => {
  //   it('should return undefined if there are no winners.', () => {
  //     const test: EncounterModel = {
  //       creatures: [
  //         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2, saves: null },
  //         { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2, saves: null },
  //         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2, saves: null },
  //       ]
  //     };
  //     const simulator = new Simulator();
  //     const winner = simulator.winner(test);
  //     expect(winner).toBeFalsy();
  //   });
  //   it('should return the correct winner.', () => {
  //     const test: EncounterModel = {
  //       creatures: [
  //         { name: '', type: 'player', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 10, initiativeMod: 2, saves: null },
  //         { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2, saves: null },
  //         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2, saves: null },
  //       ]
  //     };
  //     const simulator = new Simulator();
  //     const winner = simulator.winner(test);
  //     expect(winner).toEqual('monster');
  //   });
  // });
});
