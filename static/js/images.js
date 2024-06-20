// constant for API Key
const API_KEY = "wxFE-eV4eaT1N27OsKq5N8Kt9riF36G9Dy_KSPZenqQ";
// value for test time duration in seconds
const TEST_DURATION = 30;

let images = []; // images array
let randImgIndex; // randomly selected image index
let currImgIndex = 0; // current image index
let corPressedKeys = 0; // correct pressed keys
let incPressedKeys = 0; // incorrect pressed keys
let testingPhase = false; // boolean test initiated
let reactionTime = []; // reactionTimes array
let corrImgAppears; // correct image appears
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
    button: "Start Test",
  }).then((isConfirm) => {
    if (isConfirm) {
      testingPhase = true // set testingPhase to true
      showRandomImage(); // call random image function
      setTimeout(endTest, TEST_DURATION * (1000)); // setTimeout to end test after test duration
      
    }
  })
}

/**
 * Test start
 */
function showRandomImage(){
  if (!testingPhase) return;
  let currentImage = document.getElementById("currentImg");
  currImgIndex = Math.floor(Math.random() * images.length) // random current index 
  currentImage.src = images[currImgIndex]// set currentImage.src to random current index inside images array

  setTimeout(showRandomImage, Math.random() * 1000 + 1000);
}

/**
 * Ends the test
 */
function endTest() {
  testingPhase = false;
}


/**
 * Event listener for keypress event
 */
document.addEventListener("keypress", function(event) {
  if (testingPhase){
    console.log('Key pressed:', event.code);
  }
});


showInitialInstructions();


