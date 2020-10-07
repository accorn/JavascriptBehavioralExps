/* ************************************ */
/* Javascript for category learning tasks */
/* ************************************ */
// Obtain survey code from URL
var surveyCode = '';
var creditToken = '';
//console.log
//creditToken+="https://tamupsychology.sona-systems.com/webstudy_credit.aspx?experiment_id=3128&credit_token=bf772d50b643459bb6a9d0fbf903ae1f&survey_code="
///creditToken+=surveyCode;

console.log(surveyCode)

// SETUP INFORMATION
// Set up empty arrays for exp info
keyArray = []
rtArray = []
correctArray = []
rwdArray = []

// Define trial counter (javascript indexes at 0)
trial = 0
blockTrials = 5

// Vector for the X and Y values for each endpoint of the line stimuli (put here to deal with code scope)
var p0 = [0,0]
var p1 = [0,0]

// Load stimuli file from .csv using AJAX, then shuffle and coerce to array.
var stimuli;
$.get( "Stims/stimCJES.csv", function( CSVdata) {

      data = Papa.parse(CSVdata, {dynamicTyping: true}); // papaparse is a javascript library
      stimuli = jsPsych.randomization.shuffle(data.data.slice(1,401)) // this suffles the whole array and then selects only trials 1-400

});


// EXPERIMENT FUNCTIONS
// Initial instructions (simple text return)
var expInstrux = function(){
  return "<p>Welcome to our experiment!</p>"+
    "<p></p>"+
    "<p>In the following task, you will be shown multiple lines on the screen. "+
    "Your job is to use the lines to figure out which option is the most rewarding "+
    "on each trial. On each trial, you can choose Option A or B by pressing the F or J key on your "+
    "keyboard. </p>"+
    "<p></p>"+
    "<p>When you are ready, please press the button below to begin...</p>"
}

// Create the line stimulus using canvas (another javascript library)
var makeStim = function(){
  var line = document.getElementById("canvas"); //getElementbyID can only be used if the element is already in memory. This is why this functions is called after trial info is done loading
  var lineX = line.getContext("2d")

  // Make start and end points, and define line color and size
  lineX.moveTo(p0[0], p0[1]);
  lineX.lineTo(p1[0], p1[1]);
  lineX.strokeStyle = "#FFFFFF";
  lineX.lineWidth = 5;
  lineX.stroke();
}

// Compute the stimulus endpoints and define the screen area to draw on
var getStim = function(){
  var stimPoints = [stimuli[trial][2],stimuli[trial][3]] // Get current trial information for stim
  stimPoints[1] = stimPoints[1]*Math.PI/500 // convert to radians
  // Figure endpoints from line length and radians
  var mathFun = [stimPoints[0]/2*Math.cos(stimPoints[1]), stimPoints[0]/2*-1*Math.sin(stimPoints[1])]

  // Center the line and save it to the vector we initialized earlier
  p0 = [200-mathFun[0], 200-mathFun[1]]
  p1 = [200+ mathFun[0], 200+ mathFun[1]]

  // Define the screen area via a <div> and <canvas> call. The div class can be tweaked via the css file. Define the size of the canvas here.
  var stim = '<div class = stimBox><canvas id = canvas  width="400" height="400"></canvas></div>'
  return stim
}

// Figure the feedback and what to display
var getFeed = function(){
  // Initialize values
  correct = 0
  points = 0
  cat = stimuli[trial][1] // Get correct category
  lastKey = keyArray[keyArray.length-1] // Get the last key response code

  // Use javascript key codes to figure is response was correct
  if (lastKey == 70){
    catChose = 1
  } else if (lastKey == 74){
    catChose = 2
  }

  if (catChose == cat){
    correct = 1
    points = 100//stimuli[trial][5]
  }

  // Send information to data arrays
  correctArray.push(correct)
  rwdArray.push(points)

  // Feedback text to display
  return "Points Earned: "+points+""
}

// Function that saves only the data we define
var saveData = function() {
  return {
    reward: rwdArray[rwdArray.length - 1], // Pulls from the data arrays.
    response: keyArray[keyArray.length-1],
    correct: correctArray[correctArray.length-1],
    reaction: rtArray[rtArray.length-1]
  }
}


// TRIAL VARIABLES
// Instructions using button response
var instructions = {
  type: 'html-button-response', // define the plugin type
  stimulus: expInstrux, // call the function we already wrote
  choices:['Continue'], // Tell it what text to display in the button
  on_finish:function(){
    surveyCode = jatos.urlQueryParameters.survey_id;
    console.log(surveyCode)
  }
}

// Actual trial using keyboard responses
var showTrial = {
  type: 'html-keyboard-response',
  stimulus: getStim,
  choices:['f','j'], // define what keys to use
  prompt:'Using your keyboard, press F for Category A and press J for Category B',
  on_load: makeStim,
  on_finish:function(data){
    // Send data to arrays
    keyArray.push(data.key_press)
    rtArray.push(data.rt)
  }
}

// Show feedback, timed with no response needed
var showFeedback = {
  type: 'html-keyboard-response',
  stimulus: getFeed,
  data:saveData, // Saves everything
  trial_duration:750, // in milliseconds
  response_ends_trial:false
}

var showITI = {
  type: 'html-keyboard-response',
  stimulus: '',// Saves everything
  trial_duration:500, // in milliseconds
  response_ends_trial:false,
  on_finish:function(){
    trial += 1
  }
}

var showBreak = {
  type: 'html-button-response', // define the plugin type
  stimulus: 'You have completed a block of trials. Please take a short break. Whenever you are ready, please press the button below to continue.', // call the function we already wrote
  choices:['Continue'] // Tell it what text to display in the button
}

var expEnd = {
  type:'html-button-response',
  stimulus: 'Over the course of this experiment, you have done a thing. To get credit for your time, press the button below to go to another page to get credit.',
  choices: ['CONTINUE'],
  button_html:['<button class="jspsych-btn-agree">%choice%</button>'],
  margin_vertical:'20px',
  data: {debrief: 'debrief'},
  on_finish: function() {
    creditToken+="https://tamupsychology.sona-systems.com/webstudy_credit.aspx?experiment_id=3128&credit_token=bf772d50b643459bb6a9d0fbf903ae1f&survey_code="
    creditToken+=surveyCode;
    console.log(surveyCode)
  }
}

var giveCredit = {
  type:'html-button-response',
  stimulus:'Click the button below for credit.',
  choices:['Click Here'],
  button_html: function() {
    return `<a class="jspsych-btn-agree" type="button" onclick="window.open('${creditToken}', '_blank')">CLICK HERE TO RECEIVE CREDIT</a>`
  },
  margin_vertical: '20px'
}


// START THE TRIAL loop
// Initialize the timeline
timeline = []

// Have it show the instructions first
timeline.push(instructions)

// Have it show the trial then instructions ten times in order
for (let i = 0; i < blockTrials; i++) {
  timeline.push(showTrial)
  timeline.push(showFeedback)
  timeline.push(showITI)
}

// timeline.push(showBreak)
//
// for (let i = 0; i < blockTrials; i++) {
//   timeline.push(showTrial)
//   timeline.push(showFeedback)
//   timeline.push(showITI)
// }
//
// timeline.push(showBreak)
//
// for (let i = 0; i < blockTrials; i++) {
//   timeline.push(showTrial)
//   timeline.push(showFeedback)
//   timeline.push(showITI)
// }
//
// timeline.push(showBreak)
//
// for (let i = 0; i < blockTrials; i++) {
//   timeline.push(showTrial)
//   timeline.push(showFeedback)
//   timeline.push(showITI)
// }


timeline.push(expEnd)
timeline.push(giveCredit)
