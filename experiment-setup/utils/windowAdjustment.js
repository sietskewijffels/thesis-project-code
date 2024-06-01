// Get ID number from color
function windowAdjustment(window, windowLength) {
  if (window.length > windowLength) {
    let newestPart = window.slice(-(windowLength));
    return newestPart;
  } else {
    return window;
  }
}

// 
export default windowAdjustment;