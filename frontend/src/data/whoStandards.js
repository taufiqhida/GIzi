// WHO Child Growth Standards - simplified table 0-60 months
// Values: [age_months, -2SD (P3), median (P50), +2SD (P97)]
// Source: WHO Multicentre Growth Reference Study (rounded)

export const whoWeightBoys = [
  [0, 2.5, 3.3, 4.4], [1, 3.4, 4.5, 5.8], [2, 4.3, 5.6, 7.1],
  [3, 5.0, 6.4, 8.0], [4, 5.6, 7.0, 8.7], [5, 6.0, 7.5, 9.3],
  [6, 6.4, 7.9, 9.8], [9, 7.1, 8.9, 11.0], [12, 7.7, 9.6, 12.0],
  [15, 8.3, 10.3, 12.8], [18, 8.8, 10.9, 13.7], [21, 9.2, 11.5, 14.5],
  [24, 9.7, 12.2, 15.3], [30, 10.5, 13.3, 16.9], [36, 11.3, 14.3, 18.3],
  [42, 12.0, 15.3, 19.7], [48, 12.7, 16.3, 21.2], [54, 13.4, 17.3, 22.7],
  [60, 14.1, 18.3, 24.2]
];

export const whoWeightGirls = [
  [0, 2.4, 3.2, 4.2], [1, 3.2, 4.2, 5.5], [2, 3.9, 5.1, 6.6],
  [3, 4.5, 5.8, 7.5], [4, 5.0, 6.4, 8.2], [5, 5.4, 6.9, 8.8],
  [6, 5.7, 7.3, 9.3], [9, 6.5, 8.2, 10.5], [12, 7.0, 8.9, 11.5],
  [15, 7.6, 9.6, 12.4], [18, 8.1, 10.2, 13.2], [21, 8.6, 10.9, 14.0],
  [24, 9.0, 11.5, 14.8], [30, 10.0, 12.7, 16.4], [36, 10.8, 13.9, 18.1],
  [42, 11.6, 15.0, 19.8], [48, 12.3, 16.1, 21.5], [54, 13.0, 17.2, 23.2],
  [60, 13.7, 18.2, 24.9]
];

export const whoHeightBoys = [
  [0, 46.1, 49.9, 53.7], [1, 50.8, 54.7, 58.6], [2, 54.4, 58.4, 62.4],
  [3, 57.3, 61.4, 65.5], [4, 59.7, 63.9, 68.0], [5, 61.7, 65.9, 70.1],
  [6, 63.3, 67.6, 71.9], [9, 67.5, 72.0, 76.5], [12, 71.0, 75.7, 80.5],
  [15, 74.1, 79.1, 84.2], [18, 76.9, 82.3, 87.7], [21, 79.4, 85.1, 90.9],
  [24, 81.7, 87.8, 93.9], [30, 85.5, 91.9, 98.3], [36, 88.7, 96.1, 103.5],
  [42, 91.9, 99.9, 107.8], [48, 94.9, 103.3, 111.7], [54, 97.8, 106.7, 115.5],
  [60, 100.7, 110.0, 119.2]
];

export const whoHeightGirls = [
  [0, 45.4, 49.1, 52.9], [1, 49.8, 53.7, 57.6], [2, 53.0, 57.1, 61.1],
  [3, 55.6, 59.8, 64.0], [4, 57.8, 62.1, 66.4], [5, 59.6, 64.0, 68.5],
  [6, 61.2, 65.7, 70.3], [9, 65.3, 70.1, 75.0], [12, 68.9, 74.0, 79.2],
  [15, 72.0, 77.5, 83.0], [18, 74.9, 80.7, 86.5], [21, 77.5, 83.7, 89.8],
  [24, 80.0, 86.4, 92.9], [30, 83.6, 90.7, 97.7], [36, 87.4, 95.1, 102.7],
  [42, 91.0, 99.0, 107.4], [48, 94.1, 102.7, 111.3], [54, 97.1, 106.2, 115.2],
  [60, 99.9, 109.4, 118.9]
];

const interp = (table, ageMonths) => {
  if (ageMonths <= table[0][0]) return table[0];
  if (ageMonths >= table[table.length - 1][0]) return table[table.length - 1];
  for (let i = 0; i < table.length - 1; i++) {
    const [a1, l1, m1, u1] = table[i];
    const [a2, l2, m2, u2] = table[i + 1];
    if (ageMonths >= a1 && ageMonths <= a2) {
      const t = (ageMonths - a1) / (a2 - a1);
      return [ageMonths, l1 + (l2 - l1) * t, m1 + (m2 - m1) * t, u1 + (u2 - u1) * t];
    }
  }
  return table[table.length - 1];
};

// Build WHO reference series for chart (every month 0-60)
export const buildWhoSeries = (gender, type) => {
  const isLaki = gender === 'laki' || gender === 'L' || gender === 'male';
  let table;
  if (type === 'berat') {
    table = isLaki ? whoWeightBoys : whoWeightGirls;
  } else {
    table = isLaki ? whoHeightBoys : whoHeightGirls;
  }
  const series = [];
  for (let m = 0; m <= 60; m += 1) {
    const [, low, med, up] = interp(table, m);
    series.push({
      usia_bulan: m,
      who_low: +low.toFixed(1),
      who_median: +med.toFixed(1),
      who_up: +up.toFixed(1),
    });
  }
  return series;
};

// Determine z-score category based on value vs WHO reference
export const getZCategory = (value, gender, type, ageMonths) => {
  const isLaki = gender === 'laki' || gender === 'L' || gender === 'male';
  const table = type === 'berat'
    ? (isLaki ? whoWeightBoys : whoWeightGirls)
    : (isLaki ? whoHeightBoys : whoHeightGirls);
  const [, low, med, up] = interp(table, ageMonths);
  if (value < low) return { label: type === 'berat' ? 'Berat Kurang' : 'Pendek', color: 'red' };
  if (value > up) return { label: type === 'berat' ? 'Berat Lebih' : 'Tinggi', color: 'blue' };
  return { label: 'Normal', color: 'green' };
};
