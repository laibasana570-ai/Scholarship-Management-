// ================================================================
//  Scholarship Eligibility Form — app.js (USER PAGE)
//  Web Technologies SP26
//
//  This file handles:
//  1. Form submission and validation
//  2. Eligibility checking logic
//  3. API calls to JSON Server
//  4. Display of applications list
//  5. Edit/Delete functionality
// ================================================================

// ── API Configuration ──
const API_URL = "http://localhost:3000/scholarships";

// ── DOM Elements (get references to HTML elements) ──
const form = document.getElementById("scholarship-form");
const clearBtn = document.getElementById("clear-btn");
const resultBox = document.getElementById("result-box");
const resultContent = document.getElementById("result-content");
const applicationsList = document.getElementById("applications-list");
const statusMsg = document.getElementById("status-msg");

// Form input fields
const regNoInput = document.getElementById("reg-no");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const cgpaInput = document.getElementById("cgpa");
const meritScoreInput = document.getElementById("merit-score");
const familyIncomeInput = document.getElementById("family-income");

// Error message elements
const errorElements = {
  "reg-no": document.getElementById("err-reg-no"),
  "full-name": document.getElementById("err-full-name"),
  "email": document.getElementById("err-email"),
  "cgpa": document.getElementById("err-cgpa"),
  "merit-score": document.getElementById("err-merit-score"),
  "family-income": document.getElementById("err-family-income"),
};

// ── Eligibility Rules ──
// These are the rules for scholarship eligibility
// You can modify these thresholds as needed
const ELIGIBILITY_RULES = {
  FULL: {
    minCGPA: 3.5,
    minMerit: 80,
    maxIncome: 500000,
    amount: 100000,
    name: "Full Scholarship"
  },
  HALF: {
    minCGPA: 3.0,
    minMerit: 70,
    maxIncome: 500000,
    amount: 50000,
    name: "Half Scholarship"
  }
};

// ================================================================
// 1. FORM VALIDATION FUNCTIONS
// ================================================================

/**
 * Clear all error messages from the form
 */
function clearErrors() {
  Object.values(errorElements).forEach(element => {
    element.textContent = "";
    element.classList.remove("visible");
  });
  
  // Clear error styling from inputs
  [regNoInput, fullNameInput, emailInput, cgpaInput, meritScoreInput, familyIncomeInput]
    .forEach(input => input.classList.remove("input-error"));
}

/**
 * Show an error message for a specific field
 * @param {string} fieldId - The ID of the field
 * @param {string} message - The error message to show
 */
function showError(fieldId, message) {
  const errorElement = errorElements[fieldId];
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("visible");
    document.getElementById(fieldId).classList.add("input-error");
  }
}

/**
 * Validate form inputs before submission
 * @returns {boolean} - True if all validations pass
 */
function validateForm() {
  clearErrors();
  let isValid = true;

  // Check Registration Number
  if (!regNoInput.value.trim()) {
    showError("reg-no", "Registration number is required");
    isValid = false;
  } else if (!/^[A-Z0-9\-]+$/.test(regNoInput.value)) {
    showError("reg-no", "Invalid format (use uppercase letters, numbers, and hyphens)");
    isValid = false;
  }

  // Check Full Name
  if (!fullNameInput.value.trim()) {
    showError("full-name", "Full name is required");
    isValid = false;
  } else if (fullNameInput.value.length < 3) {
    showError("full-name", "Name must be at least 3 characters");
    isValid = false;
  }

  // Check Email
  if (!emailInput.value.trim()) {
    showError("email", "Email is required");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    showError("email", "Please enter a valid email address");
    isValid = false;
  }

  // Check CGPA
  const cgpa = parseFloat(cgpaInput.value);
  if (!cgpaInput.value.trim()) {
    showError("cgpa", "CGPA is required");
    isValid = false;
  } else if (cgpa < 0 || cgpa > 4) {
    showError("cgpa", "CGPA must be between 0 and 4.0");
    isValid = false;
  }

  // Check Merit Score
  const meritScore = parseFloat(meritScoreInput.value);
  if (!meritScoreInput.value.trim()) {
    showError("merit-score", "Merit score is required");
    isValid = false;
  } else if (meritScore < 0 || meritScore > 100) {
    showError("merit-score", "Merit score must be between 0 and 100");
    isValid = false;
  }

  // Check Family Income
  const income = parseFloat(familyIncomeInput.value);
  if (!familyIncomeInput.value.trim()) {
    showError("family-income", "Family income is required");
    isValid = false;
  } else if (income < 0) {
    showError("family-income", "Family income cannot be negative");
    isValid = false;
  }

  return isValid;
}

// ================================================================
// 2. ELIGIBILITY CHECKING LOGIC
// ================================================================

/**
 * Check if student is eligible for scholarship
 * and determine scholarship type and amount
 * @param {number} cgpa - Student's CGPA
 * @param {number} meritScore - Student's merit score
 * @param {number} familyIncome - Student's family annual income
 * @returns {object} - Eligibility result object
 */
function checkEligibility(cgpa, meritScore, familyIncome) {
  // Check for FULL Scholarship first (highest requirement)
  if (cgpa >= ELIGIBILITY_RULES.FULL.minCGPA && 
      meritScore >= ELIGIBILITY_RULES.FULL.minMerit && 
      familyIncome <= ELIGIBILITY_RULES.FULL.maxIncome) {
    return {
      eligible: true,
      type: "approved",
      scholarshipName: ELIGIBILITY_RULES.FULL.name,
      amount: ELIGIBILITY_RULES.FULL.amount
    };
  }

  // Check for HALF Scholarship (lower requirements)
  if (cgpa >= ELIGIBILITY_RULES.HALF.minCGPA && 
      meritScore >= ELIGIBILITY_RULES.HALF.minMerit && 
      familyIncome <= ELIGIBILITY_RULES.HALF.maxIncome) {
    return {
      eligible: true,
      type: "approved",
      scholarshipName: ELIGIBILITY_RULES.HALF.name,
      amount: ELIGIBILITY_RULES.HALF.amount
    };
  }

  // Not eligible
  return {
    eligible: false,
    type: "rejected",
    scholarshipName: "Not Eligible",
    amount: 0
  };
}

/**
 * Display eligibility result to user
 * @param {object} result - Result object from checkEligibility()
 */
function displayResult(result) {
  let resultHTML = `<p><strong>Status:</strong> ${result.scholarshipName}</p>`;
  
  if (result.eligible) {
    resultHTML += `<div class="result-eligible">✓ Congratulations! You are eligible for ${result.scholarshipName} (PKR ${result.amount.toLocaleString()})</div>`;
  } else {
    resultHTML += `<div class="result-not-eligible">✗ Unfortunately, you do not meet the eligibility criteria at this time.</div>`;
  }

  resultContent.innerHTML = resultHTML;
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ================================================================
// 3. API FUNCTIONS (Database Operations)
// ================================================================

/**
 * Load all applications for the current user
 * In a real app, you'd filter by user ID/email
 */
async function loadApplications() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      statusMsg.textContent = "Error loading applications";
      statusMsg.classList.add("error", "visible");
      return;
    }

    const applications = await response.json();
    renderApplications(applications);
    statusMsg.classList.remove("visible");
  } catch (error) {
    console.error("Error loading applications:", error);
    statusMsg.textContent = "Failed to load applications";
    statusMsg.classList.add("error", "visible");
  }
}

/**
 * Render applications list on the page
 * @param {array} applications - Array of application objects
 */
function renderApplications(applications) {
  applicationsList.innerHTML = "";

  if (applications.length === 0) {
    applicationsList.innerHTML = "<li style='text-align: center; padding: 20px;'>No applications yet. Submit the form to get started!</li>";
    return;
  }

  applications.forEach(app => {
    const li = document.createElement("li");
    li.className = `app-item app-${app.eligibilityStatus}`;
    
    li.innerHTML = `
      <div class="app-info">
        <strong>${app.fullName}</strong>
        <span>${app.regNo} • ${app.scholarshipName || "Pending"}</span>
      </div>
      <div class="app-actions">
        <button class="btn btn-edit" data-id="${app.id}" onclick="editApplication(${app.id})">Edit</button>
        <button class="btn btn-delete" data-id="${app.id}" onclick="deleteApplication(${app.id})">Delete</button>
      </div>
    `;

    applicationsList.appendChild(li);
  });
}

/**
 * Submit new application to database
 * @param {object} applicationData - Object with all form data
 */
async function submitApplication(applicationData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      throw new Error("Failed to submit application");
    }

    const newApp = await response.json();
    console.log("Application submitted:", newApp);

    // Clear form and reload applications
    form.reset();
    resultBox.classList.add("hidden");
    await loadApplications();
  } catch (error) {
    console.error("Error submitting application:", error);
    statusMsg.textContent = "Error submitting application";
    statusMsg.classList.add("error", "visible");
  }
}

/**
 * Delete an application
 * @param {number} id - Application ID
 */
async function deleteApplication(id) {
  if (!confirm("Are you sure you want to delete this application?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }

    console.log("Application deleted");
    await loadApplications();
  } catch (error) {
    console.error("Error deleting application:", error);
    statusMsg.textContent = "Error deleting application";
    statusMsg.classList.add("error", "visible");
  }
}

/**
 * Edit an application (placeholder - shows alert)
 * In full implementation, would load form with existing data
 */
function editApplication(id) {
  alert("Edit functionality: Load application #" + id + " into form (to be implemented)");
}

// ================================================================
// 4. FORM EVENT LISTENERS
// ================================================================

/**
 * Handle form submission
 */
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  // 1. Validate all inputs
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }

  // 2. Get form values
  const cgpa = parseFloat(cgpaInput.value);
  const meritScore = parseFloat(meritScoreInput.value);
  const familyIncome = parseFloat(familyIncomeInput.value);

  // 3. Check eligibility
  const eligibilityResult = checkEligibility(cgpa, meritScore, familyIncome);

  // 4. Display result
  displayResult(eligibilityResult);

  // 5. Prepare data object
  const applicationData = {
    regNo: regNoInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    cgpa: cgpa,
    meritScore: meritScore,
    familyIncome: familyIncome,
    scholarshipName: eligibilityResult.scholarshipName,
    scholarshipAmount: eligibilityResult.amount,
    eligibilityStatus: eligibilityResult.type,
    submittedAt: new Date().toISOString().split("T")[0]
  };

  // 6. Submit to database
  await submitApplication(applicationData);
});

/**
 * Handle clear button
 */
clearBtn.addEventListener("click", function() {
  form.reset();
  clearErrors();
  resultBox.classList.add("hidden");
});

// ================================================================
// 5. INITIALIZE ON PAGE LOAD
// ================================================================

// Load existing applications when page loads
loadApplications();
