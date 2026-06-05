# Scholarship Eligibility Form Project

A complete web application for managing scholarship applications with eligibility checking, built using JavaScript, HTML, CSS, and JSON Server.

## Project Structure

```
scholarship-eligibility-form/
├── index.html          # User page - submit applications
├── admin.html          # Admin page - manage applications
├── app.js              # User page logic
├── admin.js            # Admin page logic
├── style.css           # Styling for both pages
├── db.json             # JSON Server database
└── README.md           # This file
```

## Features

### User Page (index.html)
- ✅ Form to submit scholarship application
- ✅ Real-time form validation with error messages
- ✅ Automatic eligibility checking
- ✅ View scholarship result (eligible/not eligible)
- ✅ View list of own applications
- ✅ Edit/Delete functionality

### Admin Page (admin.html)
- ✅ View all scholarship applications
- ✅ Filter by status (All, Approved, Pending, Rejected)
- ✅ Statistics dashboard (Total, Approved, Pending, Rejected)
- ✅ Change application status
- ✅ Delete applications
- ✅ Card-based application display

## Eligibility Criteria

### Full Scholarship (100,000 PKR)
- CGPA ≥ 3.5
- Merit Score ≥ 80
- Family Income ≤ 500,000 PKR

### Half Scholarship (50,000 PKR)
- CGPA ≥ 3.0
- Merit Score ≥ 70
- Family Income ≤ 500,000 PKR

### Not Eligible
- CGPA < 3.0 OR Merit Score < 70 OR Income > 500,000 PKR

## How to Run

### Step 1: Setup JSON Server
Make sure you've already installed Node.js and npm. Follow these commands:

```bash
# Navigate to your project folder
cd path/to/your/scholarship-form

# Install JSON Server (if not already installed)
npm install json-server

# Start JSON Server
npx json-server --watch db.json
```

You should see:
```
  ✓ Loaded database from db.json
  ✓ Resources
    scholarships

  ➜  Local:   http://localhost:3000
```

**Keep this terminal open!** The server must run in the background.

### Step 2: Open in Browser
In a new terminal/file explorer:

```bash
# Open the user page (index.html)
# You can drag-drop the file into browser, or use:
# Live Server (VS Code extension) or similar
```

Or simply:
- Navigate to the folder containing index.html
- Double-click index.html to open in browser
- Or use VS Code Live Server

### Step 3: Test the Application

**User Page:**
1. Fill the form with student information
2. Click "Submit Application"
3. See eligibility result
4. View submitted applications in the list

**Admin Page:**
1. Click "Admin" link in navigation
2. See statistics and all applications
3. Filter by status using chips
4. Click buttons to approve, reject, or delete applications

## Code Explanations (for your viva)

### Form Validation (app.js)
```javascript
// clearErrors() - Removes all error messages
// showError(fieldId, message) - Shows error for specific field
// validateForm() - Checks all inputs before submission
```

### Eligibility Logic (app.js)
```javascript
// checkEligibility() - Main function that:
// 1. Checks if CGPA, Merit, and Income meet Full Scholarship criteria
// 2. If not, checks Half Scholarship criteria
// 3. Returns eligibility result with scholarship type and amount
```

**Pattern Used:**
```javascript
if (condition1 && condition2 && condition3) {
  // Full Scholarship
  return { eligible: true, amount: 100000 };
} else if (condition4 && condition5 && condition6) {
  // Half Scholarship
  return { eligible: true, amount: 50000 };
} else {
  // Not Eligible
  return { eligible: false, amount: 0 };
}
```

### API Calls (app.js & admin.js)
```javascript
// GET - Load applications
const response = await fetch(API_URL);
const data = await response.json();

// POST - Submit new application
await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(applicationData)
});

// PUT - Update application status
await fetch(`${API_URL}/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updatedData)
});

// DELETE - Remove application
await fetch(`${API_URL}/${id}`, { method: "DELETE" });
```

### Filtering (admin.js)
```javascript
// filterByStatus() - Returns applications matching status
// Example: filterByStatus("approved") returns only approved apps
// Used with Array.filter() method: array.filter(item => item.status === "approved")
```

### Rendering Lists (app.js & admin.js)
```javascript
// renderApplications() - Takes array of applications
// Loops through each application
// Creates HTML for each one using innerHTML or createElement()
// Adds buttons with onclick handlers
```

## Key JavaScript Concepts Used

1. **Variables & Constants** - Store form data, API URL
2. **Objects** - Application data structure
3. **Arrays** - Store multiple applications
4. **Functions** - Reusable code blocks (validation, API calls, filtering)
5. **Async/Await** - Handle API calls asynchronously
6. **Event Listeners** - Respond to user actions (form submit, button clicks)
7. **DOM Manipulation** - Update HTML based on data
8. **Conditional Logic (if/else)** - Check eligibility criteria
9. **Loop (forEach)** - Render lists of applications
10. **Try/Catch** - Error handling for API calls

## Database Structure (db.json)

```json
{
  "scholarships": [
    {
      "id": 1,                           // Unique identifier
      "regNo": "IUB-BSCS-21-001",       // Registration number
      "fullName": "Ahmed Ali",           // Student name
      "email": "ahmed@iub.edu.pk",       // Email
      "cgpa": 3.7,                       // CGPA (0-4.0)
      "meritScore": 88,                  // Merit score (0-100)
      "familyIncome": 400000,            // Annual income in PKR
      "scholarshipName": "Full",         // Result
      "scholarshipAmount": 100000,       // Amount in PKR
      "eligibilityStatus": "approved",   // Status
      "submittedAt": "2026-06-01"        // Submission date
    }
  ]
}
```

## Troubleshooting

### "Cannot connect to localhost:3000"
- Make sure JSON Server is running
- Check the terminal where you ran `npx json-server --watch db.json`
- Restart JSON Server if needed

### Applications not loading
- Open DevTools (F12) → Console tab
- Check for error messages
- Make sure API_URL in app.js matches your JSON Server URL

### Form validation not working
- Check that input IDs in HTML match those in JavaScript
- Make sure error message elements exist in HTML
- Check browser console for JavaScript errors

## For Your Viva

### Key Points to Explain:

1. **Architecture**: Two-page system (User + Admin), separate JavaScript files
2. **Validation**: Check inputs before processing
3. **Eligibility Logic**: If-else conditions to determine scholarship type
4. **Database**: JSON Server stores and retrieves data
5. **Filtering**: Admin can filter by status
6. **CRUD Operations**:
   - **C**reate: Submit new application
   - **R**ead: Load and display applications
   - **U**pdate: Change application status
   - **D**elete: Remove application

### Practice Explaining:

- **User Flow**: Student fills form → Validation → Eligibility check → Save to database → See result
- **Admin Flow**: Load all apps → Filter by status → View details → Change status or delete
- **Most Important Concept**: The `checkEligibility()` function that uses conditional logic to determine scholarship type

## Learning Outcomes

By building this project, you've learned:
- ✅ Form validation and error handling
- ✅ Conditional logic (if/else/nested conditions)
- ✅ API integration (GET, POST, PUT, DELETE)
- ✅ Array operations (map, filter, forEach)
- ✅ DOM manipulation (innerHTML, querySelector, classList)
- ✅ Event handling (form submit, button clicks)
- ✅ Async programming (async/await, fetch)
- ✅ Data persistence (JSON Server database)
- ✅ UI/UX (responsive layout, user feedback)
- ✅ Code organization (separating concerns)

---

**Good luck with your viva!** 🎓

Feel free to ask if you need help understanding any part of the code.
