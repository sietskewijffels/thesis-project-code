function calculatePercentages(memory) {

  const total = Object.values(memory).reduce((acc, val) => acc + val, 0);
  const percentages = {};

  for (const category in memory) {
    percentages[category] = (memory[category] / total) * 100;
  }

  return percentages;
}

// 
export default calculatePercentages;
