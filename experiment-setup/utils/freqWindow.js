// Get ID number from color
function freqWindow(window) {
  // Create an object to store the count of each colorID
  const colorCount = {};

  // Iterate over each object in the 'window' array
  for (const obj of window) {
    // Extract the colorID from the object
    const colorID = obj.colorID;

    // Increment the count of the colorID in the 'colorCount' object
    colorCount[colorID] = (colorCount[colorID] || 0) + 1;
  }

  // Return the 'colorCount' object
  return colorCount;
}

export default freqWindow;