function showInitialInstructions() {
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
    text: "Choose the difficulty level for the screening",
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
      showSelectedInstructions(selectedDifficulty);
    }
  });
}
function showSelectedInstructions(selectedDifficulty) {
  let instructions = "";

  switch(selectedDifficulty) {
    case "child":
      instructions = "Please have a parent or guardian answer the questions below, rating yourself on each of the criteria. As you answer each question, click on box that best describes how you have felt and conducted yourself over the past 6 months.";
      break;
    case "teen":
      instructions = "Please have a parent or guardian answer the questions below, rating yourself on each of the criteria. As you answer each question, click on box that best describes how you have felt and conducted yourself over the past 6 months.";
      break;
    case "adult":
      instructions = "Please answer the questions below, rating yourself on each of the criteria. As you answer each question, click on box that best describes how you have felt and conducted yourself over the past 6 months.";
      break;
    default:
      instructions = "Please answer the questions below, rating yourself on each of the criteria. As you answer each question, click on box that best describes how you have felt and conducted yourself over the past 6 months.";
      break;
  };

  swal({
    title: "ADHD Screening Test",
    text: instructions,
    icon: "info",
    button: "Start Survey",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
      onTestStart(selectedDifficulty);
    }
  });
}

async function onTestStart(selectedDifficulty) {
  const submitButton = document.getElementById("submit");
  let questions = [];
  try {
      let response = await fetch("/static/testing/questions.json");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Select questions based on the chosen difficulty
      switch (selectedDifficulty) {
        case "child":
          questions = data.child;
          break;
        case "teen":
          questions = data.teen;
          break;
        case "adult":
          questions = data.adult;
          break;
        default:
          throw new Error("Invalid difficulty selected");
      }

      displayQuestions(selectedDifficulty)
      console.log("Questions loaded:", questions);
    } catch (error) {
      console.error("Error fetching or parsing questions:", error);
  }

function displayQuestions(difficulty) {
  const questionContainer = document.getElementById(`${difficulty}Questions`);
  console.log("Question Container: ", questionContainer);
  questionContainer.style.display = "block";
  if (!questionContainer) {
    console.error(`Question container not found for difficulty: ${difficulty}`);
    return;
  }
}
  
  
  submitButton.addEventListener("click", function () {
    let totalChecked = 0;
    let totalBChecked = 0;
    let testAResults = false;
    let testBResults = false;

    for (let i = 0; i < 6; i++) {
      let question = document.getElementById("question" + (i + 1));
      let severity_value = questions[i].severity_value;

      let checked = question.querySelector('input[type="radio"]:checked');
      if (checked.value > 5 - severity_value) {
        totalChecked++;
      }
    }

    for (let i = 6; i < 18; i++) {
      let question = document.getElementById("question" + (i + 1));
      let severity_value = questions[i].severity_value;

      let checked = question.querySelector('input[type="radio"]:checked');
      if (checked.value > 5 - severity_value) {
        totalBChecked++;
      }
    }

    if (totalChecked >= 4) {
      testAResults = true;
    }

    if (totalBChecked >= 8) {
      testBResults = true;
    }

    // Score Part A. If four or more marks appear in the darkly shaded boxes within Part A then the
    // patient has symptoms highly consistent with ADHD in adults and further investigation is
    // warranted.

    console.log("Test Results: ", testAResults, testBResults);

    swal({
      title: "Testing Completed",
      icon: "success",
      button: "Generate Report",
    }).then((isConfirm) => {
      if (isConfirm) {
        window.location.href = "screening";
      }
    });
  });
}

showInitialInstructions();
