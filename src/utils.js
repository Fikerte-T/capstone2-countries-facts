const add = (elts) => elts.reduce((t, n) => t + n, 0);
const mean = (elts) => add(elts) / elts.length.toFixed(2);

const commentCounter = (arr) => {
  const count = arr.length;
  return count;
};

export { add, mean, commentCounter };
