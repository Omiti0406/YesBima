document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DOM ELEMENTS
    // ==========================================
    const modal = document.getElementById("bookingModal");
    const openBtns = document.querySelectorAll(".openBookingBtn");
    const closeBtns = document.querySelectorAll(".close-btn");
    const bookingForm = document.getElementById("bookingForm");

    // Step 1 Elements
    const productError = document.getElementById("productError");
    const step1 = document.getElementById("step1");
    const contactInput = document.getElementById("contact");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const otpSection = document.getElementById("otpSection");
    const otpInput = document.getElementById("otpInput");
    const validateOtpBtn = document.getElementById("validateOtpBtn");
    const verifiedTick = document.getElementById("verifiedTick");
    const contactError = document.getElementById("contactError");
    const otpError = document.getElementById("otpError");
    const nextToStep2Btn = document.getElementById("nextToStep2Btn");

    // Step 2 Elements
    const step2 = document.getElementById("step2");
    const backToStep1Btn = document.getElementById("backToStep1Btn");
    const dateChipsContainer = document.getElementById("dateChipsContainer");
    const timeSlotsGrid = document.getElementById("timeSlotsGrid");
    const hiddenDateInput = document.getElementById("selectedDate");
    const hiddenTimeInput = document.getElementById("selectedTime");
    const submitBtn = document.getElementById("submitBtn");

    const successPopup = document.getElementById("successPopup");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const popupDetails = document.getElementById("popupDetails");

    // Testimonials Carousel Elements
    const testimonialPrevBtn = document.getElementById("testimonialPrevBtn");
    const testimonialNextBtn = document.getElementById("testimonialNextBtn");
    const testimonialsContainer = document.getElementById("testimonialsContainer");
    const testimonialCards = testimonialsContainer ? Array.from(testimonialsContainer.querySelectorAll(".testimonial-card")) : [];


    // ==========================================
    // TESTIMONIALS CAROUSEL LOGIC
    // ==========================================
    let currentTestimonialPage = 0;
    const testimonialsPerPage = 3;
    const totalTestimonials = testimonialCards.length;
    const totalTestimonialPages = Math.max(1, Math.ceil(totalTestimonials / testimonialsPerPage));

    const updateTestimonialDisplay = () => {
        if (testimonialCards.length === 0) return;

        // Hide all cards
        testimonialCards.forEach(card => {
            card.style.display = 'none';
        });

        // Show cards for current page
        const startIdx = currentTestimonialPage * testimonialsPerPage;
        const endIdx = Math.min(startIdx + testimonialsPerPage, totalTestimonials);
        
        for (let i = startIdx; i < endIdx; i++) {
            testimonialCards[i].style.display = 'block';
        }

        // Update button states
        if (testimonialPrevBtn) {
            testimonialPrevBtn.disabled = currentTestimonialPage === 0;
        }
        if (testimonialNextBtn) {
            testimonialNextBtn.disabled = currentTestimonialPage >= totalTestimonialPages - 1;
        }
    };

    if (testimonialPrevBtn) {
        testimonialPrevBtn.addEventListener('click', () => {
            if (currentTestimonialPage > 0) {
                currentTestimonialPage -= 1;
                updateTestimonialDisplay();
            }
        });
    }

    if (testimonialNextBtn) {
        testimonialNextBtn.addEventListener('click', () => {
            if (currentTestimonialPage < totalTestimonialPages - 1) {
                currentTestimonialPage += 1;
                updateTestimonialDisplay();
            }
        });
    }

    // Initialize testimonials display
    updateTestimonialDisplay();


    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.classList.add('modal-open');
            generateDateChips(); // Pre-load dates
        });
    });

    const closeModals = () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        document.body.classList.remove('modal-open');
        setTimeout(resetFormState, 300);
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModals));
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModals(); });

    // Move to Step 2
    nextToStep2Btn.addEventListener('click', () => {

        // 1. Custom validation for the Product Radio Buttons
        const selectedProduct = document.querySelector('input[name="product"]:checked');

        if (!selectedProduct) {
            productError.textContent = "Please select an insurance product to continue.";
            return; // Stop here, do not go to step 2
        } else {
            productError.textContent = ""; // Clear error if selected
        }

        // 2. Standard validation for the rest of the form (Name, Email)
        if (bookingForm.checkValidity()) {
            step1.style.display = 'none';
            step2.style.display = 'block';
        } else {
            bookingForm.reportValidity();
        }
    });

    // Add this to clear the error immediately when the user clicks a product card
    document.querySelectorAll('input[name="product"]').forEach(radio => {
        radio.addEventListener('change', () => {
            productError.textContent = "";
        });
    });

    // Back to Step 1
    backToStep1Btn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
    });


    // ==========================================
    // 3. DATE & TIME CHIP LOGIC
    // ==========================================
    function generateDateChips() {
        dateChipsContainer.innerHTML = '';
        const today = new Date();

        for (let i = 1; i <= 3; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const dateString = currentDate.toISOString().split('T')[0];
            const displayDate = currentDate.toLocaleDateString('en-IN', {
                weekday: 'short', month: 'short', day: 'numeric'
            });

            const chip = document.createElement('div');
            chip.className = 'select-chip';
            chip.textContent = displayDate;
            chip.dataset.date = dateString;

            chip.addEventListener('click', () => {
                document.querySelectorAll('#dateChipsContainer .select-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                hiddenDateInput.value = dateString;
                hiddenTimeInput.value = '';
                submitBtn.disabled = true;

                generateTimeSlots(dateString);
            });

            dateChipsContainer.appendChild(chip);
        }
    }

    function generateTimeSlots(selectedDateString) {
        timeSlotsGrid.innerHTML = '';
        const selectedDate = new Date(selectedDateString);
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();

        let currentTime = new Date(selectedDate);
        currentTime.setHours(10, 0, 0, 0);

        const endTime = new Date(selectedDate);
        endTime.setHours(18, 0, 0, 0);

        let slotsGenerated = false;

        while (currentTime <= endTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const valueString = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const chip = document.createElement('div');
            chip.className = 'select-chip';
            chip.textContent = timeString;
            chip.dataset.time = valueString;

            if (isToday && currentTime <= now) {
                chip.classList.add('disabled');
            } else {
                chip.addEventListener('click', () => {
                    document.querySelectorAll('#timeSlotsGrid .select-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');

                    hiddenTimeInput.value = valueString;
                    submitBtn.disabled = false;
                });
            }

            timeSlotsGrid.appendChild(chip);
            slotsGenerated = true;
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        if (!slotsGenerated || timeSlotsGrid.querySelectorAll('.select-chip:not(.disabled)').length === 0) {
            timeSlotsGrid.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1;">No available slots left for today.</p>';
        }
    }

    // ==========================================
    // 4. DUMMY OTP LOGIC (For UI Testing)
    // ==========================================
    sendOtpBtn.addEventListener("click", () => {
        const contactValue = contactInput.value.trim();
        contactInput.classList.remove("input-error");
        contactError.textContent = "";

        if (/^[0-9]{10}$/.test(contactValue)) {
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = "Sending...";
            otpInput.classList.remove("input-error");
            otpError.textContent = "";
            validateOtpBtn.textContent = "Validate";
            validateOtpBtn.disabled = false;

            setTimeout(() => {
                otpSection.style.display = "block";
                sendOtpBtn.textContent = "Resend OTP";
                sendOtpBtn.disabled = false;
                otpInput.focus();
            }, 800);

        } else {
            contactInput.classList.add("input-error");
            contactError.textContent = "Please enter a valid 10-digit number";
        }
    });

    validateOtpBtn.addEventListener("click", () => {
        const enteredOtp = otpInput.value.trim();
        otpInput.classList.remove("input-error");
        otpError.textContent = "";

        if (enteredOtp === "123456") {
            validateOtpBtn.disabled = true;
            validateOtpBtn.textContent = "Verifying...";

            setTimeout(() => {
                otpSection.style.display = "none";
                sendOtpBtn.style.display = "none";
                verifiedTick.style.display = "flex";
                console.log(verifiedTick.style.display)
                contactInput.readOnly = true;
                contactInput.style.opacity = "0.5";

                nextToStep2Btn.disabled = false;
                validateOtpBtn.disabled = false;
            }, 500);

        } else {
            otpInput.classList.add("input-error");
            otpError.textContent = "Invalid OTP. Use 123456 for testing.";
        }
    });

    // ==========================================
    // 4. FIREBASE OTP LOGIC
    // ==========================================
    // let windowConfirmationResult = null;

    // if (typeof firebase !== 'undefined') {
    //   const firebaseConfig = {
    //     apiKey: "AIzaSyDoroDvYcYux6c7B_lUQwx7-2oFcaDYyAo",
    //     authDomain: "yesbima1.firebaseapp.com",
    //     projectId: "yesbima1",
    //     storageBucket: "yesbima1.firebasestorage.app",
    //     messagingSenderId: "675232366896",
    //     appId: "1:675232366896:web:c54e35dfdd3b0aa78488f5"
    //   };
    //   if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    //   if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
    // }

    // sendOtpBtn.addEventListener("click", () => {
    //   const contactValue = contactInput.value.trim();
    //   contactInput.classList.remove("input-error");
    //   contactError.textContent = "";

    //   if (/^[0-9]{10}$/.test(contactValue)) {
    //     const phoneNumber = "+91" + contactValue;
    //     const appVerifier = window.recaptchaVerifier;

    //     sendOtpBtn.disabled = true;
    //     sendOtpBtn.textContent = "Sending...";

    //     firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    //       .then((confirmationResult) => {
    //         windowConfirmationResult = confirmationResult;
    //         otpSection.style.display = "block";
    //         sendOtpBtn.textContent = "Resend OTP";
    //         sendOtpBtn.disabled = false;
    //       })
    //       .catch((error) => {
    //         console.error("Error", error);
    //         contactInput.classList.add("input-error");
    //         contactError.textContent = "Failed to send OTP.";
    //         sendOtpBtn.textContent = "Get OTP";
    //         sendOtpBtn.disabled = false;
    //         if (window.recaptchaVerifier) window.recaptchaVerifier.render();
    //       });
    //   } else {
    //     contactInput.classList.add("input-error");
    //     contactError.textContent = "Please enter a valid 10-digit number";
    //   }
    // });

    // validateOtpBtn.addEventListener("click", () => {
    //   const enteredOtp = otpInput.value.trim();
    //   otpInput.classList.remove("input-error");
    //   otpError.textContent = "";

    //   if (enteredOtp.length === 6) {
    //     validateOtpBtn.disabled = true;
    //     validateOtpBtn.textContent = "Verifying...";

    //     windowConfirmationResult.confirm(enteredOtp)
    //       .then(() => {
    //         otpSection.style.display = "none";
    //         sendOtpBtn.style.display = "none";
    //         verifiedTick.style.display = "flex";

    //         contactInput.readOnly = true;
    //         contactInput.style.opacity = "0.5";

    //         // CRITICAL CHANGE: Enable the "Next" button, not the submit button
    //         nextToStep2Btn.disabled = false;
    //       })
    //       .catch(() => {
    //         otpInput.classList.add("input-error");
    //         otpError.textContent = "Invalid OTP. Please try again.";
    //         validateOtpBtn.textContent = "Verify";
    //         validateOtpBtn.disabled = false;
    //       });
    //   } else {
    //     otpInput.classList.add("input-error");
    //     otpError.textContent = "Please enter the 6-digit OTP";
    //   }
    // });

    function resetFormState() {
        if (bookingForm) bookingForm.reset();

        step1.style.display = 'block';
        step2.style.display = 'none';

        otpSection.style.display = "none";
        sendOtpBtn.style.display = "inline-flex";
        sendOtpBtn.textContent = "Send OTP";
        sendOtpBtn.disabled = false;
        validateOtpBtn.textContent = "Validate";
        validateOtpBtn.disabled = false;
        otpInput.classList.remove("input-error");
        otpError.textContent = "";
        verifiedTick.style.display = "none";
        contactInput.readOnly = false;
        contactInput.style.opacity = "1";
        nextToStep2Btn.disabled = true;

        dateChipsContainer.innerHTML = '';
        timeSlotsGrid.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1; font-size: 0.9rem;">Please select a date first.</p>';
        hiddenDateInput.value = '';
        hiddenTimeInput.value = '';
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Confirm Booking';
    }


    // ==========================================
    // 5. FORM SUBMISSION (BACKEND AJAX/FETCH)
    // ==========================================
    function showSuccessPopup(contactNo, appointmentId, dateString, timeString) {
        const dateObj = new Date(dateString);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short'
        });

        // Convert 24h time to 12h for display
        let [hours, minutes] = timeString.split(':');
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const displayTime = `${hours}:${minutes} ${ampm}`;

        popupDetails.innerHTML = `
            <p><i class="fas fa-phone-alt"></i> +91 ${contactNo}</p>
            <p><i class="fas fa-shield-alt"></i> ID: ${appointmentId}</p>
            <p><i class="far fa-calendar-alt"></i> ${formattedDate} at ${displayTime}</p>
        `;

        // Slightly delay to ensure modal close animation finishes
        setTimeout(() => {
            successPopup.classList.add('show');
        }, 300);
    }

    if (closePopupBtn) closePopupBtn.addEventListener('click', closeModals);

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Prevent double clicking
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Processing...';

            const selectedProduct = document.querySelector('input[name="product"]:checked');

            // Get CSRF Token safely
            const csrfTokenElement = document.querySelector("input[name=csrfmiddlewaretoken]");
            const csrfToken = csrfTokenElement ? csrfTokenElement.value : '';

            let data = {
                name: document.getElementById("name").value,
                contactNo: document.getElementById("contact").value,
                email: document.getElementById("email").value,
                productType: selectedProduct ? selectedProduct.value : '',
                bookingDate: hiddenDateInput.value,
                bookingTime: hiddenTimeInput.value,
            };

            // ACTUAL BACKEND CALL
            fetch("/book-appointment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.success === true) {
                        closeModals();
                        // Assumes your backend returns the booking ID in 'response.message'
                        showSuccessPopup(data.contactNo, response.message, data.bookingDate, data.bookingTime);
                    } else {
                        alert("Something went wrong! " + response.message);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Confirm Booking';
                    }
                })
                .catch(error => {
                    console.error("Error booking appointment:", error);
                    alert("Error occurred while booking appointment. Please try again later.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Confirm Booking';
                });
        });
    }

    // ==========================================
    // 6. TIMELINE ANIMATION (RESTORED)
    // ==========================================
    const revealOnScrollTimeline = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) { reveal.classList.add('active'); }
        });
    };
    window.addEventListener('scroll', revealOnScrollTimeline);
    revealOnScrollTimeline();

    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function initProcessAnimation() {
        const steps = document.querySelectorAll('.t-step-marker');
        const timelineContainer = document.querySelector('.animated-timeline');
        const progressLine = document.querySelector('.timeline-progress-line');

        if (!timelineContainer || steps.length === 0) return;

        while (true) {
            steps.forEach(step => step.classList.remove('active'));
            if (progressLine) {
                progressLine.style.transition = 'none';
                progressLine.style.opacity = '1';
                void progressLine.offsetWidth;
            }
            if (timelineContainer) {
                timelineContainer.style.setProperty('--progress', '0%');
            }

            await sleep(500);

            if (progressLine) progressLine.style.transition = '';

            steps[0].classList.add('active');
            await sleep(1000);

            if (timelineContainer) timelineContainer.style.setProperty('--progress', '50%');
            await sleep(800);

            steps[1].classList.add('active');
            await sleep(1000);

            if (timelineContainer) timelineContainer.style.setProperty('--progress', '100%');
            await sleep(800);

            steps[2].classList.add('active');
            await sleep(3500);

            if (progressLine) {
                progressLine.style.transition = 'opacity 0.5s ease';
                progressLine.style.opacity = '0';
            }
            steps.forEach(step => step.classList.remove('active'));

            await sleep(600);
        }
    }

    initProcessAnimation();


    // ==========================================
    // THEME TOGGLE LOGIC (Dark/Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    
    // 1. Check if user already has a saved preference in Local Storage
    const savedTheme = localStorage.getItem('yesbima-theme');
    
    // 2. If preference is 'light', apply it immediately on load
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // 3. Toggle button click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle the class on the body
            document.body.classList.toggle('light-theme');
            
            // Check if light theme is currently active
            if (document.body.classList.contains('light-theme')) {
                // Change icon to Moon and save preference
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('yesbima-theme', 'light');
            } else {
                // Change icon back to Sun and save preference
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('yesbima-theme', 'dark');
            }
        });
    }
});