// Show status
let status = localStorage.getItem("applicationStatus");

document.getElementById("status").innerHTML =
    status === "Submitted"
    ? "✅ Your application is successfully submitted."
    : "❌ No application found.";

// Back to home
function goHome() {
    window.location.href = "index.html";
}