import { add, mean } from '../utils.js';

describe('add and mean work', () => {
  const elts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  test('add works', () => {
    expect(add(elts)).toBe(55);
  });
  test('mean works', () => {
    expect(mean(elts)).toBe(5.50);
  });
});
