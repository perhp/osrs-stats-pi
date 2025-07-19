const xpThresholds = (() => {
  const arr: number[] = [0];
  let acc = 0;
  for (let lvl = 2; lvl <= 99; lvl++) {
    acc += Math.floor(lvl - 1 + 300 * 2 ** ((lvl - 1) / 7));
    arr.push(Math.floor(acc / 4));
  }
  return arr;
})();

function upperBound(thresholds: readonly number[], target: number) {
  let low = 0;
  let high = thresholds.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (thresholds[mid] > target) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

export function getLevelInfo(experience: number) {
  const i = upperBound(xpThresholds, experience);

  if (i >= xpThresholds.length) {
    const maxLevel = xpThresholds.length;
    return { level: maxLevel, progress: 100 };
  }

  const previousXP = xpThresholds[i - 1] ?? 0;
  const nextXP = xpThresholds[i];
  const progress = ((experience - previousXP) / (nextXP - previousXP)) * 100;

  return { level: i, progress };
}
