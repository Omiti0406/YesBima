document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Animations ---
  const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) { reveal.classList.add('active'); }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // --- MODAL & OTP LOGIC ---
  const modal = document.getElementById("bookingModal");
  const openBtns = document.querySelectorAll(".openBookingBtn");
  const closeBtn = document.querySelector(".close-btn");
  const datetimeInput = document.getElementById("datetime");
  const bookingForm = document.getElementById("bookingForm");
  const submitBtn = document.getElementById("submitBtn");

  const contactInput = document.getElementById("contact");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const otpSection = document.getElementById("otpSection");
  const otpInput = document.getElementById("otpInput");
  const validateOtpBtn = document.getElementById("validateOtpBtn");
  const verifiedTick = document.getElementById("verifiedTick");
  const contactError = document.getElementById("contactError");
  const otpError = document.getElementById("otpError");

  // Open Modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      setDateConstraints();
    });
  });

  // Close Modal
  const closeModal = () => {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    setTimeout(resetOtpState, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Send OTP
  // sendOtpBtn.addEventListener("click", () => {
  //   const contactValue = contactInput.value.trim();
  //   contactInput.classList.remove("input-error");
  //   contactError.textContent = "";

  //   if (/^[0-9]{10}$/.test(contactValue)) {
  //     otpSection.style.display = "block";
  //     sendOtpBtn.textContent = "Resend OTP";
  //     alert("Otp sent successfully!");
  //   } else {
  //     contactInput.classList.add("input-error");
  //     contactError.textContent = "Please enter a valid 10-digit number";
  //   }
  // });

  // // Validate OTP
  // validateOtpBtn.addEventListener("click", () => {
  //   const enteredOtp = otpInput.value.trim();
  //   otpInput.classList.remove("input-error");
  //   otpError.textContent = "";

  //   // UI Validation (Replace with Firebase in prod)
  //   if (enteredOtp.length > 0) {
  //     otpSection.style.display = "none";
  //     sendOtpBtn.style.display = "none";
  //     verifiedTick.style.display = "inline-flex";

  //     contactInput.readOnly = true;
  //     contactInput.style.opacity = "0.5";
  //     submitBtn.disabled = false;
  //   } else {
  //     otpInput.classList.add("input-error");
  //     otpError.textContent = "Please enter the OTP";
  //   }
  // });


  // 1. Create a variable to hold the Firebase confirmation result
let windowConfirmationResult = null; 

// --- 2. SEND OTP LOGIC ---
sendOtpBtn.addEventListener("click", () => {
    const contactValue = contactInput.value.trim();
    contactInput.classList.remove("input-error");
    contactError.textContent = "";

    if (/^[0-9]{10}$/.test(contactValue)) {
        // Firebase requires the E.164 format with a country code (e.g., +91 for India)
        const phoneNumber = "+91" + contactValue; 
        const appVerifier = window.recaptchaVerifier;

        // Disable button to prevent multiple clicks while sending
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = "Sending...";

        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent successfully. Store the confirmationResult.
                windowConfirmationResult = confirmationResult;
                
                // Update UI
                otpSection.style.display = "block";
                sendOtpBtn.textContent = "Resend OTP";
                sendOtpBtn.disabled = false;
            })
            .catch((error) => {
                // Handle Errors (e.g., reCAPTCHA failed, invalid number)
                console.error("Error during signInWithPhoneNumber", error);
                contactInput.classList.add("input-error");
                contactError.textContent = "Failed to send OTP. Please try again.";
                
                // Reset button and reCAPTCHA
                sendOtpBtn.textContent = "Get OTP";
                sendOtpBtn.disabled = false;
                if (window.recaptchaVerifier) window.recaptchaVerifier.render();
            });

    } else {
        contactInput.classList.add("input-error");
        contactError.textContent = "Please enter a valid 10-digit number";
    }
});

// --- 3. VALIDATE OTP LOGIC ---
validateOtpBtn.addEventListener("click", () => {
    const enteredOtp = otpInput.value.trim();
    otpInput.classList.remove("input-error");
    otpError.textContent = "";

    if (enteredOtp.length === 6) { // Firebase OTPs are 6 digits
        // Change button state while verifying
        validateOtpBtn.disabled = true;
        validateOtpBtn.textContent = "Verifying...";

        // Use the confirmationResult saved from the previous step
        windowConfirmationResult.confirm(enteredOtp)
            .then((result) => {
                // OTP verified successfully
                const user = result.user;
                console.log("User successfully verified:", user.uid);

                // Update UI for success
                otpSection.style.display = "none";
                sendOtpBtn.style.display = "none";
                verifiedTick.style.display = "inline-flex";

                contactInput.readOnly = true;
                contactInput.style.opacity = "0.5";
                submitBtn.disabled = false;
                validateOtpBtn.textContent = "Verify";
                validateOtpBtn.disabled = false;
            })
            .catch((error) => {
                // OTP was incorrect or expired
                console.error("Error verifying OTP", error);
                otpInput.classList.add("input-error");
                otpError.textContent = "Invalid OTP. Please try again.";
                
                validateOtpBtn.textContent = "Verify";
                validateOtpBtn.disabled = false;
            });
    } else {
        otpInput.classList.add("input-error");
        otpError.textContent = "Please enter the 6-digit OTP";
    }
});

  // Reset Form UI
  function resetOtpState() {
    bookingForm.reset();
    otpSection.style.display = "none";
    sendOtpBtn.style.display = "flex";
    sendOtpBtn.textContent = "Send OTP";
    verifiedTick.style.display = "none";
    contactInput.readOnly = false;
    contactInput.style.opacity = "1";
    submitBtn.disabled = true;
    contactInput.classList.remove("input-error");
    contactError.textContent = "";
    otpInput.classList.remove("input-error");
    otpError.textContent = "";
  }

  // Set Date Constraints
  function setDateConstraints() {
    const formatDateTime = (date) => {
      const pad = n => n < 10 ? '0' + n : n;
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    };
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 2);
    datetimeInput.min = formatDateTime(now);
    datetimeInput.max = formatDateTime(threeDaysFromNow);
  }

  // --- FORM SUBMISSION (AJAX) ---
  const successPopup = document.getElementById("successPopup");
  const closePopupBtn = document.getElementById("closePopupBtn");
  const popupDetails = document.getElementById("popupDetails");

  function showSuccessPopup(contactNo, datetime) {
    const dateObj = new Date(datetime);
    const formattedDate = dateObj.toLocaleString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });

    popupDetails.innerHTML = `
                    <p><i class="fas fa-phone-alt"></i> +91 ${contactNo}</p>
                    <p><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                `;
    successPopup.classList.add('show');
  }

  closePopupBtn.addEventListener('click', () => { successPopup.classList.remove('show'); });
  successPopup.addEventListener('click', (e) => { if (e.target === successPopup) successPopup.classList.remove('show'); });

  $(document).ready(function () {
    $("#bookingForm").submit(function (e) {
      e.preventDefault();

      let data = {
        name: $("#name").val(),
        contactNo: $("#contact").val(),
        email: $("#email").val(),
        productType: $("#product").val(),
        dateTime: $("#datetime").val(),
      };

      /* UNCOMMENT FOR BACKEND
      let csrfToken = $("input[name=csrfmiddlewaretoken]").val();
      $.ajax({
          url: "/book-appointment/",
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          headers: { "X-CSRFToken": csrfToken },
          success: function (response) {
              if (response.success === true) {
                  closeModal();
                  showSuccessPopup(data.contactNo, data.dateTime);
              } else { alert("Error: " + response.message); }
          }
      });
      */

      // Frontend demo behavior:
      closeModal();
      showSuccessPopup(data.contactNo, data.dateTime);
    });
  });

  // --- FIREBASE INIT ---
  if (typeof firebase !== 'undefined') {
    const firebaseConfig = {
      apiKey: "AIzaSyDoroDvYcYux6c7B_lUQwx7-2oFcaDYyAo",
      authDomain: "yesbima1.firebaseapp.com",
      projectId: "yesbima1",
      storageBucket: "yesbima1.firebasestorage.app",
      messagingSenderId: "675232366896",
      appId: "1:675232366896:web:c54e35dfdd3b0aa78488f5"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible', callback: function () { console.log("Verified"); } }
    );
  }

  // --- TIMELINE ANIMATION LOGIC (RESPONSIVE) ---
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function initProcessAnimation() {
    const steps = document.querySelectorAll('.t-step-marker');
    const timelineContainer = document.querySelector('.animated-timeline');
    const progressLine = document.querySelector('.timeline-progress-line');

    if (!timelineContainer || steps.length === 0) return;

    while (true) {
      // 1. Hard Reset State
      steps.forEach(step => step.classList.remove('active'));
      progressLine.style.transition = 'none'; // Disable transition for instant reset
      timelineContainer.style.setProperty('--progress', '0%');
      progressLine.style.opacity = '1';

      // Force browser reflow to apply instant reset before continuing
      void progressLine.offsetWidth;

      await sleep(500);

      // Restore CSS transitions
      progressLine.style.transition = '';

      // 2. Activate Step 1
      steps[0].classList.add('active');
      await sleep(1000);

      // 3. Move line to Step 2
      timelineContainer.style.setProperty('--progress', '50%');
      await sleep(800);

      // 4. Activate Step 2
      steps[1].classList.add('active');
      await sleep(1000);

      // 5. Move line to Step 3
      timelineContainer.style.setProperty('--progress', '100%');
      await sleep(800);

      // 6. Activate Step 3
      steps[2].classList.add('active');

      // 7. Cycle Complete: Hold fully green state
      await sleep(3500);

      // 8. Soft Reset (Fade out smoothly before jumping back to top)
      progressLine.style.transition = 'opacity 0.5s ease';
      progressLine.style.opacity = '0';
      steps.forEach(step => step.classList.remove('active'));

      await sleep(600);
    }
  }

  initProcessAnimation();
});
