const API_KEY = "wxFE-eV4eaT1N27OsKq5N8Kt9riF36G9Dy_KSPZenqQ";
const TEST_DURATION = 60; // value for test time duration in seconds
const DELAY_INTERVAL = [1000, 2000, 4000];

let passages;

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
function showInitialInstructions() {
  swal({
    title: "Interference Test",
    text: "In this test, you will be shown a passage of text. You will be asked to read the passage carefully.\
     You will also be shown some distractions during the test. You will have to ignore the distractions and focus on the passage.",
    icon: "info",
    button: "Start Test",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      selectDifficulty();
    }
  });
}

/**
 * Choose the difficulty for the test.
 */
function selectDifficulty() {
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

  let selectedDifficulty = difficultyOptions[0].value; // Default to first option

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
      testingPhase = true;
      startingTest(selectedDifficulty);
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
  // localStorage.setItem("inhibition-reactionTimes", JSON.stringify(reactionTimes));
  // localStorage.setItem("inhibition-avgReactionTime", avgReactionTime);
  // localStorage.setItem("inhibition-testScore", testScore);

  swal({
    title: "Testing Completed",
    icon: "success",
    button: "Start Screening Test",
  }).then((isConfirm) => {
    if (isConfirm) {
      window.location.href = "screening";
    }
  });
}

showInitialInstructions();
