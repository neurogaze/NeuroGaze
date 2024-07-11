// constant for API Key
const API_KEY = "wxFE-eV4eaT1N27OsKq5N8Kt9riF36G9Dy_KSPZenqQ";
// value for test time duration in seconds
const TEST_DURATION = 30;
const DELAY_INTERVAL = [1000, 2000, 4000];

let images = []; // images array
let randImgIndex; // randomly selected image index
let currImgIndex = 0; // current image index
let corPressedKeys = 0; // correct pressed keys
let incPressedKeys = 0; // incorrect pressed keys
let testingPhase = false; // boolean test initiated
let reactionTimes = []; // reactionTimes array
let startTime; // exact time and date when correct image appears
let avgReactionTime; // average reaction time

/**
 * Fetches 10 random images from the Unsplash API.
 */
async function fetchImageURLs() {
  const URL = `https://api.unsplash.com/photos/random?count=10&client_id=${API_KEY}`;
  const response = await fetch(URL);
  const data = await response.json();
  const imgUrls = data.map((img) => img.urls.regular);

  return imgUrls;
}

/**
 * Show the instruction at the start up screen.
 */
function showInitialInstructions() {
  swal({
    title: "ADHD Visual Attention Test",
    text: "The computer will generate 10 random images. It will pick one image which you will need to press the spacebar when you see. Do not press the spacebar if a different image appears.",
    icon: "info",
    button: "Next",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      startingTestInstructions();
    }
  });
}

/**
 * This is instructions for the selected image.
 */
async function startingTestInstructions() {
  images = await fetchImageURLs(); // Array of 10 images
  // Set randImgIndex to one of the images randomly
  randImgIndex = Math.floor(Math.random() * images.length);
  console.log(randImgIndex, images[randImgIndex]);

  swal({
    title: "Your Image",
    text: "This is the image. Make sure to press the spacebar when you see it again.",
    icon: images[randImgIndex],
    closeOnClickOutside: false,
    button: "Start Test",
  }).then((isConfirm) => {
    if (isConfirm) {
      testingPhase = true; // set testingPhase to true
      showRandomImage(); // call random image function
      setTimeout(endTest, TEST_DURATION * 1000); // setTimeout to end test after test duration
    }
  });
}

/**
 * Test start
 */
function showRandomImage() {
  if (!testingPhase) return;
  startTime = Date.now();
  let currentImage = document.getElementById("currentImg");
  currImgIndex = Math.floor(Math.random() * images.length); // random current index
  currentImage.src = images[currImgIndex]; // set currentImage.src to random current index inside images array

  let delay = DELAY_INTERVAL[Math.floor(Math.random() * 3)];
  setTimeout(showRandomImage, 250 + delay);
}

/**
 * Ends the test
 */
function endTest() {
  testingPhase = false;
  avgReactionTime = calculateAvgReactionTime();
  let testScore = calculateTestScore();
  console.log("Test ended:", avgReactionTime, testScore);
  localStorage.setItem(
    "attention-reactionTimes",
    JSON.stringify(reactionTimes)
  );
  localStorage.setItem("attention-avgReactionTime", avgReactionTime);
  localStorage.setItem("attention-testScore", testScore);

  swal({
    title: "Test Completed",
    icon: "success",
    button: "Start Next Test",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      window.location.href = "interference";
    }
  });
}

/**
 * Calculate reaction times
 */
function calculateAvgReactionTime() {
  let sum = 0;
  for (let i = 0; i < reactionTimes.length; i++) {
    sum += reactionTimes[i];
  }
  return sum / reactionTimes.length;
}

/**
 * Calculate final test score
 */
function calculateTestScore() {
  return (corPressedKeys / (corPressedKeys + incPressedKeys)) * 100;
}

/**
 * Event listener for keypress event
 */
document.addEventListener("keypress", function (event) {
  if (testingPhase && event.code === "Space") {
    if (randImgIndex == currImgIndex) {
      let endTime = Date.now();
      let reactionTime = endTime - startTime;
      reactionTimes.push(reactionTime);
      corPressedKeys++;
      console.log("correct press");
    } else {
      console.log("incorrect press");
      incPressedKeys++;
    }
  }
});

showInitialInstructions();

var trial = {
  type: jsPsychImageKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: TEST_DURATION * 1000,
  extensions: [
    {
      type: jsPsychExtensionWebgazer,
      params: {targets: ['#currentImg']}
    }
  ]
}

var show_data = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    var trial_data = jsPsych.data.getLastTrialData().values();
    var trial_json = JSON.stringify(trial_data, null, 2);
    return `<p style="margin-bottom:0px;"><strong>Trial data:</strong></p>
      <pre style="margin-top:0px;text-align:left;">${trial_json}</pre>`;
  },
  choices: "NO_KEYS"
};


jsPsych.run([
  trial,
  show_data
]);
