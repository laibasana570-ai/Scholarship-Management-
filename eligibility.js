document.getElementById("eligibilityForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let qualification = document.getElementById("qualification").value;
    let marks = parseFloat(document.getElementById("marks").value);
    let previous = document.getElementById("previous").value;

    let result = document.getElementById("result");

    let allowed = ["Intermediate", "BS", "MPhil", "PhD"];

    if (previous === "Yes") {
        result.style.color = "red";
        result.innerHTML = "❌ Already received scholarship";
        return;
    }

    if (marks >= 75 && allowed.includes(qualification)) {
        result.style.color = "green";
        result.innerHTML = "✅ You are eligible!";
        
        // move to next page after 1 sec
        setTimeout(() => {
            window.location.href = "result.html";
        }, 1000);

    } else {
        result.style.color = "red";
        result.innerHTML = "❌ Not eligible";
    }

    setTimeout(() => {
    window.location.href = "documents.html";
     }, 1000);

});