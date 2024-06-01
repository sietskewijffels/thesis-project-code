import colors from "../consts/parameters.js";

//8,9,10 are anomalies


function getColorFromEvent(event, anomalyColorArray) {

  if (anomalyColorArray == true){
    if (event == 8){
      return colors[8];
    }if (event == 9){
      return colors[9];
    }if (event == 10){
      return colors[10];
    }else{
      return colors[event];
    }
  }else if(anomalyColorArray == false){
    if (event == 8){
      return colors[0];
    }if (event == 9){
      return colors[1];
    }if (event == 10){
      return colors[2];
    }else{
      return colors[event];
    }
  }
}


// }

export default getColorFromEvent;


