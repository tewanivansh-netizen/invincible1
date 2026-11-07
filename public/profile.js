// ===== Update Modal Elements =====
const updateModal = document.getElementById("updateBookingModal");
const updateModalCloseBtn = updateModal.querySelector(".close-btn");
const updateParticipantsButtonsDiv = document.getElementById(
  "updateParticipantsButtons"
);
const updateParticipantsFormsDiv = document.getElementById(
  "updateParticipantsForms"
);
const updateBookingIdInput = document.getElementById("updateBookingId");

// ===== Function to open update modal with prefilled data =====
function openUpdateModal(bookingData) {
  updateModal.style.display = "block";

  // Set booking id
  updateBookingIdInput.value = bookingData.booking_id;
  document.getElementById("updateBookingForm").action = `/update-booking/${bookingData.booking_id}?_method=PATCH`;

  // Clear old buttons + forms (important fix)
  updateParticipantsButtonsDiv.innerHTML = "";
  updateParticipantsFormsDiv.innerHTML = ""; // 🟢 added line to prevent duplicate forms

  // Create participant selector 6 buttons 
  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${i}`;

    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#updateParticipantsButtons button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      generateUpdateForms(i, bookingData.participants);
    });

    updateParticipantsButtonsDiv.appendChild(btn);
  }

  // Default show participants already booked
  let count = bookingData.participants.length;
  generateUpdateForms(count, bookingData.participants);
  updateParticipantsButtonsDiv
    .querySelectorAll("button")
    [count - 1].classList.add("active");
}

// ===== Generate Update Forms with prefilled values =====
function generateUpdateForms(count, participantsData) {
  updateParticipantsFormsDiv.innerHTML = ""; // ensure fresh render

  for (let i = 0; i < count; i++) {
    const p = participantsData[i] || {};

    updateParticipantsFormsDiv.innerHTML += `
      <div class="participant-form">
        <h3>Participant (${i + 1})</h3>

        <label>First Name</label>
        <input type="text" name="firstName[]" 
               value="${p.first_name || ""}" 
               placeholder="First Name ${i + 1}" required>

        <label>Last Name</label>
        <input type="text" name="lastName[]" 
               value="${p.last_name || ""}" 
               placeholder="Last Name ${i + 1}" required>

        <label>Mobile</label>
        <input type="text" name="phone[]" 
               value="${p.phone || ""}" 
               placeholder="Mobile" required>

        <input type="date" name="birthdate[]" 
       value="${p.birthdate ? formatDate(p.birthdate) : ''}" 
       required>



        <label>Gender</label>
        <select name="gender[]" required>
          <option value="">Select Gender</option>
          <option value="Male" ${
            p.gender === "Male" ? "selected" : ""
          }>Male</option>
          <option value="Female" ${
            p.gender === "Female" ? "selected" : ""
          }>Female</option>
        </select>

        <input type="hidden" name="participantId[]" value="${
          p.participant_id || ""
        }">
        <hr>
      </div>
    `;
  }
}

// ===== Close Modal =====
updateModalCloseBtn.addEventListener("click", () => {
  updateModal.style.display = "none";
});

// ===== Example usage: When user clicks "Update" button on row =====
document.querySelectorAll(".update-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const bookingData = {
      booking_id: btn.dataset.bookingId,
      title: btn.dataset.title,
      date: btn.dataset.date,
      price: btn.dataset.price,
      participants: JSON.parse(btn.dataset.participants || "[]"),
    };

    openUpdateModal(bookingData);
  });
});

// ===== Utility to format date for input[type=date] =====
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
