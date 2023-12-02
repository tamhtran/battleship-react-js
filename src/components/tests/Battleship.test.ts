import Battleship  from "../Battleship";

test('Initialize Battleship', () => {
  const battleship = new Battleship(4, [0,0], true);
  expect(battleship.getParts).toEqual([false,false,false,false]);
  expect(battleship.getLength).toEqual(4);
  expect(battleship.getOrigin).toEqual([0,0]);
  expect(battleship.getIsVertical).toEqual(true);
});


test('Hit Method on Valid Part', () => {
    const battleship = new Battleship(4, [0,0], false);
    battleship.hit(2);
    expect(battleship.getParts).toEqual([false,false,true,false]);
  });

  test('Hit Method on inValid Part', () => {
    expect(() => new Battleship(4, [0,0], false).hit(4)).toThrow();
  });

  test('isSunk before Any Hits', () => {
    const battleship = new Battleship(4, [0,0], false);
    expect(battleship.isSunk()).toEqual(false);
  });

  test('isSunk after all parts Hit', () => {
    const battleship = new Battleship(3, [0,0], false);
    battleship.hit(0);
    battleship.hit(1);
    battleship.hit(2);
    expect(battleship.isSunk()).toEqual(true);
  });