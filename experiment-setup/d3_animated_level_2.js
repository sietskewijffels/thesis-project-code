import BlockSequence from "./components/BlockSequence.js";
import getAnomalies from "./utils/getAnomalies.js";

/*
 *  CONFIGURATION
 */

let rightwindowLength = 20;
let amountOfSequences = 12;
let amountOfSequencesFile = 12;
let leftwindowLength = 40;
let maxUpdateTickSeconds = 1.5;
let selectedDataset = "pilot_mixed_binned";
let differentAnomalyColorPerSequence = "true";
let visualizeAnomalies = "false";
let version = "version1";

// Check if query params exist and overwrite the default values
//const urlParams = new URLSearchParams(window.location.search);
// Assuming cookieSession is already parsed from the cookie as shown
const cookieSession = JSON.parse(document.cookie.split("=")[1]);
const urlParams = new URLSearchParams(window.location.search);

if (cookieSession.rightwindowLength !== undefined) {
  rightwindowLength = parseInt(cookieSession.rightwindowLength);
}
if (cookieSession.amountOfSequences !== undefined) {
  amountOfSequences = parseInt(cookieSession.amountOfSequences);
}
if (cookieSession.leftwindowLength !== undefined) {
  leftwindowLength = parseInt(cookieSession.leftwindowLength);
}
if (cookieSession.maxUpdateTickSeconds !== undefined) {
  maxUpdateTickSeconds = parseFloat(cookieSession.maxUpdateTickSeconds);
}
if (cookieSession.visualizeAnomalies !== undefined) {
  visualizeAnomalies = cookieSession.visualizeAnomalies;
}
if (urlParams.has("version")) {
  version = urlParams.get("version");
}
if (urlParams.has("dataset")) {
  selectedDataset = urlParams.get("dataset");
}

// Fill the from with the current values
// document.getElementById("rightwindowLength").value = rightwindowLength;
// document.getElementById("amountOfSequences").value = amountOfSequences;
// document.getElementById("leftwindowLength").value = leftwindowLength;
// document.getElementById("maxUpdateTickSeconds").value = maxUpdateTickSeconds;
// document.getElementById("selectedDataset").value = selectedDataset;
// document.getElementById("visualizeAnomalies").value = visualizeAnomalies;
// document.getElementById("version").value = version;

if (version == "version1" || version == "version3") {
  leftwindowLength = 0;
  rightwindowLength = 60;
}

if (selectedDataset == "dataset1") {
  selectedDataset = "pilot_mixed_binned_" + amountOfSequencesFile + "_1";
}

if (selectedDataset == "dataset2") {
  selectedDataset = "pilot_mixed_binned_" + amountOfSequencesFile + "_2";
}

if (selectedDataset == "dataset3") {
  selectedDataset = "pilot_mixed_binned_" + amountOfSequencesFile + "_3";
}

if (selectedDataset == "dataset4") {
  selectedDataset = "pilot_mixed_binned_" + amountOfSequencesFile + "_4";
}

let sequenceLength = leftwindowLength + rightwindowLength;

const container = d3.select("#block-sequences");

//takes last digit of dataset name which is amount of colors used
let patternColors = 2; //parseInt(selectedDataset.slice(-1), 10);

// get the "name" query parameter
let name = cookieSession.name;

// Load the data
d3.csv("./data/" + selectedDataset + ".csv").then((data) => {
  function dataParser(data) {
    return data.map((rec) => ({
      Event: rec.Event,
      Sequence: rec.Sequence,
      EventCat: rec.EventCat,
    }));
  }

  const dataParsed = dataParser(data);
  const sequences = [];
  //color of anomaly for this session
  let anomalyColorArray = false;
  if (visualizeAnomalies == "true") {
    anomalyColorArray = true;
  }

  // Initialize the sequences
  for (let i = 0; i < amountOfSequences; i++) {
    // Every sequence has a random update interval
    const updateInterval = maxUpdateTickSeconds * 1000;
    // Math.floor(Math.random() * maxUpdateTickSeconds * 1000) + 200;

    // Get all events for the current sequence
    const dataPerSequence = dataParsed.filter((d) => d.Sequence == i);

    // Create a d3 container for the sequence
    const sequenceContainer = container
      .append("div")
      .style("display", "flex")
      .style("overflow", "hidden")
      .style("margin-bottom", "0px");

    // Create a new sequence and push it to the sequences array
    const sequence = new BlockSequence(
      i,
      sequenceContainer.node(),
      sequenceLength,
      leftwindowLength,
      updateInterval,
      dataPerSequence,
      anomalyColorArray,
      version
    );

    sequences.push(sequence);
  }
});
