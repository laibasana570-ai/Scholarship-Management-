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

function filterByStatus(status) {
  if (status === "all") {
    return allApplications;
  }
  return allApplications.filter(app => app.eligibilityStatus === status);
}

function updateFilterUI(chip) {
  filterChips.forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  activeFilter = chip.getAttribute("data-status");
}

// ================================================================
// 3. RENDER APPLICATIONS AS CARDS
// ================================================================

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
    card.className = "application-card " + app.eligibilityStatus;

    let badgeClass = "badge-" + app.eligibilityStatus;

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
        <span><strong>Amount:</strong> PKR ${app.scholarshipAmount ? app.scholarshipAmount.toLocaleString() : "0"}</span>
        <span><strong>Submitted:</strong> ${app.submittedAt}</span>
      </div>

      <div class="card-actions">
        <button class="btn btn-approve action-btn" data-action="approve" data-id="${app.id}">Approve</button>
        <button class="btn btn-warning action-btn" data-action="pending" data-id="${app.id}">To Pending</button>
        <button class="btn btn-reject action-btn" data-action="reject" data-id="${app.id}">Reject</button>
        <button class="btn btn-delete action-btn" data-action="delete" data-id="${app.id}">Delete</button>
      </div>
    `;

    applicationsGrid.appendChild(card);
  });

  // Add event listeners to action buttons
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const action = this.getAttribute("data-action");
      const id = this.getAttribute("data-id");

      if (action === "approve") {
        changeStatus(id, "approved");
      } else if (action === "pending") {
        changeStatus(id, "pending");
      } else if (action === "reject") {
        changeStatus(id, "rejected");
      } else if (action === "delete") {
        deleteApplication(id);
      }
    });
  });
}

// ================================================================
// 4. UPDATE STATISTICS
// ================================================================

function updateStats(applications) {
  const total = applications.length;
  const approved = applications.filter(app => app.eligibilityStatus === "approved").length;
  const pending = applications.filter(app => app.eligibilityStatus === "pending").length;
  const rejected = applications.filter(app => app.eligibilityStatus === "rejected").length;

  statTotal.textContent = total;
  statApproved.textContent = approved;
  statPending.textContent = pending;
  statRejected.textContent = rejected;
}

// ================================================================
// 5. CHANGE APPLICATION STATUS
// ================================================================

async function changeStatus(id, newStatus) {
  try {
    id = String(id);
    console.log("Changing status for app " + id + " to " + newStatus);
    
    const app = allApplications.find(a => String(a.id) === id);
    if (!app) {
      console.error("Application not found with id:", id);
      return;
    }

    app.eligibilityStatus = newStatus;

    const response = await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(app)
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    updateStats(allApplications);
    
    const filtered = filterByStatus(activeFilter);
    renderApplications(filtered);
    
    statusMsg.textContent = "Status updated to " + newStatus.toUpperCase() + " successfully!";
    statusMsg.classList.remove("error");
    statusMsg.classList.add("visible");
    
    setTimeout(() => {
      statusMsg.classList.remove("visible");
    }, 3000);
    
  } catch (error) {
    console.error("Error changing status:", error);
    statusMsg.textContent = "Error updating status";
    statusMsg.classList.add("error", "visible");
  }
}

// ================================================================
// 6. DELETE APPLICATION
// ================================================================

async function deleteApplication(id) {
  if (!confirm("Are you sure you want to delete this application?")) {
    return;
  }

  try {
    id = String(id);
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }

    allApplications = allApplications.filter(app => String(app.id) !== id);

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

filterChips.forEach(chip => {
  chip.addEventListener("click", function() {
    filterChips.forEach(c => c.classList.remove("active"));
    this.classList.add("active");
    activeFilter = this.getAttribute("data-status");
    const filtered = filterByStatus(activeFilter);
    renderApplications(filtered);
  });
});

// ================================================================
// 8. INITIALIZE ON PAGE LOAD
// ================================================================

loadApplications();