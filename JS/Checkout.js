var form = document.getElementById("shipping-form");
var streetInput = document.getElementById("street-address");
var addressError = document.getElementById("address-error");

form.addEventListener("submit", (e) => {
    if (!streetInput.value.trim()) {
        addressError.style.display = "block";
        e.preventDefault(); // Prevent form submission
    } else {
        addressError.style.display = "none";
    }
});
