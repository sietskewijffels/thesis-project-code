export default class Block {
  constructor(
    id,
    color,
    initial_xpos,
    anomalyDetected,
    colorID,
    blockSequenceRef,
    eventCat,
    initialTime,
    detectiontime
  ) {
    this.id = id;
    this.color = color;
    this.xpos = initial_xpos;
    this.anomalyDetected = anomalyDetected;
    this.colorID = colorID;
    this.blockSequenceRef = blockSequenceRef;
    this.eventCat = eventCat;
    this.initialTime = initialTime;
    this.detectionTime = detectiontime; 
  }

  markAsAnomaly(anomaly, mode = "click") {
    this.anomalyDetected = anomaly;
    this.detectionMode = mode;
  }
}
