// static/js/auth.js

let confirmationResult; // will store OTP session

// 🔹 Step 1: Setup reCAPTCHA
window.onload = function () {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
            size: 'normal',
            callback: function (response) {
                console.log("reCAPTCHA solved");
            }
        }
    );
};

// 🔹 Step 2: Send OTP
function sendOTP() {
    const phoneNumber = "+91" + document.getElementById("contact").value;
    console.log(phoneNumber)
    if (!phoneNumber) {
        alert("Enter phone number");
        return;
    }

    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then(function (result) {
            confirmationResult = result;
            alert("OTP sent successfully!");
        })
        .catch(function (error) {
            console.error(error);
            alert("Error sending OTP");
        });
}

// 🔹 Step 3: Verify OTP
function verifyOTP() {
    const code = document.getElementById("otpInput").value;
    console.log(code)
    if (!code) {
        alert("Enter OTP");
        return;
    }

    confirmationResult.confirm(code)
        .then(function (result) {
            const user = result.user;

            console.log("User verified:", user);

            const element = document.querySelector('.input-group');
            element.style.flexDirection = "row";

            otpSection.style.display = "none"; // Hide OTP section
            sendOtpBtn.style.display = "none"; // Hide Send OTP button
            verifiedTick.style.display = "inline"; // Show green tick
            contactInput.readOnly = true; // Prevent changing the number
            contactInput.style.backgroundColor = "#f0f0f0"; // Grey out input
            submitBtn.disabled = false; // Enable the Submit button!

            // 🔥 Get Firebase ID token
            user.getIdToken().then(function (idToken) {

                // console.log("Firebase Token:", idToken);

                // Next step → send to Django
                // sendTokenToBackend(idToken);
            });
        })
        .catch(function (error) {
            console.error(error);
            alert("Invalid OTP");
        });
}

// 🔹 Step 4: Send token to Django
function sendTokenToBackend(idToken) {

    fetch("/verify-otp/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ token: idToken })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Login successful!");
                window.location.href = "/dashboard/";
            } else {
                alert("Login failed");
            }
        });
}

// 🔹 Helper: CSRF token (Django requirement)
function getCSRFToken() {
    let cookieValue = null;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            cookieValue = cookie.substring('csrftoken='.length);
        }
    }
    return cookieValue;
}