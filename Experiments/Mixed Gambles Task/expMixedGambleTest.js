// Matrices to hold experiment data
var timeline = []; // Will hold the trial order
var dataMatrix = []; // Holds javascript key press numbers to determine what option was choose in the previous trial

var rewardMatrix = [];
var gainMatrix = []; // Holds the reward value for each trial
var lossMatrix = [];
var choiceMatrix = []; // Holds the converted option numbers for each trial
var bestMatrix = []; // 1 and 0 for best choice made on each trial\
var binChoice = [];

var choiceSeen = 0
var trialnum = 0;
var rewardTotal = 0;
var rejectTally = 0;
var goalValue = 2400;

var feedTime = 1500
var trialLength = 3000
var ITI = 750
var stagChoice = 0.5

var nTrials = 256
var nOptions = 4

var mgBonus = 0

var bonusRewardTotal = [];
var nextFeed = '';
var reaction = [];

var totalPoints = 0;
var deckCount = [0,0];
const add = (a, b) =>
  a + b // function to add and compute AB and CD best options for criterion
const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

//changeCSS('static/css/jspsychMixedGambles.css', 0)

// create array of gain and loss values.
var gains = []
for (let i = 10; i < 101; i+=10) {
  gains = gains.concat(i)
}
var losses = []
for (let i = 5; i < 51; i+=5) {
  losses = losses.concat(i)
}

console.log(gains)
console.log(losses)

// permutation of gain and loss arrays
var comb = Combinatorics.cartesianProduct(gains,losses);
var combArray = comb.toArray()
var valArray = jsPsych.randomization.shuffle(combArray);

console.log(valArray.length)

//-----------------------------Set up Info--------------------------------------





// ---------All functions - Allows for dynamic changes within javascript------
// Function to retrieve the correct stimulus and text
var getStim = function() {
  var gainVal = valArray[trialnum][0]
  var lossVal = valArray[trialnum][1]
  gainMatrix.push(gainVal)
  lossMatrix.push(lossVal)
  var rnd = Math.random()
  if (rnd <= .5){
    var topVal = "50% -> <span style='color:green'>+$"+gainVal+"</span>"
    var bottomVal = "50% -> <span style='color:red'>-$"+lossVal+"</span>"
  } else {
    var topVal = "50% -> <span style='color:red'>-$"+lossVal+"</span>"
    var bottomVal = "50% -> <span style='color:green'>+$"+gainVal+"</span>"
  }
  var bankValue = totalPoints.toString();
  return "<div id = 'box1'><div id = 'letter1'>C</div></div><div id='centeredText1'>Reject</div>"+
  "<div id = 'box2'><div id = 'letter2'>M</div></div><div id ='centeredText2'>Accept</div>"+
  "<div id = 'circle'><div id = 'horzLine'></div><div id = 'topPoint'>"+topVal+"</div><div id ='bottomPoint'>"+bottomVal+"</div></div>"+
  "<div id = 'promptText'><p>Do you Accept or Reject this gamble?</p><p>Press the associated letter key.</p></div>"+
  "<div id = 'bankPos'>Total Points: "+totalPoints+"</div>"
}

// function specifically for making the below animation wait a bit.
function wait(ms) {
  var d = new Date();
  var d2 = null;
  do { d2 = new Date(); }
  while(d2-d < ms);
}


// function to figure reward receipt
var getReward = function(a) {
  var trialReward = 0
  var randnum = Math.random()
  console.log(randnum)
  if (a == 77) {
    binChoice.push(1)
    if (randnum > .5){
      trialReward = gainMatrix[gainMatrix.length-1]
    } else {
      trialReward = -1*(lossMatrix[lossMatrix.length-1])
    }
    rejectTally = 0
  } else if (a == 67) {
    binChoice.push(2)
    trialReward = 0
    rejectTally = 1
  } else if (a == null){
    binChoice.push(0)
    trialReward = 0
    rejectTally = 5
  }

  rewardMatrix.push(trialReward)
  totalPoints = totalPoints + trialReward

  return trialReward.toString();

}


// Function to show proper feedback screen with reward shown
var getRewardFeedback = function() {
  var testMat = dataMatrix[dataMatrix.length - 1]
  var reward = getReward(testMat)

  var gainColor = 'green'
  if (reward <= 0){
    var gainColor = 'red'
  }

  if (testMat == 67) {
    choiceMatrix.push(1);
    return "<div id = 'feedText'>You rejected the gamble.</div><div id = 'box1chose'><div id = 'letter1'>C</div></div><div id='centeredText1'>Reject</div>"
  } else if (testMat == 77) {
    choiceMatrix.push(2);
    return "<div id = 'feedText'>Gamble Outcome: <span style='color:"+gainColor+"'>"+reward+"</span></div><div id = 'box2chose'><div id = 'letter2'>M</div></div><div id='centeredText2'>Accept</div>"
  } else if (testMat == null) {
    choiceMatrix.push(0)
    return 'Too Slow. Please respond faster' // just in case
  }
}



// funciton used to figure if best choice was chose, and save local data if needed
var getDataVal = function() {
  trialnum = trialnum+1
  return {
    rewardGain: gainMatrix[gainMatrix.length - 1],
    rewardLoss: lossMatrix[lossMatrix.length - 1],
    keyResponse: choiceMatrix[choiceMatrix.length - 1],
    total: totalPoints,
    react: reaction[reaction.length-1],
    binChoice: binChoice[binChoice.length-1],
    rejectNum: rejectTally,
    netGain: rewardMatrix[rewardMatrix.length-1],
    Save_Data: 'Save'
  }
}




// // Figures bonus amount if bonus trials were seen.
var sumPoint = function() {
  var bonusTotal = totalPoints/1000
  mgBonus = bonusTotal
  var finalReward = bonusTotal.toFixed(2);
  return "<p>You have completed the task! Well done!</p><p>Your total bonus amount earned is: $" + finalReward + "</p>"
}

// Saves each trial data to the SQL database
var trialSave = function() {
  // if (dataMatrix.length > 150) {
  //   phaseData = 'Test'
  // } else {
  //   phaseData = 'Train'
  // }
  //psiturk.recordTrialData([phaseData, optShownMat[trialnum-1], choiceMatrix[choiceMatrix.length - 1], rewardMatrix[rewardMatrix.length - 1], totalProbMatrix[totalProbMatrix.length - 1], bestMatrix[bestMatrix.length - 1]])
  return "<div>Please wait for the next trial...</div>"
}
var getTotal = function() {
  // if (dataMatrix.length > 150) {
  //   phaseData = 'Test'
  // } else {
  //   phaseData = 'Train'
  // }
  var finTotal = mgBonus
  //psiturk.recordTrialData([phaseData, optShownMat[trialnum-1], choiceMatrix[choiceMatrix.length - 1], rewardMatrix[rewardMatrix.length - 1], totalProbMatrix[totalProbMatrix.length - 1], bestMatrix[bestMatrix.length - 1]])
  return {
    MGFinal:finTotal
  }
}


// ---------------All Trial Screens, in order seen (sort of)------------------------------------
// Questionnaires and Demographics
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to our experiment. Press any key to begin.",
  data: {
    Save_Data: 'NoSave'
  }
};

// var ageScreen = {
//   type: 'survey-text',
//   data: {
//     Save_Data: 'Save'
//   },
//   questions: [{
//     prompt: "Please type your age in the box",
//     rows: 1,
//     columns: 5
//   }],
//   on_finish: function(data){
//     //psiturk.recordTrialData(data.responses)
//   }
// }

// var GenderQ = ["Male", "Female", "Prefer not to respond"];
// var EthnicityQ = ["Not Hispanic or Latino", "Hispanic or Latino", "Prefer not to answer"];
// var RaceQ = ["American Indian or Alaskan Native", "Asian", "Native Hawaiin or Other Pacific Islander", "Black or African American", "White", "More than one Race", "Prefer not to answer"];
// var demographicScreen = {
//   type: 'survey-multi-choice',
//   data: {
//     Save_Data: 'Save'
//   },
//   questions: [{
//       prompt: "Please select your gender",
//       options: GenderQ,
//       required: true
//     },
//     {
//       prompt: "Please select your ethnicity",
//       options: EthnicityQ,
//       required: true
//     },
//     {
//       prompt: "Please select your race",
//       options: RaceQ,
//       required: true
//     }
//   ],
// };
//
// var PoliticalQ = ["Extremely Liberal", "|", "Moderately Liberal", "|", "Neutral or Independent", "|", "Moderately Conservative", "|", "Extremely Conservative"];
// var politicalScreen = {
//   type: 'survey-likert',
//   data: {
//     Save_Data: 'Save'
//   },
//   questions: [{
//     prompt: "Please rate how conservative or liberal you lean ",
//     labels: PoliticalQ
//   }],
// };

var trainingIntro1 = {
  type: "html-button-response",
  stimulus: "<p>Welcome to our experiment!</p>" +
    "<p>In this task, you will be presented with a series of gambles in which you have a 50% chance of gaining an amount of money and a 50% percent chance of losing an amount of money.</p>"+
    "<p>You must decide whether or not to accept this gamble.</p>" +
    "<p> </p>" +
    "<p> </p>",// +
    //"<p>Press any key to continue the instructions...</p>"
    choices:['Press here to continue...']
};
var trainingIntro2 = {
  type: "html-button-response",
  stimulus: "<p>On each trial, you will be presented with a gamble in a circle. Inside the circle you will see two values. One will show the amount that you could potentially gain, "+
    "and the other will show what you could potentially lose. Whether the gain or loss value is on top is completely random.</p>" +
    "<p>The amount of potential gains and losses are varied across each trial. </p>" +
    "<p>You will have the choice of two options: Accepting or Rejecting the gamble. Make your choice by pressing either the M or C key on your keyboard.</p>" +
    "<p> </p>" +
    "<p> </p>",// +
    //"<p>Press any key to continue the instructions...</p>"
    choices:['Press here to continue...']
};
var trainingIntro3 = {
  type: "html-button-response",
  stimulus: "<p>Additionally, you will earn $1.00 for every 1000 points you have at the end of the task. You will be able to see how mch you earned at the end of this task.</p>" +
    "<p> </p>" +
    "<p> </p>",// +
    //"<p>Press any key to begin...</p>",
    choices:['Press here to begin...']
};

// Individual trial screens
var trialScreen = {
  type: 'html-keyboard-response',
  data: {
    Save_Data: 'NoSave'
  },
  stimulus: getStim,
  choices: ['c', 'm'],
  post_trial_gap: 0,
  on_finish: function(data) {
    totalTime=jsPsych.data.get().select('rt').values
    var trialTime = totalTime[totalTime.length - 1]
    var keyPressed = data.key_press;
    dataMatrix.push(keyPressed);
    reaction.push(trialTime)
  }
};


// Feedback trial screens
var RewardFeed = {
  type: 'html-keyboard-response',
  stimulus: getRewardFeedback,
  data: getDataVal,
  trial_duration: feedTime,
  post_trial_gap: 0,
  response_ends_trial: false
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

// // Signal end of the experiment
var ExpEnd = {
  type: 'html-button-response',
  stimulus: sumPoint, //"The Experiment is now over... Your Bonus is  When testing, press any button to show the data..."
  choices:['Press here to end...'],
  data: getTotal
}


var saveData = {
  type: 'html-keyboard-response',
  stimulus: trialSave,
  data: {
    Save_Data: 'NoSave'
  },
  trial_duration: ITI,
  post_trial_gap: 0, // Remove this too?
  response_ends_trial: false
}


// Forces fullscreen.
// timeline.push({
//   type: 'fullscreen',
//   fullscreen_mode: true
// });
// timeline.push(welcome);
// timeline.push(ageScreen);
// timeline.push(demographicScreen);
// timeline.push(politicalScreen);
timeline.push(trainingIntro1);
timeline.push(trainingIntro2);
timeline.push(trainingIntro3);
  for (let i = 0; i < valArray.length; i++) {
  //for (let i = 0; i < 5; i++) {
    timeline.push(trialScreen); // Shows trial, then feedback
    timeline.push(RewardFeed);
    timeline.push(saveData);
}

timeline.push(ExpEnd)

// // Transfer and Final Trials. Preloads both criterion instances and skips the correct one.
// timeline.push(bonusTrials);
// timeline.push(notBonusTrials);
