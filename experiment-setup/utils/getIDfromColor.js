import colors from "../consts/parameters.js";

// Get ID number from color
function getIdFromColor(color) {
  for (const [id, c] of Object.entries(colors)) {
    if (c === color) {
      return parseInt(id, 10);
    }
  }
  return null; // Color not found
}

//
export default getIdFromColor;
