document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Animations ---
  const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // --- FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      // Close other open items (optional - if you want only one open at a time)
      /* 
      faqItems.forEach(otherItem => {
          if (otherItem !== item) {
              otherItem.classList.remove('active');
          }
      });
      */

      // Toggle current item
      item.classList.toggle('active');
    });
  });
});


//////////////////////////////////////

// const btn = document.getElementById("openBookingBtn");
// const formContainer = document.getElementById("form-container");

// // 1. Fetch the external HTML file
// fetch('booking-form.html')
//     .then(response => response.text())
//     .then(data => {
//         // Inject the HTML into the container
//         formContainer.innerHTML = data;

//         // Now that the HTML exists on the page, initialize the modal logic
//         initializeModal();
//     })
//     .catch(error => console.error('Error loading the form:', error));

// // 2. Setup all the modal interactions
// function initializeModal() {
//     const modal = document.getElementById("bookingModal");
//     const span = document.querySelector(".close-btn");
//     const datetimeInput = document.getElementById("datetime");
//     const bookingForm = document.getElementById("bookingForm");

//     // Open the modal
//     btn.onclick = function() {
//         modal.style.display = "block";
//         setDateConstraints(datetimeInput); 
//     }

//     // Close the modal with X
//     span.onclick = function() {
//         modal.style.display = "none";
//     }

//     // Close clicking outside the modal
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = "none";
//         }
//     }

//     // Handle form submission
//     bookingForm.addEventListener('submit', function(e) {
//         e.preventDefault(); 
//         alert('Form submitted successfully!');
//         modal.style.display = "none"; 
//         this.reset(); 
//     });
// }

// // 3. Date/Time Restriction Logic
// function setDateConstraints(datetimeInput) {
//     const formatDateTime = (date) => {
//         const pad = n => n < 10 ? '0' + n : n;
//         return date.getFullYear() + '-' +
//                pad(date.getMonth() + 1) + '-' +
//                pad(date.getDate()) + 'T' +
//                pad(date.getHours()) + ':' +
//                pad(date.getMinutes());
//     };

//     const now = new Date();
//     const threeDaysFromNow = new Date();
//     threeDaysFromNow.setDate(now.getDate() + 3);

//     datetimeInput.min = formatDateTime(now);
//     datetimeInput.max = formatDateTime(threeDaysFromNow);
// }


// Get DOM elements
const btn = document.getElementById("openBookingBtn");
const modal = document.getElementById("bookingModal");
const span = document.querySelector(".close-btn");
const datetimeInput = document.getElementById("datetime");
const bookingForm = document.getElementById("bookingForm");
const submitBtn = document.getElementById("submitBtn");

// OTP Elements
const contactInput = document.getElementById("contact");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const otpInput = document.getElementById("otpInput");
const validateOtpBtn = document.getElementById("validateOtpBtn");
const verifiedTick = document.getElementById("verifiedTick");

// --- Modal Open/Close Logic ---

// Open the modal when any CTA button is clicked
const allCtaButtons = document.querySelectorAll('.cta-btn');
allCtaButtons.forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    modal.classList.add('show');
    document.body.classList.add('modal-open');
    setDateConstraints(); // Update time constraints every time it's opened
  });
});

// Close the modal when the 'X' is clicked
span.onclick = function () {
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  resetOtpState();
}

// --- OTP Logic ---

// Step 1: Click "Send OTP"
sendOtpBtn.addEventListener("click", function () {
  if (contactInput.value.length >= 10) {
    // Reveal the OTP input section
    otpSection.style.display = "block";
    sendOtpBtn.textContent = "Resend OTP"; // Change button text
    alert("For testing, your OTP is: 1234");
  } else {
    alert("Please enter a valid 10-digit contact number first.");
  }
});

// Step 2: Click "Validate"
validateOtpBtn.addEventListener("click", function () {
  const enteredOtp = otpInput.value;
  const correctOtp = "1234"; // Hardcoded for testing purposes

  if (enteredOtp === correctOtp) {
    // Success State
    otpSection.style.display = "none"; // Hide OTP section
    sendOtpBtn.style.display = "none"; // Hide Send OTP button
    verifiedTick.style.display = "inline"; // Show green tick
    contactInput.readOnly = true; // Prevent changing the number
    contactInput.style.backgroundColor = "#f0f0f0"; // Grey out input
    submitBtn.disabled = false; // Enable the Submit button!
  } else {
    // Error State
    alert("Incorrect OTP. Please try again.");
  }
});

// --- Form Submission ---
bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Form submitted successfully!');

  // Reset the form and the custom UI states
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  this.reset();
  resetOtpState();
});

// Helper to reset the form UI back to its original state after closing/submitting
function resetOtpState() {
  otpSection.style.display = "none";
  sendOtpBtn.style.display = "inline-block";
  sendOtpBtn.textContent = "Send OTP";
  verifiedTick.style.display = "none";
  contactInput.readOnly = false;
  contactInput.style.backgroundColor = "#f9fbff";
  submitBtn.disabled = true;
  otpInput.value = "";
}


// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    resetOtpState();
  }
}

// --- Date/Time Restriction Logic ---

function setDateConstraints() {
  // Helper function to format date to "YYYY-MM-DDThh:mm" for datetime-local
  const formatDateTime = (date) => {
    const pad = n => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes());
  };

  const now = new Date();

  // Calculate 3 days from now
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  // Set the min and max attributes on the input field
  datetimeInput.min = formatDateTime(now);
  datetimeInput.max = formatDateTime(threeDaysFromNow);
}


// --- capture the appointment details from the form and make and ajax call to the backend to save the appointment in the database ---
$(document).ready(function () {

  $("#submitBtn").click(function () {

    let csrfToken = $("input[name=csrfmiddlewaretoken]").val();

    let data = {
      name: $("#name").val(),
      contactNo: $("#contact").val(),
      email: $("#email").val(),
      productType: $("#product").val(),
      dateTime: $("#datetime").val(),
    };

    $.ajax({
      url: "/book-appointment/",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrfToken
      },

      success: function (response) {
        if (response.success === true) {
          alert("Appointment booked successfully!" + response.message);
        } else {
          alert("Something went wrong! " + response.message);
        }
      },

      error: function (error) {
        console.log(error);
        alert("Error occurred while booking appointment. Please try again later.");
      }
    });

  });

});