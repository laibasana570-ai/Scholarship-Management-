// ================================================================
//  Scholarship Eligibility Form — admin.js (ADMIN PAGE)
//  Web Technologies SP26
//
//  This file handles:
//  1. Loading all applications from API
//  2. Filtering by status (approved, pending, rejected)
//  3. Displaying statistics
//  4. Changing application status
//  5. Deleting applications
// ================================================================

// ── API Configuration ──
const API_URL = "http://localhost:3000/scholarships";

// ── DOM Elements ──
const applicationsGrid = document.getElementById("applications-grid");
const statusMsg = document.getElementById("status-msg");
const filterChips = document.querySelectorAll(".chip[data-status]");
const statTotal = document.getElementById("stat-total");
const statApproved = document.getElementById("stat-approved");
const statPending = document.getElementById("stat-pending");
const statRejected = document.getElementById("stat-rejected");

// Variable to store all applications (for filtering)
let allApplications = [];
let activeFilter = "all";

// ================================================================
// 1. LOAD APPLICATIONS FROM API
// ================================================================

/**
 * Fetch all applications from JSON Server
 */
async function loadApplications() {
  try {
    statusMsg.textContent = "Loading applications...";
    statusMsg.classList.add("visible");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load applications");
    }

    allApplications = await response.json();
    console.log("Applications loaded:", allApplications);

    // Render and update stats
    renderApplications(allApplications);
    updateStats(allApplications);
    statusMsg.classList.remove("visible");
  } catch (error) {
    console.error("Error loading applications:", error);
    statusMsg.textContent = "Error loading applications";
    statusMsg.classList.add("error", "visible");
  }
}

// ================================================================
// 2. FILTER APPLICATIONS
// ================================================================

/**
 * Filter applications by status
 * @param {string} status - Status to filter by (all, approved, pending, rejected)
 * @returns {array} - Filtered applications
 */
function filterByStatus(status) {
  if (status === "all") {
    return allApplications;
  }
  return allApplications.filter(app => app.eligibilityStatus === status);
}

/**
 * Update filter UI when user clicks chip
 * @param {HTMLElement} chip - The clicked chip button
 */
function updateFilterUI(chip) {
  // Remove active class from all chips
  filterChips.forEach(c => c.classList.remove("active"));

  // Add active class to clicked chip
  chip.classList.add("active");

  // Store active filter
  activeFilter = chip.getAttribute("data-status");
}

// ================================================================
// 3. RENDER APPLICATIONS AS CARDS
// ================================================================

/**
 * Display applications as cards on the page
 * @param {array} applications - Applications to display
 */
function renderApplications(applications) {
  applicationsGrid.innerHTML = "";

  if (applications.length === 0) {
    applicationsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">
        <p>No applications found</p>
      </div>
    `;
    return;
  }

  applications.forEach(app => {
    const card = document.createElement("div");
    card.className = `application-card ${app.eligibilityStatus}`;

    // Determine badge color based on status
    let badgeClass = `badge-${app.eligibilityStatus}`;

    card.innerHTML = `
      <div class="card-header">
        <span class="badge ${badgeClass}">${app.eligibilityStatus.toUpperCase()}</span>
      </div>

      <div class="card-title">${app.fullName}</div>

      <div class="card-meta">
        <span><strong>Reg No:</strong> ${app.regNo}</span>
        <span><strong>Email:</strong> ${app.email}</span>
        <span><strong>CGPA:</strong> ${app.cgpa}</span>
        <span><strong>Merit:</strong> ${app.meritScore}/100</span>
        <span><strong>Income:</strong> PKR ${app.familyIncome.toLocaleString()}</span>
        <span><strong>Scholarship:</strong> ${app.scholarshipName || "N/A"}</span>
        <span><strong>Amount:</strong> PKR ${app.scholarshipAmount?.toLocaleString() || "0"}</span>
        <span><strong>Submitted:</strong> ${app.submittedAt}</span>
      </div>

      <div class="card-actions">
        ${app.eligibilityStatus === "approved" ? 
          `<button class="btn btn-reject" onclick="changeStatus(${app.id}, 'pending')">Move to Pending</button>` 
          : 
          `<button class="btn btn-approve" onclick="changeStatus(${app.id}, 'approved')">Approve</button>`
        }
        ${app.eligibilityStatus === "rejected" ? 
          `<button class="btn btn-approve" onclick="changeStatus(${app.id}, 'pending')">Reconsider</button>` 
          : 
          `<button class="btn btn-reject" onclick="changeStatus(${app.id}, 'rejected')">Reject</button>`
        }
        <button class="btn btn-delete" onclick="deleteApplication(${app.id})">Delete</button>
      </div>
    `;

    applicationsGrid.appendChild(card);
  });
}

// ================================================================
// 4. UPDATE STATISTICS
// ================================================================

/**
 * Update stat cards with counts
 * @param {array} applications - All applications
 */
function updateStats(applications) {
  const total = applications.length;
  const approved = applications.filter(app => app.eligibilityStatus === "approved").length;
  const pending = applications.filter(app => app.eligibilityStatus === "pending").length;
  const rejected = applications.filter(app => app.eligibilityStatus === "rejected").length;

  // Update stat card values
  statTotal.textContent = total;
  statApproved.textContent = approved;
  statPending.textContent = pending;
  statRejected.textContent = rejected;
}

// ================================================================
// 5. CHANGE APPLICATION STATUS
// ================================================================

/**
 * Update application status in database
 * @param {number} id - Application ID
 * @param {string} newStatus - New status (approved, pending, rejected)
 */
async function changeStatus(id, newStatus) {
  try {
    // Find the application
    const app = allApplications.find(a => a.id === id);
    if (!app) return;

    // Update the object with new status
    app.eligibilityStatus = newStatus;

    // Determine scholarship status based on new status
    if (newStatus === "approved") {
      app.eligibilityStatus = "approved";
    } else if (newStatus === "rejected") {
      app.eligibilityStatus = "rejected";
    } else {
      app.eligibilityStatus = "pending";
    }

    // Send update to server
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(app)
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    console.log("Status updated for application #" + id);

    // Reload applications
    await loadApplications();

    // Re-apply current filter
    const filtered = filterByStatus(activeFilter);
    renderApplications(filtered);
  } catch (error) {
    console.error("Error changing status:", error);
    statusMsg.textContent = "Error updating status";
    statusMsg.classList.add("error", "visible");
  }
}

// ================================================================
// 6. DELETE APPLICATION
// ================================================================

/**
 * Delete an application from database
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

    console.log("Application #" + id + " deleted");

    // Remove from local array
    allApplications = allApplications.filter(app => app.id !== id);

    // Re-render
    const filtered = filterByStatus(activeFilter);
    renderApplications(filtered);
    updateStats(allApplications);
  } catch (error) {
    console.error("Error deleting application:", error);
    statusMsg.textContent = "Error deleting application";
    statusMsg.classList.add("error", "visible");
  }
}

// ================================================================
// 7. FILTER EVENT LISTENERS
// ================================================================

/**
 * Add click handlers to filter chips
 */
filterChips.forEach(chip => {
  chip.addEventListener("click", function() {
    // Update UI
    updateFilterUI(this);

    // Filter and render
    const filtered = filterByStatus(activeFilter);
    renderApplications(filtered);
  });
});

// ================================================================
// 8. INITIALIZE ON PAGE LOAD
// ================================================================

// Load all applications when page loads
loadApplications();
