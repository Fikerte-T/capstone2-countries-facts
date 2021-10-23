import { commentCounter } from '../commentCounter.js';

describe('Testing the comment counter function', () => {
  const arr = [1, 2, 3, 4, 5];
  test('test number of items in comments array', () => {
    expect(commentCounter(arr)).toBe(5);
  });
});
