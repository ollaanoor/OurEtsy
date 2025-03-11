var creditCardFields = document.getElementById('credit-card-fields');
var paymentForm = document.getElementById('payment-form');


// Show/hide card fields
paymentForm.addEventListener('change', (event) => {
    if (event.target.type === 'radio' && event.target.name === 'payment') {
        creditCardFields.style.display = event.target.id === 'credit-card-radio' ? 'block' : 'none';
    }
});
