
function windowIdFinder(blocksPerColor, clickedBlock) {
  //search for the index of clickedBlock.id in the array in blocksPerColor object where the key matches clickedBlock.colorID
  let index = blocksPerColor[clickedBlock.colorID].indexOf(clickedBlock.id);
  let blockIdIndex = blocksPerColor[clickedBlock.colorID][index]
  let blockIdIndexMinusOne = blocksPerColor[clickedBlock.colorID][index - 1]
  console.log("blockIdIndex: ", blockIdIndex);
  console.log("blockIdIndexMinusOne: ", blockIdIndexMinusOne);
  let windowsize = blockIdIndex - blockIdIndexMinusOne
  console.log("windowsize: ", windowsize);
  return windowsize;
}

export default windowIdFinder;