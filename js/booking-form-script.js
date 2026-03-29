const btn = document.getElementById("openBookingBtn");
const formContainer = document.getElementById("form-container");

// 1. Fetch the external HTML file
fetch('booking-form.html')
    .then(response => response.text())
    .then(data => {
        // Inject the HTML into the container
        formContainer.innerHTML = data;
        
        // Now that the HTML exists on the page, initialize the modal logic
        initializeModal();
    })
    .catch(error => console.error('Error loading the form:', error));

// 2. Setup all the modal interactions
function initializeModal() {
    const modal = document.getElementById("bookingModal");
    const span = document.querySelector(".close-btn");
    const datetimeInput = document.getElementById("datetime");
    const bookingForm = document.getElementById("bookingForm");

    // Open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        setDateConstraints(datetimeInput); 
    }

    // Close the modal with X
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close clicking outside the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        alert('Form submitted successfully!');
        modal.style.display = "none"; 
        this.reset(); 
    });
}

// 3. Date/Time Restriction Logic
function setDateConstraints(datetimeInput) {
    const formatDateTime = (date) => {
        const pad = n => n < 10 ? '0' + n : n;
        return date.getFullYear() + '-' +
               pad(date.getMonth() + 1) + '-' +
               pad(date.getDate()) + 'T' +
               pad(date.getHours()) + ':' +
               pad(date.getMinutes());
    };

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    datetimeInput.min = formatDateTime(now);
    datetimeInput.max = formatDateTime(threeDaysFromNow);
}