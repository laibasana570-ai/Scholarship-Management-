document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let cnic = document.getElementById("cnic").value;

    let result = document.getElementById("result");

    // Password check
    if (password !== confirmPassword) {
        result.style.color = "red";
        result.innerHTML = "❌ Passwords do not match";
        return;
    }

    // CNIC check
    let pattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    if (!pattern.test(cnic)) {
        result.style.color = "red";
        result.innerHTML = "❌ Invalid CNIC format";
        return;
    }

    // Gmail check
    if (!email.endsWith("@gmail.com")) {
        result.style.color = "red";
        result.innerHTML = "❌ Use Gmail only";
        return;
    }

    // Success → go next page
    window.location.href = "eligibility.html";
});