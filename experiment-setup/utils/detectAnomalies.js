import calculatePercentages from './calculatePercentages.js';

function detectAnomalies(prevMemory, currentMemory, threshold, newBlockCat) {
    // Calculate percentages of each category
    const prevPercentages = calculatePercentages(prevMemory);
    const currentPercentages = calculatePercentages(currentMemory);

    // console.log(calculatePercentages(Memory));

    // Compare percentages and check for anomalies
    if (currentMemory[newBlockCat] == prevMemory[newBlockCat]) {
        //console.log("No anomaly! --> currentMemory == prevMemory");
        return false;
    }
    if (prevMemory[newBlockCat] == undefined && currentMemory[newBlockCat] > 0) {
        //console.log("Anomaly detected! --> undifined prevMemory");
        return true;

    }if (currentMemory[newBlockCat] == undefined && prevMemory[newBlockCat] > 0) {
        //console.log("No anomaly! --> undifined currentMemory");
        return false;
    }

    // if ((Math.abs((prevMemory[newBlockCat] - currentMemory[newBlockCat]) / 
    // currentMemory[newBlockCat])*100) > threshold) {
    //     //console.log("Anomaly detected! --> threshold");
    //     return true;
    //     }

    //bovenstaande is met frequency en een change percentage ten opzichte van de threshold.
    //console.log("Default return! --> default return");
    return false;
  }
  
  // 
  export default detectAnomalies;