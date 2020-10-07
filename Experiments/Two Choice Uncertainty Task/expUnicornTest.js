// Matrices to hold experiment data
var timeline = []; // Will hold the trial order
var dataMatrix = []; // Holds javascript key press numbers to determine what option was choose in the previous trial
var rewardMatrix = []; // Holds the reward value for each trial
var choiceMatrix = []; // Holds the converted option numbers for each trial
var bestMatrix = []; // 1 and 0 for best choice made on each trial\

var rewardOther=  [];

var choiceSeen = 0
var trialnum = 0;
var rewardTotal = 0;
var goalValue = 2400;
var trialnum = 1

var uniBonus = 0

var bonusRewardTotal = [];
var nextFeed = '';
var reaction = [];

var totalPoints = 0;
var deckCount = [0,0];
const add = (a, b) =>
  a + b // function to add and compute AB and CD best options for criterion
const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

//changeCSS('static/css/jspsychUnicorn.css', 0)

var HRespMat = [0,1,0,1,0,1,0,1,0,1]

var choiceRewards = [[-22,-21,54,79,82,42,8,9,22,8,-14,20,47,-6,11,38,-2,27,3,8,22,1,43,-13,53,30,10,41,4,24,37,15,17,25,10,28,19,54,51,10,41,12,2,26,54,
  -3,-19,42,3,86,47,104,66,7,50,48,59,81,38,28,-11,-2,61,31,-33,17,37,43,39,20,47,62,-11,35,75,36,4,13,45,37,33,23,21,26,4,31,25,24,0,33,-22,0,46,31,46,28,18,20,70,7],
  [19,18,12,6,16,20,10,13,18,11,15,16,18,22,19,20,25,21,18,16,10,14,18,17,10,17,11,13,8,7,7,14,13,14,17,14,16,20,15,14,18,12,10,13,13,17,20,9,17,16,19,12,17,17,
  18,12,15,13,18,12,10,25,16,20,25,17,19,8,18,11,26,13,9,7,11,12,22,16,21,10,10,24,11,14,22,21,15,14,21,8,32,15,11,8,28,19,17,20,23,30]]

var hMatMod = [40,30]
var advChoice = [1,0]
var cardOrder = [1,2]


//-----------------------------Set up Info--------------------------------------





// ---------All functions - Allows for dynamic changes within javascript------
// Function to retrieve the correct stimulus and text
var getStim = function() {
  var bankValue = totalPoints.toString();
  return "<div id = 'box1'><div id = 'letter1'>F</div></div><div id='centeredText1'>Deck F</div>"+
  "<div id = 'box2'><div id = 'letter2'>J</div></div><div id ='centeredText2'>Deck J</div>"+
  "<div id = 'pointTotal'>Points: " + bankValue + "</div>"+
  "<div id = 'promptText'>Pick a Card!</div>"
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
  var hMod = 0
  var H = 0
  if (a == 70) {
    trialReward = choiceRewards[0][deckCount[0]];
    deckCount[0] = deckCount[0] + 1;
    hMod = hMatMod[0]
    H = advChoice[0]
  } else if (a == 74) {
    trialReward = choiceRewards[1][deckCount[1]];
    deckCount[1] = deckCount[1] + 1;
    hMod = hMatMod[1]
    H = advChoice[1]
  }
  sumH = 0
  for (let i = trialnum-1; i < trialnum+9; i++){
    sumH = sumH + HRespMat[i]
  }
  console.log(sumH)
  rewardMatrix.push(trialReward)
  rewardOther.push(hMod+(50*sumH/10))
  HRespMat.push(H)
  console.log(HRespMat)
  totalPoints = totalPoints + trialReward

  return trialReward.toString();

}


// Function to show proper feedback screen with reward shown
var getRewardFeedback = function() {
  var testMat = dataMatrix[dataMatrix.length - 1]
  var reward = getReward(testMat)

  if (reward > 0){
    var rewardVal = reward.fontcolor("black")
  } else if (reward < 0){
    var rewardVal = reward.fontcolor("red")
  }
  if (testMat == 70) {
    choiceMatrix.push(cardOrder[0]);
    nextFeed = "<div id = 'box1chose'><div id='rwdText1'>" + rewardVal + "</div></div><div id='centeredText1'>Deck F</div><div id = 'feedText'>Points you received</div>"
    return "<div id = 'box1chose'></div><div id='centeredText1'>Deck F</div>"
  } else if (testMat == 74) {
    choiceMatrix.push(cardOrder[1]);
    nextFeed = "<div id = 'box2chose'><div id='rwdText2'>" + rewardVal + "</div></div><div id='centeredText2'>Deck J</div><div id = 'feedText'>Points you received</div>"
    return "<div id = 'box2chose'></div><div id='centeredText2'>Deck J</div>"
  } else {
    return 'ERROR' // just in case
  }
}



// funciton used to figure if best choice was chose, and save local data if needed
var getDataVal = function() {
  trialnum = trialnum+1
  return {
    reward: rewardMatrix[rewardMatrix.length - 1],
    rewardOther: rewardOther[rewardOther.length - 1],
    keyResponse: choiceMatrix[choiceMatrix.length - 1],
    bank: totalPoints,
    react: reaction[reaction.length-1],
    Save_Data: 'Save'
  }
}


var boxAnim = function() {
  var picked = dataMatrix[dataMatrix.length-1];
  if (picked == 70) {
    choseAnim = 'box1chose'
    initColor = 'purple'
  } else if (picked == 74) {
    choseAnim = 'box2chose'
    initColor = 'green'
  }

  var boxChange = document.getElementById(choseAnim);
  var id = setInterval(frame, 15);
  var animCount = 0
  function frame() {

      if (animCount == 15) {
        boxChange.style.backgroundColor = 'white';
        clearInterval(id);
      } else if (animCount % 2 == 0) {
        boxChange.style.backgroundColor = 'white';
        wait(75)
        animCount++
      } else {
        boxChange.style.backgroundColor = initColor;
        wait(75)
        animCount++
      }


  }
}

var getNextFeed = function(){
  return nextFeed
}

// // Figures bonus amount if bonus trials were seen.
var sumPoint = function(arr) {
  var bonusReward = totalPoints/1000
  uniBonus = bonusReward
  var finalReward = bonusReward.toFixed(2);
  return "<p>You have now completed this task! You earned a bonus of: $"+finalReward+"</p>"//"<p>Press any key to continue...</p>"
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
var getFinal = function() {
  // if (dataMatrix.length > 150) {
  //   phaseData = 'Test'
  // } else {
  //   phaseData = 'Train'
  // }
  //psiturk.recordTrialData([phaseData, optShownMat[trialnum-1], choiceMatrix[choiceMatrix.length - 1], rewardMatrix[rewardMatrix.length - 1], totalProbMatrix[totalProbMatrix.length - 1], bestMatrix[bestMatrix.length - 1]])
  return {
    UNIFinal: uniBonus
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
    "<p>In this study we are interested in how people use information to make"+
    " decisions.  You will repeatedly select from one of two decks of cards,"+
    " and you will gain or lose a certain number of points on each draw.  If you"+
    " gained points they will be shown in black; if you lose points they will be"+
    " shown in red and indicated by a negative sign.</p>"+
    "<p>To select from the deck on the left press the 'F' key and to select from"+
    " the deck on the right press the 'J' key.</p>"+
    "<p> </p>"+
    "<p> </p>",//+
    //"<p>Press any key to continue the instructions...</p>",
    choices:['Press here to continue...'],
  data: {
    Save_Data: 'NoSave'
  },
  post_trial_gap: 0
};
var trainingIntro2 = {
  type: "html-button-response",
  stimulus: "<p>Each time you draw, the card you picked will be turned over and the number of "+
    "points you gained or lost will be displayed.  </p>"+
    "<p>Your goal is to try to earn as many points as possible.  We want you to try "+
    "to earn at least 2,400 points by the end of the experiment.</p>"+
    "<p>We are interested in how people make decisions so please just try to do "+
    "your best to earn as many points as possible. </p>"+
    "<p>Remember to press 'F' or 'J' to pick from each deck.</p>"+
    "<p>Additionally, you will also earn $1.00 for every 1000 points you have at the end of this task. The amount you earned will be shown to you at the end of the task.</p>"+
    "<p> </p>",//+
    //"<p>Press any key to begin...</p>",
    choices:['Press here to continue...'],
  data: {
    Save_Data: 'NoSave'
  },
  post_trial_gap: 1000
};

// Individual trial screens
var trialScreen = {
  type: 'html-keyboard-response',
  data: {
    Save_Data: 'NoSave'
  },
  stimulus: getStim,
  choices: ['f', 'j'],
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
  trial_duration: 500,
  post_trial_gap: 0,
  response_ends_trial: false,
  on_load: boxAnim
}

var RewardFeed2 = {
  type: 'html-keyboard-response',
  stimulus: getNextFeed,
  trial_duration: 2000,
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
// var ExpEnd = {
//   type: 'html-keyboard-response',
//   stimulus: sumPoint,
//   data:getFinal
// }
var ExpEnd = {
  type: 'html-button-response',
  stimulus: sumPoint,
  choices:['Press here to continue...'],
  data:getFinal
}

var saveData = {
  type: 'html-keyboard-response',
  stimulus: trialSave,
  data: {
    Save_Data: 'NoSave'
  },
  trial_duration: 500,
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

  for (let i = 0; i < choiceRewards[0].length; i++) {
  //for (let i = 0; i < 5; i++) {
    timeline.push(trialScreen); // Shows trial, then feedback
    timeline.push(RewardFeed);
    timeline.push(RewardFeed2);
    timeline.push(saveData);
}

timeline.push(ExpEnd);
