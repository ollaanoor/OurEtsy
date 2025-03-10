var form = document.getElementById("shipping-form");

// Input fields
// var emailInput = document.getElementById("email");
// var confirmEmailInput = document.getElementById("confirm-email");
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

inputs.forEach((input, index) => {
    var errorMessage = errorMessages[index];

    var handleValidation = () => validateField(input, errorMessage);

    input.addEventListener('blur', handleValidation);
    input.addEventListener('input', handleValidation);
});

// Form submission handler
form.addEventListener("submit", (e) => {
    // Prevent form submission if there are errors
    e.preventDefault();

    inputs.forEach((input, index) => {
        validateField(input, errorMessages[index]);
    });

    // let isValid = true;

    // Clear previous error messages
    // clearErrors();

    // Validate email
    // if (!emailInput.validity.valid) {
    //     emailError.style.display = "block";
    // }

    // if (!emailInput.validity.valid) {
    //     // emailError.textContent = 'Email is required.';
    //     emailError.style.display = "block";
    //     isValid = false;
    // } 

    // else if (emailInput.validity.typeMismatch) {
    //     emailError.textContent = 'Please enter a valid email address.';
    //     isValid = false;
    // }

    // Validate email match
    // if (!confirmEmailInput.validity.valid || emailInput.value !== confirmEmailInput.value) {
    //     confirmEmailError.style.display = "block";
    //     isValid = false;
    // }

    // Validate country
    // if (!countryInput.validity.valid) {
    //     countryError.style.display = "block";
    //     isValid = false;
    // }

    // Validate full name
    // if (!nameInput.validity.valid) {
    //     nameError.style.display = "block";
    //     isValid = false;
    // }

    // Validate street address
    // if (!streetInput.validity.valid) {
    //     addressError.style.display = "block";
    //     isValid = false;
    // }

    // Validate city 
    // if (!cityInput.validity.valid) {
    //     cityError.style.display = "block";
    //     isValid = false;
    // }

    // Prevent form submission if validation fails
    // if (!isValid || emailInput.value !== confirmEmailInput.value) {
    //     e.preventDefault();
    // }

    // Submit form if everything is valid
    // if (isValid) {
    //     form.submit();
    // }
    if (form.validity.valid) {
        form.submit();
    }
    
});

// Clear error messages
function clearErrors() {
    emailError.style.display = "none";
    confirmEmailError.style.display = "none";
    countryError.style.display = "none";
    nameError.style.display = "none";
    addressError.style.display = "none";
}

// Email validation function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    console.log(re.test(email));
    return re.test(email);
}

// Validate a field and show error message
function validateField(input, errorElement) {
    // errorElement.textContent = '';

    if (!input.validity.valid) {
        errorElement.style.display = "block";
    } else {
        errorElement.style.display = "none";
    }

    // // Validate email match
    // if (!confirmEmailInput.validity.valid || emailInput.value !== confirmEmailInput.value) {
    //     confirmEmailError.style.display = "block";
    //     isValid = false;
    // }

}