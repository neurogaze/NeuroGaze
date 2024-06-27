# ADHD Tools for Web Interaction

Dont forget to commit btw -
cd static
npx tailwindcss -i ./css/index.css -o ./css/output.css --watch

venv = virtual environment - used to add packages.
running server:
python3 -m venv .venv                                                  
source .venv/bin/activate
python3 main.py

turning off virtual environment:
source deactivate

when installing new packages:
python3 -m venv .venv                                                  
source .venv/bin/activate
pip3 install -r requirements.txt or python3 -m pip install -r requirements.txt
python3 main.py

Write articles using:
https://stackedit.io/app#

## Description

This project provides a suite of interactive web-based tools designed to enhance understanding and awareness of ADHD
through engaging visual and interactive methods. It includes modules like the Random Letters Game, Face Landmark
Detection using MediaPipe, and more. These tools are intended to be used in educational environments, therapy sessions,
or personal education to better understand and demonstrate various aspects related to ADHD.

## Features

### Random Letters Game

- **Random Letters Game**: A simple game that displays random letters on the screen, which users can interact with by
  clicking. It's designed to help improve focus and attention in a fun way.
- **Files Involved**:
    - `randomLetters.html`: Contains the HTML structure for the game interface.
    - `randomLetters.css`: Provides styling for the game elements.
    - `randomLetters.js`: Handles the game logic including the generation of random letters and the game's
      interactivity.
- **Functionality**:
    - Displays random letters on the screen.
    - Users click on letters to interact, with specific letters causing game over scenarios.
    - Designed to enhance focus and attention through interactive play.

### Face Landmark Detection

- **Face Landmark Detection**: Integrates MediaPipe's face processing technology to demonstrate real-time face landmark
  detection using a webcam. This feature can be used to study facial expressions and could be extended to analyze
  attention focus based on eye tracking.
- **Files Involved**:
    - `passage.html/images.html`: Serves the webpage for face landmark visualization and interaction.
    - `passage.css/images.css`: Styles the page and the components related to the webcam feed and canvas overlays.
    - `passage.js/images.css`: Integrates with MediaPipe for real-time face detection and displays detected landmarks on
      the
      canvas.
- **Functionality**:
    - Real-time face landmark detection using a webcam.
    - Utilizes MediaPipe FaceLandmarker to track and display facial expressions and movements.
    - Can be extended for studies in attention focus and emotional recognition.

### Passage Reading Tool

- **Passage Reading Tool**: This tool provides a passage reading interface where users can read about ADHD and its
  impact while interacting with dynamic web elements. It aims to provide educational content in an engaging manner.
- **Files Involved**:
    - `passage.html`: Also used for providing an informational passage on ADHD.
    - `passage.css`: Ensures the text and interactive elements are well presented.
    - `passage.js`: Might include interactive annotations or linked studies for deeper understanding (details depend on
      actual implementation).

- **Functionality**:
    - Provides educational content on ADHD.
    - Interactive elements within the text allow users to explore ADHD effects more deeply.

### Images Interaction

- **Images Interaction**: This feature allows users to interact with static images by detecting facial landmarks and
  visualizing them in real-time. It also supports webcam activation for continuous face landmark detection.

- **Files involves**:
    - images.html: Contains the HTML structure for displaying and interacting with various images.
    - images.css: Styles the image containers and positions them on the page.
    - images.js: Manages the detection of facial landmarks within static images and integrates webcam functionalities
      for
    - real-time interaction.
- **Functionality**:
    - Allows users to interact with static images by clicking on them to detect facial landmarks.
    - Supports real-time webcam activation for continuous face landmark detection.
    - Visualizes detected landmarks and facial blendshapes dynamically on both static images and live webcam feeds.

### Main Backend Logic (Python)

- **File Involved**:
    - `main.py`: Contains backend logic for handling data processing or API requests.

- **Functionality**:
    - Handles requests from the frontend and provides necessary data responses.


## JavaScript Libraries

### **`passage.js` Detailed Description**

This file contains the core functionality for the Face Landmark Detection feature.

**1. `createFaceLandmarker` Function:**

- **Purpose:** Initializes the FaceLandmarker model from MediaPipe with specific configurations.
- **Process:** Loads the model using a FilesetResolver for WebAssembly tasks, configures it for GPU acceleration, and
  sets it up to output facial blend shapes. Once loaded, the function makes the demo section visible by removing the '
  invisible' class.
- **Significance:** Ensures the face detection model is ready and optimized before any video processing begins.

**2. `handleClick` Event Listener:**

- **Purpose:** Detects faces in static images on click events.
- **Process:** Switches the running mode from VIDEO to IMAGE, clears previously drawn canvases, and processes the
  clicked image to detect faces and draw landmarks using a dynamically created canvas.
- **Significance:** Allows users to interact with specific images and see real-time face landmark detection results.

**3. `enableCam` Function:**

- **Purpose:** Activates the webcam and starts the video face detection.
- **Process:** Toggles webcam running state, updates button text accordingly, and sets up the video stream as the source
  for the video element. It then calls `predictWebcam` to start detection.
- **Significance:** Provides user control over webcam usage and integrates real-time video processing for educational or
  diagnostic purposes.

**4. `predictWebcam` Function:**

- **Purpose:** Continuously detects and draws face landmarks from the webcam feed.
- **Process:** Adjusts canvas size to match video proportions, checks for changes in video time to avoid unnecessary
  re-detection, and uses MediaPipe to detect and visualize facial landmarks.
- **Significance:** Facilitates continuous and real-time monitoring and visualization of face landmarks, important for
  dynamic interaction and studies related to expressions and attention.

**5. `drawBlendShapes` Function:**

- **Purpose:** Displays facial blend shapes' intensities dynamically.
- **Process:** Filters and displays the blend shapes related to eye movements, updating a list in the HTML dynamically
  to reflect current intensities.
- **Significance:** Enhances understanding of subtle facial expressions, potentially useful in psychological studies or
  UI interaction enhancements.

**6. `logIrisLandmarks` Function:**

**Purpose:** Logs and analyzes eye movement data based on detected iris landmarks to infer focus and attention
directions.

**Process:** Periodically evaluates iris positions using the coordinates of the detected landmarks. This function checks
if the iris is looking to the left, right, or centered and logs this information, potentially triggering alerts or
actions based on the eye movement patterns.

**Significance:** This function is crucial for applications that need to gauge user engagement or detect directional
gaze, such as in educational tools for ADHD, psychological evaluations, or user interface adaptability in real-time
systems.

### **`images.js` Detailed Description**

This file seems to be very similar to `passage.js`, with minor modifications related to how blend shapes and eye
movements are logged and analyzed.

**1. `logIrisLandmarks` Function:**

- **Purpose:** Logs significant eye movement directions based on iris blend shapes.
- **Process:** Periodically checks the intensity of blend shapes that indicate eye direction (looking left or right) and
  provides alerts when significant movement is detected.
- **Significance:** This could be used for interactive applications where user engagement or attention direction is
  critical, such as in driving simulations or psychological tests.

**2. General Functionality:**

- Most other functions (`createFaceLandmarker`, `handleClick`, `enableCam`, `predictWebcam`) mimic the functionality
  described in `passage.js`, focusing on setting up and managing MediaPipe face landmark detection in images and webcam
  feeds.

## Resources
- https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker
- https://codepen.io/mediapipe-preview/pen/OJBVQJm
- https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js
