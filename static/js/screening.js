let totalChecked = 0;
document.addEventListener("DOMContentLoaded", async function () {
  const submitButton = document.getElementById("submit");
  let questions = [];

  try {
    let response = await fetch("/static/screening/questions.json");
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
    let testAResults = 0;
    let testBResults = 0;

    for (let i = 0; i < 6; i++) {
      let question = document.getElementById("question" + (i + 1));
      let severity_value = questions[i].severity_value;

      let checked = question.querySelector('input[type="radio"]:checked');
      if (checked.value >= 5 - severity_value) {
        totalChecked++;
      }
    }

    for (let i = 6; i < 18; i++) {
      let question = document.getElementById("question" + (i + 1));
      let severity_value = questions[i].severity_value;

      let checked = question.querySelector('input[type="radio"]:checked');
      if (checked.value >= 5 - severity_value) {
        totalBChecked++;
      }
    }

    console.log("Test Results: ", totalChecked, totalBChecked);

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
