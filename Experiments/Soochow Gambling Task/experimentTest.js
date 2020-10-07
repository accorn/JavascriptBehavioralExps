// Matrices to hold experiment data
var timeline = []; // Will hold the trial order
var dataMatrix = []; // Holds javascript key press numbers to determine what option was choose in the previous trial
var rewardMatrix = []; // Holds the reward value for each trial
var choiceMatrix = []; // Holds the converted option numbers for each trial
var bestMatrix = []; // 1 and 0 for best choice made on each trial
var choiceSeen = 0
var trialnum = 0;
var rewardTotal = 0;
var bonusRewardTotal = [];
var nextFeed = '';
var sTime = 0
var eTime = 0
var reaction = [];
var sgtBonus = 0

var totalPoints = 2000;
var deckCount = [0,0,0,0];
const add = (a, b) =>
  a + b // function to add and compute AB and CD best options for criterion
const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

//changeCSS('static/css/jspsych.css', 0)

//-----------------------------Set up Info--------------------------------------


// Randomize deck order
var cards = [1, 2, 3, 4];
var cardOrder = jsPsych.randomization.shuffle(cards);


// Deck Rewards
var DeckARwdSGT = makeRepeated([200,200,200,200,-1050], 20);
var DeckBRwdSGT = makeRepeated([100,100,100,100,-650], 20);
var DeckCRwdSGT = makeRepeated([-200,-200,-200,-200,1050], 20);
var DeckDRwdSGT = makeRepeated([-100,-100,-100,-100,650], 20);


// Assign Card rewards to correct deck after randomization
var cardRewards = Array(4).fill(Array(100));

for(var i=0; i<4; i++) {
    cardRewards[i] = new Array(100);
}

for (var i = 0; i < 4; i++) {
  if (cardOrder[i] === 1) {
    cardRewards[i] = DeckARwdSGT;
  } else if (cardOrder[i] === 2) {
    cardRewards[i] = DeckBRwdSGT;
  } else if (cardOrder[i] === 3) {
    cardRewards[i] = DeckCRwdSGT;
  } else if (cardOrder[i] === 4) {
    cardRewards[i] = DeckDRwdSGT;
  }
}


// ---------All functions - Allows for dynamic changes within javascript------
// Function to retrieve the correct stimulus and text
var getStim = function() {
  var bankValue = totalPoints.toString();
  return "<div id = 'box1'><div id = 'letter1'>A</div></div><div id='centeredText1'>Deck A</div>"+
  "<div id = 'box2'><div id = 'letter2'>S</div></div><div id ='centeredText2'>Deck S</div>"+
  "<div id = 'box3'><div id = 'letter3'>K</div></div><div id ='centeredText3'>Deck K</div>"+
  "<div id = 'box4'><div id = 'letter4'>L</div></div><div id ='centeredText4'>Deck L</div>"+
  "<div id = 'pointTotal'>Bank: $" + bankValue + "</div>"+
  "<div id = 'promptText'>Please choose a Deck below by pressing the Deck's letter on your keyboard...</div>"
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
  if (a == 65) {
    trialReward = cardRewards[0][deckCount[0]];
    deckCount[0] = deckCount[0] + 1;
  } else if (a == 83) {
    trialReward = cardRewards[1][deckCount[1]];
    deckCount[1] = deckCount[1] + 1;
  } else if (a == 75) {
    trialReward = cardRewards[2][deckCount[2]];
    deckCount[2] = deckCount[2] + 1;
  } else if (a == 76) {
    trialReward = cardRewards[3][deckCount[3]];
    deckCount[3] = deckCount[3] + 1;
  }
  totalPoints = totalPoints + trialReward
  rewardMatrix.push(trialReward)
  return trialReward.toString();

}


// Function to show proper feedback screen with reward shown
var getRewardFeedback = function() {
  var testMat = dataMatrix[dataMatrix.length - 1]
  var reward = getReward(testMat)

  if (reward > 0){
    var rewardVal = reward.fontcolor("green")
  } else if (reward < 0){
    var rewardVal = reward.fontcolor("red")
  }
  if (testMat == 65) {
    choiceMatrix.push(cardOrder[0]);
    nextFeed = "<div id = 'box1chose'><div id='rwdText1'>" + rewardVal + "</div></div><div id='centeredText1'>Deck A</div>"
    return "<div id = 'box1chose'></div><div id='centeredText1'>Deck A</div>"
  } else if (testMat == 83) {
    choiceMatrix.push(cardOrder[1]);
    nextFeed = "<div id = 'box2chose'><div id='rwdText2'>" + rewardVal + "</div></div><div id='centeredText2'>Deck S</div>"
    return "<div id = 'box2chose'></div><div id='centeredText2'>Deck S</div>"
  } else if (testMat == 75) {
    choiceMatrix.push(cardOrder[2]);
    nextFeed = "<div id = 'box3chose'><div id='rwdText3'>" + rewardVal + "</div></div><div id='centeredText3'>Deck K</div>"
    return "<div id = 'box3chose'></div><div id='centeredText3'>Deck K</div>"
  } else if (testMat == 76) {
    choiceMatrix.push(cardOrder[3]);
    nextFeed = "<div id = 'box4chose'><div id='rwdText4'>" + rewardVal + "</div></div><div id='centeredText4'>Deck L</div>"
    return "<div id = 'box4chose'></div><div id='centeredText4'>Deck L</div>"
  } else {
    return 'ERROR' // just in case
  }
}



// funciton used to figure if best choice was chose, and save local data if needed
var getDataVal = function() {
  return {
    reward: rewardMatrix[rewardMatrix.length - 1],
    keyResponse: choiceMatrix[choiceMatrix.length - 1],
    bank: totalPoints,
    react: reaction[reaction.length-1],
    Save_Data: 'Save'
  }
}


var boxAnim = function() {
  var picked = dataMatrix[dataMatrix.length-1];
  if (picked == 65) {
    choseAnim = 'box1chose'
    initColor = 'yellow'
  } else if (picked == 83) {
    choseAnim = 'box2chose'
    initColor = 'cyan'
  } else if (picked == 75) {
    choseAnim = 'box3chose'
    initColor = 'magenta'
  } else if (picked == 76) {
    choseAnim = 'box4chose'
    initColor = 'lightgreen'
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
var sumPoint = function() {
  bonusReward = totalPoints/1000
  sgtBonus = bonusReward
  finalReward = bonusReward.toFixed(2)
  console.log(bonusReward)
  return "<p>This task is completed! Your bonus for this task is: $"+finalReward+"</p>"//"<p>Press any key to continue...</p>"
}

// Saves each trial data to the SQL database
var trialSave = function() {
  return "<div>Please wait for the next trial...</div>"
}


var getTotal = function() {
return {
    SGTBonus: sgtBonus
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



var trainingIntro = {
  type: "html-button-response",
  stimulus: "<p>Welcome to our experiment!</p>" +
    "<p>In this study we are interested in how people use information to make " +
    "decisions.  You will repeatedly select from one of four decks of cards, " +
    "and you could gain or lose points on each draw.  You will be given 2000 " +
    "points to start and your goal is to try to finish with at least 3000 points.</p>"+
    "<p>Each time you draw, the card you picked will be turned over and the number of " +
    "points you gained or lost will be displayed.</p>" +
    "<p>You can press the 'A', 'S', 'K', and 'L' keys to draw from each deck.  </p>" +
    "<p>Just do your best to maximize your gains and minimize your losses.</p>" +
    "<p>As a bonus, you will receive $1.00 for every 1000 points you have at the end of the task. The exact amount you earned will be displayed at the end of the task.</p>" +
    "<p> </p>", //+
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
  choices: ['a', 's', 'k', 'l'],
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
  trial_duration: 750,
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
  stimulus: sumPoint,
  data: getTotal,
  choices:['Press here to continue...']
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



timeline.push(trainingIntro);
  for (let i = 0; i < 100; i++) {
  //for (let i = 0; i < 5; i++) {
    timeline.push(trialScreen); // Shows trial, then feedback
    timeline.push(RewardFeed);
    timeline.push(RewardFeed2);
    timeline.push(saveData);
}
timeline.push(ExpEnd)
