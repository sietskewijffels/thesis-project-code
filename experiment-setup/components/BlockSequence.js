import getColorFromEvent from "../utils/getColorFromEvent.js";
import getIDformColor from "../utils/getIDfromColor.js";
import Block from "./Block.js";
import Aggregation from "./Aggregation.js";
import getAnomalies from "../utils/getAnomalies.js";
import windowAdjustment from "../utils/windowAdjustment.js";
import freqWindow from "../utils/freqWindow.js";
import detectAnomalies from "../utils/detectAnomalies.js";
import calculatePercentages from "../utils/calculatePercentages.js";
import windowIdFinder from "../utils/windowIdFinder.js";
import windowSizeFinder from "../utils/windowSizeFinder.js";

/**
 * BlockSequence
 * @param {HTMLElement} container - The container element to draw the sequence in
 * @param {number} initialBlocks - The initial amount of blocks in the sequence
 * @param {number} leftwindowLength - The length of the left window
 * @param {number} updateInterval - The interval in ms to update the sequence
 * @param {Array} dataSeq - The data to use for the sequence
 */

// Waarom zijn die functies in de class gedefinieerd en niet er buiten?

export default class BlockSequence {
  constructor(
    id,
    seqContainer,
    initialBlocks,
    leftwindowLength,
    updateInterval,
    dataSeq,
    anomalyColorArray,
    version
  ) {
    this.removedBlockColor = "rgb(127,201,127)";
    this.anomalyColorArray = anomalyColorArray;
    this.version = version;

    if (this.version == "version2" || this.version == "version4") {
      this.aggregatedDiv = new Aggregation(
        seqContainer,
        this.removedBlockColor,
        this.anomalyColorArray
      );
    }

    this.id = id;
    this.container = d3
      .select(seqContainer)
      .append("div")
      .style("width", "calc(1730px)") // Adjust the width to accommodate the fraction bar
      .style("height", "100%")
      .style("overflow", "hidden")
      .style("display", "flex")
      .style("position", "relative"); // Set the position of the main sequence as relative
    this.blocks = [];
    this.initialBlockWindow = [];
    this.eventIdInWindow = [];
    this.windowLength = 10; //even om te testen (want langste patroon is 20)
    this.threshold = 50; //ook om te testen
    this.anomalyArray = [];
    this.blockCounter = initialBlocks;
    this.sequenceLength = initialBlocks;
    this.leftwindowLength = leftwindowLength;
    this.updateInterval = updateInterval;
    this.updatingActive = true;
    this.lastIdEventColorId = { 0: 0, 1: 0, 2: 0 };
    this.eventIdPerColor = { 0: [], 1: [], 2: [] };
    this.eventArray = [];

    // Push initial blocks to the sequence

    for (let i = 0; i < initialBlocks; i++) {
      let event = dataSeq[i];
      let color = getColorFromEvent(event["EventCat"], this.anomalyColorArray);
      let colorID = getIDformColor(color);
      let newBlock = new Block(
        i,
        color,
        i,
        false,
        colorID,
        this,
        event["EventCat"],
        new Date(),
        new Date()
      );
      this.blocks.push(newBlock);
      if (colorID != 11) {
        //hier moet de whitespace kleur in
        this.lastIdEventColorId[newBlock.colorID] = newBlock.id;
        this.initialBlockWindow.push(newBlock);
        this.eventIdPerColor[newBlock.colorID].push(newBlock.id);
        this.eventArray.push(newBlock);
      }
    }
    this.drawSequence();
    this.initSequenceUpdater(dataSeq);
    this.blockWindow = windowAdjustment(
      this.initialBlockWindow,
      this.windowLength
    );
    this.eventIdInWindow = this.blockWindow.map((block) => block.id);
  }

  blockInWindow(block) {
    return this.eventIdInWindow.includes(block.id);
  }

  /**
   * setDynamicStylingOfBlock
   */
  setDynamicStylingOfBlock(d3Block) {
    // Here, we set the dynamic styling of the block based on the xpos of the block.
    // This gets called every tick to update how the block looks.

    return d3Block
      //dit eruit commenten bij echt testen
      // .style("opacity", (block) =>
      // this.eventIdInWindow.includes(block.id) ? "0.5" : "1")
      .transition()
      .duration(this.updateInterval)
      .ease(d3.easeLinear)

      .style("width", (block) =>
        block.xpos > this.leftwindowLength - 1
          ? "27px"
          : block.xpos == 0
            ? "0px"
            : "6px"
      )
      .style("margin-right", (block) =>
        block.xpos == this.leftwindowLength - 1 ? "3px" : "0px"
      )
      .style("border", (block) =>
        block.anomalyDetected == true
          ? block.detectionMode == "click"
            ? "1px solid blue"
            : "1px solid red"
          : ""
      );
  }

  /**
   * drawSequence
   */
  drawSequence() {
    // This is a bit of d3 magic. We bind the data to the divs with class "block".
    // We also set the dynamic styling of the blocks.
    // The join() function is used to create, update, and remove blocks. In this:
    //  - The enter() function is used to create new blocks.
    //  - The update() function is used to update existing blocks.
    //  - The exit() function is used to remove blocks that are no longer needed.

    return this.container
      .selectAll("div")
      .data(this.blocks, (d, i) => d.id)
      .join(
        (enter) =>
          this.setDynamicStylingOfBlock(
            enter
              .append("div")
              .style("opacity", "1")
              .style("border-radius", "4px")
              .style("background-color", (block) => block.color)
              .style("background-image", (block) =>
                block.colorID == 11
                  ? ""
                  : "linear-gradient(45deg, rgba(255,0,0,0), rgba(255,255,255,1) 150%)"
              )
              .style("height", "35px")
              .style("-webkit-transform", "translateZ(0)")
              .style("-moz-transform", "translateZ(0)")
              .style("-ms-transform", "translateZ(0)")
              .style("-o-transform", "translateZ(0)")
              .style("transform", "translateZ(0)")
              .style("width", "0px")
              .on("mousedown", function (event, block) {
                // Prevent the default right click menu
                event.preventDefault();

                if (!block.blockSequenceRef.updatingActive) {
                  alert(
                    "You can't interact with the blocks anymore. Proceed to the next step."
                  );
                  return;
                }

                // if left mouse button is clicked, trigger the click event
                if (event.button == 0) {
                  // Left click event
                  if (block.colorID == 11) {
                    //console.log("whitespace block");
                    return;
                  }
                  let localBlockSequence = block.blockSequenceRef;
                  let oldWindowLength = localBlockSequence.windowLength;
                  if (block.anomalyDetected == true) {
                    d3.select(this)
                      .transition()
                      .style("border", "1px solid blue");
                    block.markAsAnomaly(true, "click");
                    // localBlockSequence.windowLength = Math.ceil(
                    //   localBlockSequence.windowLength * 2
                    // );
                    console.log({
                      sequenceID: localBlockSequence.id,
                      source: "user",
                      event: "confirmAnomaly",
                      block: {
                        id: block.id,
                        xpos: block.xpos,
                        colorID: block.colorID,
                        eventCat: block.eventCat,
                        inititialTime: block.initialTime,
                        detectionTime: new Date(),
                      },
                      windowLength: localBlockSequence.windowLength,
                      oldWindowLength: oldWindowLength,
                    });
                  } else {
                    d3.select(this)
                      .transition()
                      .style("border", "1px solid blue");
                    block.markAsAnomaly(true, "click");

                    // if (localBlockSequence.windowLength > 1) {
                    //   localBlockSequence.windowLength = Math.ceil(
                    //     localBlockSequence.windowLength / 2
                    //   );
                    // }

                    // console.log(localBlockSequence.eventIdPerColor)
                    // localBlockSequence.windowLength = windowIdFinder(localBlockSequence.eventIdPerColor, block)
                    // console.log("array" + localBlockSequence.eventArray)
                    // console.log("block" + block)

                    //false for decreasing frame
                    localBlockSequence.windowLength = windowSizeFinder(localBlockSequence.eventArray, block, false)
                    //console.log("windowlentgh: " + localBlockSequence.windowLength)

                    console.log({
                      sequenceID: localBlockSequence.id,
                      source: "user",
                      event: "markAsAnomaly",
                      block: {
                        id: block.id,
                        xpos: block.xpos,
                        colorID: block.colorID,
                        eventCat: block.eventCat,
                        inititialTime: block.initialTime,
                        detectionTime: new Date(),
                      },
                      windowLength: localBlockSequence.windowLength,
                      oldWindowLength: oldWindowLength,
                    });
                  }
                }
                // if right mouse button is clicked, trigger the contextmenu event
                if (event.button == 2) {
                  // Right click event
                  if (block.colorID == 11) {
                    //console.log("whitespace block");
                    return;
                  }
                  let localBlockSequence = block.blockSequenceRef;
                  let oldWindowLength = localBlockSequence.windowLength;
                  if (block.anomalyDetected == true) {
                    d3.select(this).transition().style("border", "");
                    block.markAsAnomaly(false, "click"); // mark as not anomaly (right click)
                    // localBlockSequence.windowLength = Math.ceil(
                    //   localBlockSequence.windowLength * 2
                    // );

                    // console.log("array" + localBlockSequence.eventArray)
                    // console.log("block" + block)

                    //true for increasing frame
                    localBlockSequence.windowLength = windowSizeFinder(localBlockSequence.eventArray, block, true)
                    // console.log("windowlentgh: " + localBlockSequence.windowLength)

                    console.log({
                      sequenceID: localBlockSequence.id,
                      source: "user",
                      event: "unmarkAnomaly",
                      block: {
                        id: block.id,
                        xpos: block.xpos,
                        colorID: block.colorID,
                        eventCat: block.eventCat,
                        inititialTime: block.initialTime,
                        detectionTime: new Date(),
                      },
                      windowLength: localBlockSequence.windowLength,
                      oldWindowLength: oldWindowLength,
                    });
                  } else {
                    d3.select(this).transition().style("border", "");
                  }
                }
              })
              .on("mouseover", function (event, block) {
                d3.select(this).transition().style("background-image", "");
              })

              .on("mouseout", function () {
                d3.select(this)
                  .transition()
                  .style(
                    "background-image",
                    "linear-gradient(45deg, rgba(255,0,0,0), rgba(255,255,255,1) 150%)"
                  );
              })
          ),
        (update) => this.setDynamicStylingOfBlock(update),
        (exit) =>
          exit
            .transition()
            .duration(this.updateInterval)
            .ease(d3.easeLinear)
            .style("border", "")
            .style("width", "0px")
            .remove()
      );
  }

  /**
   * initSequenceUpdater
   */
  initSequenceUpdater(dataSeq) {
    const intervalId = setInterval(() => {
      if (this.blockCounter >= dataSeq.length) {
        // Stop updating when the blockCounter exceeds the length of dataSeq
        clearInterval(intervalId);
        // After 10 seconds, remove the 'hidden' class from the DOM element 'change-settings'
        setTimeout(() => {
          this.updatingActive = false;
          d3.select("#change-settings").classed("hidden", false);
        }, 6000);
        return;
      }

      // creating a new block
      const event = dataSeq[this.blockCounter];
      const newColor = getColorFromEvent(
        event["EventCat"],
        this.anomalyColorArray
      );
      const colorID = getIDformColor(newColor);
      const newBlock = new Block(
        this.blockCounter,
        newColor,
        this.sequenceLength,
        false,
        colorID,
        this,
        event["EventCat"],
        new Date(),
        new Date()
      );

      // increment block counter
      this.blockCounter++;

      // preparing the blockWindow for the anomaly detection
      this.blockWindow = windowAdjustment(this.blockWindow, this.windowLength);
      let prevMemory = freqWindow(this.blockWindow);
      this.eventIdInWindow = this.blockWindow.map((block) => block.id);
      if (colorID != 11) {
        //hier moet de whitespace kleur in
        this.lastIdEventColorId[newBlock.colorID] = newBlock.id;
        this.blockWindow.push(newBlock);
        this.eventIdPerColor[newBlock.colorID].push(newBlock.id);
        this.eventArray.push(newBlock);
      }
      this.blockWindow = windowAdjustment(this.blockWindow, this.windowLength);
      let currentMemory = freqWindow(this.blockWindow);
      this.eventIdInWindow = this.blockWindow.map((block) => block.id);

      // detecting anomalies
      if (this.version == "version3" || this.version == "version4") {
        let isAnomaly = detectAnomalies(
          prevMemory,
          currentMemory,
          this.threshold,
          newBlock.colorID
        );
        if (isAnomaly) {
          console.log({
            sequenceID: this.id,
            source: "detector",
            event: "anomalyDetected",
            block: {
              id: newBlock.id,
              xpos: newBlock.xpos,
              colorID: newBlock.colorID,
              eventCat: newBlock.eventCat,
              inititialTime: newBlock.initialTime,
              detectionTime: new Date(),
            },
            windowLength: this.windowLength,
          });
        }
        newBlock.markAsAnomaly(isAnomaly, "detector");
      }

      if (newBlock.eventCat == 9 || newBlock.eventCat == 10) {
        console.log({
          sequenceID: this.id,
          source: "trueAnomaly",
          event: "anomaly",
          block: {
            id: newBlock.id,
            xpos: newBlock.xpos,
            colorID: newBlock.colorID,
            eventCat: newBlock.eventCat,
            inititialTime: newBlock.initialTime,
            detectionTime: new Date(),
          },
        });
      }

      // Add the new block to the sequence
      this.blocks.push(newBlock);

      // Decrement xpos of all blocks, so when the blocks move to the left, they get the xpos that corresponds to their position.
      this.blocks = this.blocks.map((block) => {
        block.xpos--;
        return block;
      });
      this.removedBlockColor = this.blocks[0].color;

      // Remove the first block from blocks array
      this.blocks.shift();

      // Redraw the sequence (d3 only updates the Blocks that changed)
      this.drawSequence();
      //make aggregation
      if (this.version == "version2" || this.version == "version4") {
        this.aggregatedDiv.calculateAggregation(this.removedBlockColor);
        this.aggregatedDiv.drawAggregation();
      }
    }, this.updateInterval);
  }
}
