
function windowIdFinder(eventArray, clickedBlock, direction) {

  let index = eventArray.indexOf(clickedBlock);
  console.log("index: ", index);
  let increaseIndex = 0;

  //true for increasing frame, false for decreasing frame
  if (direction){
    increaseIndex = 1;
  }
  
  for (let i = 1; i < eventArray.length; i++) {
    if(eventArray[index - i].colorID === clickedBlock.colorID) {
      return i+increaseIndex;
    }
  }
  return 0;

}

export default windowIdFinder;