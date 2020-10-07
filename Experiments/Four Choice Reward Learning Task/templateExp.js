// Sample Javascript Experiment file for mturk experiments.

//------------------Initialize empty arrays to hold exp info--------------------
var timeline = []; // Holds trial screens
var dataMatrix = []; // Holds raw key presses
var choiceMatrix = []; // Holds the converted option numbers for each trial
var bonusRewardTotal = [];
var bestChoice = [];
var rewardMatrix = [];
var trialnum = 0;

// Smaple function to add objects
const add = (a, b) =>
  a + b


//-----------------------------Set up Info--------------------------------------
// Declare probabilities
const PrA = 0.65;
const PrB = 0.35;
const PrC = 0.75;
const PrD = 0.25;
var probMatrix = [PrA,PrB,PrC,PrD]
var orderMatrix = [1,2,3,4]; // Order of options, can be randomized with extra work

// Array to hold all of the stimuli pictures.
//Nested to include both the option and selected option for programming ease.
//Selected option created in paint so it can be called instead of programmed.
var stimArray = [
  ['static/stims/fractal1.jpg', 'static/stims/fractal1select.png'],
  ['static/stims/fractal2.jpg', 'static/stims/fractal2select.png'],
  ['static/stims/fractal3.jpg', 'static/stims/fractal3select.png'],
  ['static/stims/fractal4.jpg', 'static/stims/fractal4select.png'],
];

// randomize the four stimuli
var stims = jsPsych.randomization.shuffle(stimArray);
jsPsych.pluginAPI.preloadImages(stims); //load images in memory for speed.

// Move all option info into individual arrays.
// [stimulus image, probability, option name, CSS image placement, CSS text placement, keyboard key]
var stimMatrix = [
  [stims[0][0],probMatrix[0],'Option A','centered1','centeredText1','a'],
  [stims[1][0],probMatrix[1],'Option S','centered2','centeredText2','s'],
  [stims[2][0],probMatrix[2],'Option K','centered3','centeredText3','k'],
  [stims[3][0],probMatrix[3],'Option L','centered4','centeredText4','l']
];

// // Function to determine if arrays are equal. (swiped from stack exchange) - Uncomment if needed
// // Warn if overriding existing method --- Function to compare arrays
// if(Array.prototype.equals)
//     console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// // attach the .equals method to Array's prototype to call it on any array
// Array.prototype.equals = function (array) {
//     // if the other array is a falsy value, return
//     if (!array)
//         return false;
//
//     // compare lengths - can save a lot of time
//     if (this.length != array.length)
//         return false;
//
//     for (var i = 0, l=this.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (this[i] instanceof Array && array[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!this[i].equals(array[i]))
//                 return false;
//         }
//         else if (this[i] != array[i]) {
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             return false;
//         }
//     }
//     return true;
// }
// // Hide method from for-in loops
// Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// Create Random Trial Order
var ABtrial = Array(1).fill(1); //Creates an array of a certain length filled with a number/letter
var CDtrial = Array(1).fill(2);
var trialMatrix = ABtrial.concat(CDtrial); // Combines both arrays
var trials = [];
for (let i = 0; i < 8; i++) {
  var trainBlock = jsPsych.randomization.shuffle(trialMatrix); //loops through and concats shuffled arrays.
  trials = trials.concat(trainBlock)
}
console.log(trials)
var setOrder = [[0,1],[2,3]] // array that holds the options shown together


// ---------All functions - Allows for dynamic changes within javascript--------
// Called on each trial to determine what options are shown.
var getStim = function() {
  var stimuli = [stimMatrix[setOrder[trials[trialnum]-1][0]],stimMatrix[setOrder[trials[trialnum]-1][1]]] //Grabs the correct two stimuli based on the [trials] number

  var leftStim = [stimuli[0][0],stimuli[0][2],stimuli[0][3],stimuli[0][4]]
  var rightStim = [stimuli[1][0],stimuli[1][2],stimuli[1][3],stimuli[1][4]]
  return "<img class='"+leftStim[2]+"' src= '" + leftStim[0] + "'><div class='"+leftStim[3]+"'>" + leftStim[1] + "</div></img>"+ // Create screen with all graphics
  "<img class='"+rightStim[2]+"' src= '" + rightStim[0] + "'><div class='"+rightStim[3]+"'>" + rightStim[1] + "</div></img>"+
  "<div class = promptText><p>Please choose which option you think has the best chance of giving a point using the Option Letter key on your keyboard...</p></div>"
}

// Called on the trial screen to determine the correct keyboard keys for the trial
var getChoices = function() {
  var stimuli = [stimMatrix[setOrder[trials[trialnum]-1][0]],stimMatrix[setOrder[trials[trialnum]-1][1]]]
  var leftChoice = stimuli[0][5]
  var rightChoice = stimuli[1][5]
  return [leftChoice,rightChoice]
}

// function to figure reward receipt
var getReward = function(a) {
  randNum = Math.random();
  if (a == 65) {
    probVal = probMatrix[0];
  } else if (a == 83) {
    probVal = probMatrix[1];
  } else if (a == 75) {
    probVal = probMatrix[2];
  } else if (a == 76) {
    probVal = probMatrix[3];
  }
  if (probVal >= randNum) {
    return '1'
  } else if (probVal < randNum) {
    return '0'
  }
}

// function to figure reward receipt - just pushes a value to a bonus array
var getRewardBonus = function(a) {
  randNum = Math.random();
  if (a == 65) {
    probVal = probMatrix[0];
  } else if (a == 83) {
    probVal = probMatrix[1];
  } else if (a == 75) {
    probVal = probMatrix[2];
  } else if (a == 76) {
    probVal = probMatrix[3];
  }
  totalProbMatrix.push(probVal)
  if (probVal >= randNum) {
    rewardMatrix.push(1)
    //bonusRewardTotal.push(.05)
    bonusRewardTotal = bonusRewardTotal + .05;
    rewardMatrix.push(1)
    return '1'
  } else if (probVal < randNum) {
    rewardMatrix.push(0)
    rewardMatrix.push(0)
    return '0'
  }
}

// Function to show proper feedback screen with reward shown
var getRewardFeedback = function() {
  var testMat = dataMatrix[dataMatrix.length - 1] // Gets the keycode for choice
  var reward = getReward(testMat) // Sends the keycode to the previous funciton to determine reward
  var rewardBox = '';
  if (reward == '0') {
    rewardBox = 'static/stims/whiteBlock0.png'; // white square with reward total.
  } else if (reward == '1') {
    rewardBox = 'static/stims/whiteBlock1.png';
  }
  if (testMat == 65) { // if statement to convert keycode to option number for data analysis and create image screen for feedback
    choiceMatrix.push(orderMatrix[0]);
    return "<img class='centered1' src= '" + rewardBox + "'><div class='centeredText1'>Option A</div></img>"
  } else if (testMat == 83) {
    choiceMatrix.push(orderMatrix[1]);
    return "<img class=centered2 src= '" + rewardBox + "'><div class='centeredText2'>Option S</div></img>"
  } else if (testMat == 75) {
    choiceMatrix.push(orderMatrix[2]);
    return "<img class='centered3' src= '" + rewardBox + "'><div class='centeredText3'>Option K</div></img>"
  } else if (testMat == 76) {
    choiceMatrix.push(orderMatrix[3]);
    return "<img class=centered4 src= '" + rewardBox + "'><div class='centeredText4'>Option L</div></img>"
  } else {
    return 'ERROR' // just in case
  }
}

// Function to show proper feedback screen without reward but with selection box
var getFeedback = function() {
  var testMat = dataMatrix[dataMatrix.length - 1]
  var reward = getRewardBonus(testMat)
  if (testMat == 65) {
    choiceMatrix.push(orderMatrix[0]);
    return "<img class='centered1' src= '" + stims[0][1] + "'><div class='centeredText1'>Option A</div></img>"
  } else if (testMat == 83) {
    choiceMatrix.push(orderMatrix[1]);
    return "<img class=centered2 src= '" + stims[1][1] + "'><div class='centeredText2'>Option S</div></img>"
  } else if (testMat == 75) {
    choiceMatrix.push(orderMatrix[2]);
    return "<img class='centered3' src= '" + stims[2][1] + "'><div class='centeredText3'>Option K</div></img>"
  } else if (testMat == 76) {
    choiceMatrix.push(orderMatrix[3]);
    return "<img class=centered4 src= '" + stims[3][1] + "'><div class='centeredText4'>Option L</div></img>"
  } else {
    return 'ERROR'
  }
}

// funciton used to figure if best choice was chose, and save local data if needed
var getDataVal = function() {
  var bestChoice = 0 //Below checks to see if the probability of the option chose is the highest.
  if (stimMatrix[orderMatrix[choiceMatrix[choiceMatrix.length - 1]-1]-1][1] == Math.max(stimMatrix[setOrder[trials[trialnum]-1][0]][1],stimMatrix[setOrder[trials[trialnum]-1][1]][1])) {
    bestChoice = 1
  } else {
    bestChoice = 0
  }
  trialnum = trialnum + 1
  return { //Save all of the trial data in a object based format to be used in saving the data later
    reward: rewardMatrix[rewardMatrix.length - 1],
    bestOption: bestChoice,
    keyResponse: choiceMatrix[choiceMatrix.length - 1],
    setSeen: setOrder[trials[trialnum-2]-1],
    probValue: stimMatrix[[choiceMatrix[choiceMatrix.length - 1]-1]][1],
  }
}

// Figures bonus amount if bonus trials were seen.
var sumPoint = function(arr) {
  bonusReward = bonusRewardTotal//.reduce(add);
  finalReward = bonusReward.toString();
  //psiturk.recordTrialData(['FinalRewardTotal',finalReward])
  return "<div>You have completed the experiment! Thank you for your time.</div><div> </div><div>Your Bonus is:   $" + finalReward +"</div>"
    "<p>Please press any key to continue</p></div>"
}

// ITI trial
var trialSave = function() {
  return "<div>Please wait for the next trial...</div>"
}


// ---------------All Trial Screens, in order seen (sort of)------------------------------------
// Questionnaires and Demographics
// Most questionnaires use the same format. Below are a few sample ones.
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to our experiment. Press any key to begin.",
  data: {
    Save_Data: 'NoSave'
  }
};

var ageScreen = {
  type: 'survey-text',
  data: {
    Save_Data: 'Save'
  },
  questions: [{
    prompt: "Please type your age in the box",
    rows: 1,
    columns: 5
  }],
  on_finish: function(data){
  }
}

var GenderQ = ["Male", "Female", "Prefer not to respond"];
var EthnicityQ = ["Not Hispanic or Latino", "Hispanic or Latino", "Prefer not to answer"];
var RaceQ = ["American Indian or Alaskan Native", "Asian", "Native Hawaiin or Other Pacific Islander", "Black or African American", "White", "More than one Race", "Prefer not to answer"];
var demographicScreen = {
  type: 'survey-multi-choice',
  data: {
    Save_Data: 'Save'
  },
  questions: [{
      prompt: "Please select your gender",
      options: GenderQ,
      required: true
    },
    {
      prompt: "Please select your ethnicity",
      options: EthnicityQ,
      required: true
    },
    {
      prompt: "Please select your race",
      options: RaceQ,
      required: true
    }
  ],
};

var PoliticalQ = ["Extremely Liberal", "|", "Moderately Liberal", "|", "Neutral or Independent", "|", "Moderately Conservative", "|", "Extremely Conservative"];
var politicalScreen = {
  type: 'survey-likert',
  data: {
    Save_Data: 'Save'
  },
  questions: [{
    prompt: "Please rate how conservative or liberal you lean ",
    labels: PoliticalQ
  }],
};

// Instruction screens. Similar to the questionnaire format, but with a single response to continue
var trainingIntro = {
  type: "html-keyboard-response",
  stimulus: "<p>Welcome to our experiment.</p>" +
    "<p>In this task, you will be shown four options to choose from.</p><p>However, only two of the possible combinations of the " +
    "four options will be shown at any given time.</p>" +
    "Please read the labels for each option on each trial carefully to make " +
    "your choice about which option you think is the most rewarding.</p>" +
    "<p>Press any key to begin.</p>",
  data: {
    Save_Data: 'NoSave'
  },
  post_trial_gap: 1000
};

// Individual trial screens. Calls the previously written functions.
var trialScreen = {
  type: 'html-keyboard-response',
  data: {
    Save_Data: 'NoSave'
  },
  stimulus: getStim,
  choices: getChoices,
  post_trial_gap: 0, // self explanatory, there are other options
  on_finish: function(data) {
    var keyPressed = data.key_press;
    dataMatrix.push(keyPressed);
  }
};


// Feedback trial screens
var RewardFeed = {
  type: 'html-keyboard-response',
  stimulus: getRewardFeedback,
  data: getDataVal,
  trial_duration: 750,
  post_trial_gap: 0,
  response_ends_trial: false
}
var Feedback = {
  type: 'html-keyboard-response',
  stimulus: getFeedback,
  data: getDataVal,
  trial_duration: 750,
  post_trial_gap: 0,
  response_ends_trial: false
}


// Transfer Trial instructions
var TransferIntro = {
  type: 'html-keyboard-response',
  stimulus: "<p>You've been selected to take part in a bonus round of the experiment!</p>" +
    "<p>In this phase, you will again be shown four options to choose from.</p><p>However, this time, " +
    "the four options will be paired differently.</p>" +
    "Please read the labels for each option on each trial carefully to make " +
    "your choice about which option you think is the most rewarding.</p>" +
    "<p></p>" +
    "<p>In addition, the points received from your choices will no longer be shown, but the points will still be tracked in the background.</p>" +
    "<p>For each point you earn in this phase, you will accrue a bonus $0.05. </p>" +
    "<p></p>" +
    "<p>Press any key to begin.</p>",
  data: {
    Save_Data: 'NoSave'
  }
}

// Final survey to assess participant knowledge
var finalSurvey = {
  type: 'survey-text',
  questions: [{
    prompt: "Briefly, please describe what you think you did during this experiment.",
    rows: 5,
    columns: 40
  }],
  data: {
    Save_Data: 'Save'
  },
}

// Signal end of the experiment
var ExpEnd = {
  type: 'html-keyboard-response',
  stimulus: sumPoint, //"The Experiment is now over... Your Bonus is  When testing, press any button to show the data..."
  data: {
    Save_Data: 'Save'
  }
}
// End if a criterion isnt reached
var ExpEndCritNot = {
  type: "html-keyboard-response",
  stimulus: "<p>Thank you for your time in completing this experiment. Over the course of this experiment you have repeatedly chose " +
  "between multiple options. Each of these option pairings had a different probability of giving one point, and some options " +
  "gave points more frequently than other options. In the experiment today, we were wanting to see how differing frequencies " +
  "of reward influence their choices. All HITs will normally be approved by the end of every workday. Once again, thank you for your time.</p>" +
  "<p></p>" +
  "<p>Please press any key to continue</p>",
  data: {
    Save_Data: 'NoSave'
  }
};

var saveData = {
  type: 'html-keyboard-response',
  stimulus: trialSave,
  data: {
    Save_Data: 'NoSave'
  },
  trial_duration: 500,
  post_trial_gap: 0,
  response_ends_trial: false
}

bonusTimeline = []
noBonusTimeline = []

// Bonus timeline trials
bonusTimeline.push(TransferIntro); // Transer trials
//for (let i = 0; i < 100; i++) {
  for (let i = 0; i < 10; i++) {
    bonusTimeline.push(trialScreen);
    bonusTimeline.push(Feedback);
    bonusTimeline.push(saveData);
}
bonusTimeline.push(finalSurvey);
bonusTimeline.push(ExpEnd);

// No bonus trials. When criterion is not reached.
noBonusTimeline.push(finalSurvey);
noBonusTimeline.push(ExpEndCritNot);



// Conditional trial function. Used to branch trials, or end the exp early.
var bonusTrials = {
  timeline: bonusTimeline,
  conditional_function: function() {
    var Val1= .6 // Should add a fucntion here that assesses the conditional requirements
    var Val2 = .6
    if (Val1 >= .55 && Val1 >= .55) {
      return true;
    } else {
      return false;
    }
  }
}

// Two screens that are shown if criterion is not reached.
var notBonusTrials = {
  timeline: [noBonusTimeline[0], noBonusTimeline[1]],
  conditional_function: function() {
    var Val1= .6 // Same as above, but the other branch
    var Val2 = .6
    if (Val1 >= .55 && Val1 >= .55) {
      return false;
    } else {
      return true;
    }
  }
}

// Below starts to add everything to the timeline. Add to it in the order trials should be shown.
// // Forces fullscreen.
// timeline.push({
//   type: 'fullscreen',
//   fullscreen_mode: true
// });
// timeline.push(welcome);
// timeline.push(ageScreen);
// timeline.push(demographicScreen);
// timeline.push(politicalScreen);
// Individual Trial Loops
timeline.push(trainingIntro);
for (let i = 0; i < 10; i++) {
  timeline.push(trialScreen); // Shows trial, then feedback
  timeline.push(RewardFeed);
  timeline.push(saveData);
}

// Preloads both criterion instances and skips the correct one.
timeline.push(bonusTrials);
timeline.push(notBonusTrials);
