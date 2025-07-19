const xpThresholds = [
  0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411,
  2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824,
  12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648,
  37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333,
  111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886,
  273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032,
  668051, 737627, 814445, 899257, 992895, 1_096_278, 1_210_421, 1_336_443,
  1_475_581, 1_629_200, 1_798_808, 1_986_068, 2_192_818, 2_421_087, 2_673_114,
  2_951_373, 3_258_594, 3_597_792, 3_972_294, 4_385_776, 4_842_295, 5_346_332,
  5_902_831, 6_517_253, 7_195_629, 7_944_614, 8_771_558, 9_684_577, 10_692_629,
  11_805_606, 13_034_431,
] as const;

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
