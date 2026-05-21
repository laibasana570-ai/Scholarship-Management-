document.getElementById("docForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let matric = document.getElementById("matric").files.length;
    let inter = document.getElementById("inter").files.length;
    let cnic = document.getElementById("cnicDoc").files.length;
    let domicile = document.getElementById("domicile").files.length;

    let result = document.getElementById("result");

    if (!matric || !inter || !cnic || !domicile) {
        result.style.color = "red";
        result.innerHTML = "❌ Please upload all required documents";
        return;
    }

    // Save submission status
    localStorage.setItem("applicationStatus", "Submitted");

    // Redirect
    window.location.href = "confirmation.html";
});