document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const otpBtn = document.getElementById('otpBtn');

    // Allow only numbers in input
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phoneNumber = phoneInput.value;

        if (phoneNumber.length === 10) {
            // Simulate sending OTP state
            otpBtn.textContent = "Sending...";
            otpBtn.style.opacity = "0.7";
            otpBtn.disabled = true;

            setTimeout(() => {
                alert(`OTP sent to +91 ${phoneNumber}`);
                // Reset button
                otpBtn.textContent = "Send OTP";
                otpBtn.style.opacity = "1";
                otpBtn.disabled = false;
            }, 1500);
        } else {
            alert("Please enter a valid 10-digit phone number.");
        }
    });
});