import dataService from './dataService.js';

var paymentForm = document.getElementById('payment-form');
var creditCardFields = document.getElementById('credit-card-fields');

var activeRadio;

// Show/hide card fields
paymentForm.addEventListener('change', (event) => {
    if (event.target.type === 'radio' && event.target.name === 'payment') {
        creditCardFields.style.display = event.target.id === 'credit-card-radio' ? 'block' : 'none';
    }

    activeRadio = event.target.id;
});

/* Expiration date validation: Do not allow users to choose date from before current month */
// Get the current date in YYYY-MM format
const expiryInput = document.getElementById('card-expiry');
const currentDate = new Date().toISOString().slice(0, 7);
// Set the minimum month to the current month
expiryInput.setAttribute('min', currentDate);

var inputs = creditCardFields.querySelectorAll('input');
var errorMessages = creditCardFields.querySelectorAll('.error-message');

inputs.forEach((input, index) => {
    var errorMessage = errorMessages[index];

    var handleValidation = () => dataService.validateField(input, errorMessage);

    input.addEventListener('blur', handleValidation);
    input.addEventListener('input', handleValidation);
});

// Form submission handler
paymentForm.addEventListener("submit", (e) => {
    // Prevent form submission if there are errors
    e.preventDefault();

    let isValid = true;

    if(activeRadio == 'credit-card-radio'){
        inputs.forEach((input, index) => {
            isValid = dataService.validateField(input, errorMessages[index]);
        });
    }

    var selectedRadio = document.querySelector('input[name="payment"]:checked');

    // Submit if no errors
    if (isValid && selectedRadio) {
        // paymentForm.submit();
        showPopup();

        // Add a canvas element with a high z-index
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        // Style the canvas to cover the screen and be on top
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none'; // So it doesn’t block clicks
        canvas.style.zIndex = '9999'; // Super high z-index
        // Create confetti instance tied to the canvas
        const confettiInstance = confetti.create(canvas, { resize: true });
        // Trigger confetti animation
        confettiInstance({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff0', '#f00', '#0f0', '#00f', '#ff69b4']
        });
        // window.location.href = '../HTML/HomePage.html'; // CHANGE THIS TARGET PATH <--
    }
    
});

// document.getElementById('submit-btn').addEventListener('click', function(){
//     showPopup();
// });

document.querySelector('.close-popup').addEventListener('click', function(){
    closePopup();
});

// Show the popup
function showPopup() {
    document.getElementById("popup").style.display = "block";
}

// Close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
    window.location.href = '../HTML/HomePage.html'; // CHANGE THIS TARGET PATH <--
}