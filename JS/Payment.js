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
        paymentForm.submit();
        window.location.href = '../HTML/HomePage.html'; // CHANGE THIS TARGET PATH <--
    }
    
});