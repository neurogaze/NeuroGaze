import {
  jsPsych,
  camera_instructions,
  init_camera,
  calibration_instructions,
  calibration,
  validation_instructions,
  validation,
  recalibrate,
} from "./calibration.js";

const API_KEY = "wxFE-eV4eaT1N27OsKq5N8Kt9riF36G9Dy_KSPZenqQ";
// Function to determine test duration
function updateTestDuration() {
  // Retrieve the stored test source from localStorage
  const testSource = localStorage.getItem("testSource");

  // Log the retrieved value for debugging
  console.log("Retrieved testSource: ", testSource);

  // Determine test duration based on the stored value
  if (testSource === "/datacollect") {
    console.log("Test source is datacollect. Setting duration to 90 seconds.");
    return 90; // Set duration to 90 seconds for datacollect
  } else {
    console.log("Test source is not recognized. Setting duration to 30 seconds.");
    return 30; // Default duration for other sources
  }
}

const TEST_DURATION = updateTestDuration();
const DELAY_INTERVAL = [1000, 2000, 4000];
const MARGIN_ERROR = 20;
let HTML; // Store the page's HTML content
let passages;
let selectedDifficulty;
let testSource = localStorage.getItem("testSource");
let timeline;
let comissionError = 0;

// Initialize jsPsych
function initJsPsychTimeline() {
  let calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Great, we're done with calibration!</p>
  `,
    choices: ["OK"],
    on_finish: function () {},
  };

  let trialInstructions = {
    type: jsPsychCallFunction,
    async: true,
    func: function (done) {
      showInitialInstructions(done);
    },
  };

  let trial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: HTML,
    on_load: function () {
      console.log(HTML);
      console.log("Trial started");
      testingPhase = true;
      startingTest(selectedDifficulty);
    },
    on_finish: function () {
      console.log("Finished");
      let eyeTrackingData = jsPsych.data.getLastTrialData().values();
      let trial_json = JSON.stringify(eyeTrackingData, null, 2);
      console.log("Eye Tracking Data:", trial_json);
      localStorage.setItem(
        "interference-eyeTracking",
        JSON.stringify(trial_json)
      );
      endTest();
    },
    trial_duration: TEST_DURATION * 1000,
    extensions: [
      {
        type: jsPsychExtensionWebgazer,
        params: { targets: ["#passage"] },
      },
    ],
  };

  timeline = testSource === '/testing' ?
      [ camera_instructions,
        init_camera,
        calibration_instructions,
        calibration,
        validation_instructions,
        validation,
        recalibrate,
        calibration_done,
        trialInstructions,
        trial
      ] : [
        init_camera,
        trialInstructions,
        trial
      ];
  

  jsPsych.run(timeline);
}

/**
 * Show the instruction at the start up screen.
 */
function showCalibrationInstructions() {
  HTML = document.getElementById("passageCont").outerHTML;
  console.log(HTML);

  if (testSource === "/testing") {
    swal({
      title: "Pre-Test Calibration",
      text: "You will calibrate the eye tracker before the test starts.",
      icon: "info",
      button: "Begin",
      closeOnClickOutside: false,
    }).then((isConfirm) => {
      if (isConfirm) {
        initJsPsychTimeline();
      }
    });
  } else {
    initJsPsychTimeline();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    let response = await fetch("/static/testing/passages.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    passages = data;
  } catch (error) {
    console.error("Error fetching or parsing questions:", error);
  }
});

let popUps = []; // distractions that pop up
let selectedPassage; // currently selected passage
let testingPhase = false; // boolean test initiated
let distractionInterval; // time between distractions

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
function showInitialInstructions(done) {
  swal({
    title: "Interference Test",
    text: "In this test, you will be shown a passage of text. You will be asked to read the passage carefully.\
     You will also be shown some distractions during the test. You will have to ignore the distractions and focus on the passage. Keep re-reading the passage until the test stops.",
    icon: "info",
    button: "Start Test",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      selectDifficulty(done);
    }
  });
}

/**
 * Choose the difficulty for the test.
 */
function selectDifficulty(done) {
  const difficultyOptions = [
    { text: "(For Children 6-11)", value: "child" },
    { text: "(For Teens 12-17)", value: "teen" },
    { text: "(For Adults 18+)", value: "adult" },
  ];

  const select = document.createElement("select");

  difficultyOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.text;
    optionElement.value = option.value;
    select.appendChild(optionElement);
  });

  selectedDifficulty = difficultyOptions[0].value; // Default to first option

  select.onchange = function (e) {
    selectedDifficulty = e.target.value;
  };

  swal({
    title: "Select Difficulty",
    text: "Choose the difficulty level for the test",
    icon: "info",
    content: select,
    buttons: {
      cancel: "Cancel",
      confirm: "Start Test",
    },
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      done();
    }
  });
}

/**
 * Test start
 */
async function startingTest(selectedDifficulty) {
  if (!testingPhase) return;

  console.log(selectedDifficulty);

  popUps = await fetchImageURLs(); // Set the images to the popUps array
  const filteredpassages = passages.filter(
    (passage) => passage.difficulty === selectedDifficulty
  ); // Using selected difficulty, filter the passages
  selectedPassage =
    filteredpassages[Math.floor(Math.random() * filteredpassages.length)]; // Select random passage
  document.getElementById("passage").innerText = selectedPassage.text; // Display the passage text
  testingPhase = true; // Set testing phase to true
  startPopupLoop();
  setTimeout(endTest, TEST_DURATION * 1000); // Set test duration
}

/**
 * Start pop=up distraction loop
 */
function startPopupLoop() {
  if (!testingPhase) return;
  let delay = DELAY_INTERVAL[Math.floor(Math.random() * 3)];

  distractionInterval = setInterval(() => {
    showPopup();
  }, 250 + delay);
}

/**
 * Show the pop-up distractions
 */
function showPopup() {
  const popUp = document.getElementById("popUp");
  const randomSize = Math.floor(Math.random() * 100 + 200); // Generate size anywhere from 200px - 300px;
  const randomPosition = generateRandomPosition();
  console.log(randomPosition);

  // Randomly select an image from the popUps array
  let randomImgIndex = Math.floor(Math.random() * popUps.length);

  popUp.src = popUps[randomImgIndex];
  popUp.style.width = randomSize.toString() + "px";
  popUp.style.height = randomSize.toString() + "px";
  popUp.style.top = randomPosition.y.toString() + "px";
  popUp.style.left = randomPosition.x.toString() + "px";
  popUp.classList.remove("hidden");

  setTimeout(() => {
    popUp.classList.add("hidden");

    let currentGazeData = jsPsych.data.getLastTrialData().values();
    console.log(currentGazeData.webgazer_data);

    let lastIndex = currentGazeData.length - 1;
    let lastEntry = currentGazeData[lastIndex];
    console.log(lastEntry);

    let leftBorder = randomPosition.x - MARGIN_ERROR;
    let rightBorder = randomPosition.x + MARGIN_ERROR;
    let topBorder = randomPosition.y + MARGIN_ERROR;
    let bottomBorder = randomPosition.y - MARGIN_ERROR;

    if (lastEntry.x >= leftBorder && lastEntry.x <= rightBorder && lastEntry.y >= bottomBorder && lastEntry.y <= topBorder) {
      console.log("You looked at the distraction pictures!");
      ++comissionError;
    }

  }, 1000);
}

/**
 * Generate random position
 */
function generateRandomPosition() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const maxY = windowHeight - 200;
  const maxX = windowWidth - 200;

  const randomY = Math.floor(Math.random() * maxY);
  const randomX = Math.floor(Math.random() * maxX);

  return { x: randomX, y: randomY };
}

/**
 * Ends the test
 */
function endTest() {
  testingPhase = false;

  let dest, btnText;

  console.log(jsPsych.data.getLastTrialData().values());

  if (testSource === '/testing') {
    dest = "screening";
    btnText = "Start Screening Test";
  } else {
    dest = "results";
    btnText = "Generate Report";
  }

  swal({
    title: "Testing Completed",
    icon: "success",
    button: btnText,
  }).then((isConfirm) => {
    if (isConfirm) {
      window.location.href = dest;
    }
  });
}

showCalibrationInstructions();
