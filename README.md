# Master Thesis Project
This repository contains the code for the master thesis project "" by Sietske Wijffels.

## Structure

The repository is structured as follows:
- `/experiment-setup`: contains the code for the experiment
   - `/components`: contains the code for the components used in the experiment
    - `/consts`: contains the parameters used
    - `/data`: contains the data used
    - `/images`: contains supporting images that explain the setup
    - `/utils`: contains utility functions
- `/results-analysis`: contains the code for the results analysis


## How to run the experiment

The experiment can run standalone on a local machine using Live Server. It only uses HTML, CSS and JavaScript. To run the experiment, follow these steps:
- Make sure to have installed [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in Visual Studio Code
- Open the `index.html` file in the `/experiment-setup` folder and click on the "Go Live" button in the bottom right corner of the editor
- The experiment will open in a new browser window


During the experiment, the results were pushed to a backend service that is used to store the results of the experiment and the experiment was initiated using a unique participant ID. This ID determined the variant and order of the 4 runs of which the experiment consists. 

This backend service is commented out in the code, but can be examined. (See end.html row 36)