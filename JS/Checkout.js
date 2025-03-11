import dataService from './dataService.js';

var form = document.getElementById("shipping-form");

// Input fields
var emailInput = document.getElementById("email");
var confirmEmailInput = document.getElementById("confirm-email");
// var countryInput = document.getElementById("country");
// var nameInput = document.getElementById("full-name");
// var streetInput = document.getElementById("street-address");
// var cityInput = document.getElementById("city");

// Error messages divs
// var emailError = document.getElementById("email-error");
// var confirmEmailError = document.getElementById("confirm-email-error");
// var countryError = document.getElementById("country-error");
// var nameError = document.getElementById("name-error");
// var addressError = document.getElementById("address-error");
// var cityError = document.getElementById("city-error");

var inputs = form.querySelectorAll('input');
var errorMessages = form.querySelectorAll('.error-message');
var selects = form.querySelectorAll('select');
var selectErrorMessages = form.querySelectorAll('.select-error-message');

inputs.forEach((input, index) => {
    var errorMessage = errorMessages[index];

    // Validate email match
    if(input.id == 'confirm-email') {
        var handleValidation = () => validateEmailMatch(emailInput, confirmEmailInput, errorMessage);
    } else {
        var handleValidation = () => dataService.validateField(input, errorMessage);
    }

    input.addEventListener('blur', handleValidation);
    input.addEventListener('input', handleValidation);
});

selects.forEach((input, index) => {
    var selectErrorMessage = selectErrorMessages[index];

    var handleValidation = () => dataService.validateField(input, selectErrorMessage);
    
    input.addEventListener('blur', handleValidation);
    input.addEventListener('input', handleValidation);
});

// Form submission handler
form.addEventListener("submit", (e) => {
    // Prevent form submission if there are errors
    e.preventDefault();

    let isValid = true;

    inputs.forEach((input, index) => {
        // Validate email match
        if(input.id == 'confirm-email') {
            isValid = validateEmailMatch(emailInput, confirmEmailInput, errorMessages[index]);
        } else {
            isValid = dataService.validateField(input, errorMessages[index]);
        }
    });

    selects.forEach((input, index) => {
        isValid = dataService.validateField(input, selectErrorMessages[index]);
    });

    // Clear previous error messages
    // clearErrors();

    // Submit form if validation succeeds
    if (isValid) {
        form.submit();
        window.location.href = '../HTML/Payment.html';
    }
    
});

// // Clear error messages
// function clearErrors() {
//     emailError.style.display = "none";
//     confirmEmailError.style.display = "none";
//     countryError.style.display = "none";
//     nameError.style.display = "none";
//     addressError.style.display = "none";
// }

// Validate a field and show error message
// function validateField(input, errorElement) {
//     // errorElement.textContent = '';
//     if(errorElement){
//         if (!input.validity.valid) {
//             errorElement.style.display = "block";
//         } else {
//             errorElement.style.display = "none";
//         }
//     }

//     // // Validate email match
//     // if (!confirmEmailInput.validity.valid || emailInput.value !== confirmEmailInput.value) {
//     //     confirmEmailError.style.display = "block";
//     //     isValid = false;
//     // }
// }

// Validate confirm email 
function validateEmailMatch(emailInput, confirmEmailInput, errorElement){
    if (!confirmEmailInput.validity.valid) {
        errorElement.textContent = 'Please enter a valid email address';
        errorElement.style.display = "block";
        return false;
    } else if (emailInput.value !== confirmEmailInput.value) {
        errorElement.textContent = 'Emails do not match';
        errorElement.style.display = "block";
        return false;
    } else {
        errorElement.style.display = "none";
        return true;
    }
}