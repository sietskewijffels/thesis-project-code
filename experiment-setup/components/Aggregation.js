import getColorFromEvent from "../utils/getColorFromEvent.js";
import getIdFromColor from "../utils/getIDfromColor.js";
import Partition from "./Partition.js";

export default class Aggregation {
  constructor(seqContainer, removedBlockColor, anomalyColorArray) {
    this.container = d3.select(seqContainer)
      .append("div")
      .style("width", "200px") // Adjust the width to accommodate the fraction bar
      .style("height", "100%")
      .style("overflow", "hidden")
      .style("display", "flex")
      .style("background-color", 'rgba(255,255,255)')
      .style(
        "background-image",
        "linear-gradient(0deg, rgba(255,0,0,0), rgba(255,255,255,1) 150%)"
      )
      .style("margin-right", '3px')
      .style("position", "relative"); // Set the position of the main sequence as relative
    this.color = removedBlockColor;
    this.blockMemory = [];
    this.partitionObjects = [];
    this.anomalyColorArray = anomalyColorArray

    //remove this for-loop if you want the order of the pattern instead of an constant order
    for (let i = 0; i < 11; i++) {
      let newPartition = new Partition(i, 0);
      this.partitionObjects.push(newPartition);
    }

  }


  calculateAggregation(removedBlockColor){
    
    //container gets color of last block that is removed
    //this.container.style("background-color", removedBlockColor);

    //removed event is added to array of removed events
    this.removedEvent = getIdFromColor(removedBlockColor);
    //console.log(this.removedEvent + " dit is het het event, is dit 11?")
    //removed event is not added for the value 11, this is white space
    if(this.removedEvent === 11){
      return;
    }else{
      this.blockMemory.push(this.removedEvent);

      let existingPartition = this.partitionObjects.find(partition => partition.event === this.removedEvent)
  
      if(existingPartition){
        existingPartition.removedFrequency++;
      }else{
        let newPartition = new Partition(this.removedEvent, 1);
        this.partitionObjects.push(newPartition);
      };
  
      //console.log(this.partitionObjects);

    }
  }

  setDynamicStylingOfPartition(d3Partition) {
    // Here, we set the dynamic styling of the block based on the xpos of the block.
    // This gets called every tick to update how the block looks.
    return d3Partition
    .style("background-color", (partition) => getColorFromEvent(partition.event, this.anomalyColorArray))
    .style("border-radius", "4px")
      .style("width", (partition) =>
        partition.removedFrequency/this.blockMemory.length*200+'px'
      )
  }

  drawAggregation() {
    // This is a bit of d3 magic. We bind the data to the divs with class "block".
    // We also set the dynamic styling of the blocks.
    // The join() function is used to create, update, and remove blocks. In this:
    //  - The enter() function is used to create new blocks.
    //  - The update() function is used to update existing blocks.
    //  - The exit() function is used to remove blocks that are no longer needed.
    return this.container
      .selectAll("div")
      .data(this.partitionObjects, (d, i) => d.event)
      .join(
        (enter) =>
          this.setDynamicStylingOfPartition(
            enter
              .append("div")
              .style("opacity", "1")
              .style(
                "background-image",
                "linear-gradient(45deg, rgba(255,0,0,0), rgba(255,255,255,1) 150%)"
              )
              .style("height", "35px")
          ),
        (update) => this.setDynamicStylingOfPartition(update),
        (exit) => exit.remove()
      );
  }

}
