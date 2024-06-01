function detectAnomalies(data, windowSize, threshold) {
  const anomalies = [];
  let prevWindowCounts = null;

  for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);
      const categoryCounts = {};

      // Count occurrences of categories in the current window
      for (const event of window) {
          if (categoryCounts[event]) {
              categoryCounts[event]++;
          } else {
              categoryCounts[event] = 1;
          }
      }

      if (prevWindowCounts !== null) {
          // Compare frequencies between the current window and the previous window
          let changeDetected = false;
          for (const category in categoryCounts) {
              const count = categoryCounts[category];
              const prevCount = prevWindowCounts[category] || 0;
              if (prevCount === 0 && count > 0) {
                  changeDetected = true; // Significant change from zero to non-zero count
              } else if (prevCount > 0) {
                  const changeRatio = Math.abs((count - prevCount) / prevCount);
                  if (changeRatio > threshold) {
                      changeDetected = true;
                      break;
                  }
              }
          }

          if (changeDetected) {
              anomalies.push(i); // Mark window as anomalous
          }
      }

      prevWindowCounts = categoryCounts;
  }

  return anomalies;
}

// Example usage:
const data = ["A", "B", "A", "C", "B", "A", "A", "C", "B", "A", "B", "A", "C", "B", "A", "A", "C", "B", "A", "B"];
const windowSize = 10;
const threshold = 0.5; // Adjust threshold based on your requirements
const anomalies = detectAnomalies(data, windowSize, threshold);
console.log("Anomalous windows:", anomalies);
