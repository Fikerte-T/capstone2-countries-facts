import { itemsCounter } from '../countryCounter.js';

describe('Testing the number of countries counter function', () => {
  const arr = [1, 2, 3, 4, 5].map((num) => ({ name: `country${num}`, flag: `http://flag.com/${num}` }));
  test('test number of items in the array', () => {
    expect(itemsCounter(arr)).toBe(5);
    expect(itemsCounter([])).toBe(0);
  });
});
