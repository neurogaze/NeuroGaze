// value for test time duration in seconds
const TEST_DURATION = 30;
// values of the alphabet
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DELAY_INTERVAL = [1000, 2000, 4000];

let currLetterIndex = 0; // current letter index
let corPressedKeys = 0; // correct pressed keys
let incPressedKeys = 0; // incorrect pressed keys
let testingPhase = false; // boolean test initiated
let reactionTimes = []; // reactionTimes array
let startTime; // exact time and date when correct image appears
let avgReactionTime; // average reaction time

/**
 * Show the instruction at the start up screen.
 */
function showInitialInstructions() {
  swal({
    title: "Continuous Inhibition Test",
    text: "You will be presented with a series of flashing alphabetical letters on the screen with varying frequencies. Press the spacebar for every letter other than ‘X’.",
    icon: "info",
    button: "Start Test",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      testingPhase = true; // set testingPhase to true
      showRandomLetter(); // call random image function
      setTimeout(endTest, TEST_DURATION * 1000); // setTimeout to end test after test duration
    }
  });
}

/**
 * Test start
 */
function showRandomLetter() {
  if (!testingPhase) return;
  currLetterIndex = Math.floor(Math.random() * 26); // random current index

  startTime = Date.now();
  let currentLetter = document.getElementById("currentLetter");
  console.log("Current Letter:", ALPHABET[currLetterIndex]);
  currentLetter.textContent = ALPHABET[currLetterIndex]; // set current letter text to random letter

  let delay = DELAY_INTERVAL[Math.floor(Math.random() * 3)];
  setTimeout(showRandomLetter, 250 + delay);
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
    "inhibition-reactionTimes",
    JSON.stringify(reactionTimes)
  );
  localStorage.setItem("inhibition-avgReactionTime", avgReactionTime);
  localStorage.setItem("inhibition-testScore", testScore);

  swal({
    title: "Test Completed",
    icon: "success",
    button: "Start Next Test",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      window.location.href = "continuous-inhibition";
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
    if (ALPHABET[currLetterIndex] !== "X") {
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
