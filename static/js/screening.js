function showInitialInstructions() {
  swal({
    title: "ADHD Screening Test",
    text: "Please answer the questions below, rating yourself on each of the criteria. As you answer each question, click on box that best describes how you have felt and conducted yourself over the past 6 months.",
    icon: "info",
    button: "Start Survey",
    closeOnClickOutside: false,
  }).then((isConfirm) => {
    if (isConfirm) {
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const submitButton = document.getElementById("submit");
  let questions = [];

  try {
    let response = await fetch("/static/testing/questions.json");

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    questions = data;
  } catch (error) {
    console.error("Error fetching or parsing questions:", error);
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
}); // Listen for if the HTMl content has loaded onto the page.

showInitialInstructions();
