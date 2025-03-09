import dataService from './dataService.js';

var data;

// Fetch the JSON file for products data 
dataService.fetchData()
    .then(mydata => {
        // console.log(data); // Log the JSON data
        data = mydata;
        // Populate dropdown dynamically
        populateDropdown();

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Get the header container
const headerContainer = document.getElementById('header-placeholder');

// Ensure the header container exists before proceeding
if (headerContainer) {

    // Initialize the cart badge on page load
    updateCartBadge();

    // Listen for clicks on the document
    document.addEventListener('click', function(event) {
        /* Dropdown */
        if (event.target.closest('.dropbtn')) {
            // Handle dropdown toggle
            toggleDropdown();
            event.stopPropagation();
        } else {
            closeDropdown();
        }

        /* Search Input */
        if (!event.target.closest('#search-input') && !event.target.closest('#search-suggestions')) {
            closeSearchSuggestions();
        }

        // Handle search when clicking again on search box and there is already something typed
        if (event.target.closest('#search-input')) {
            handleSearchInput();
        }
    });

    // Handle input for search suggestions
    document.addEventListener('input', function(event) {
        if (event.target.closest('#search-input')) {
            handleSearchInput();
        }
    });

    // var addToCartBtn = document.getElementById('add-to-cart');
    // var removeFromCartBtn = document.getElementById('remove-from-cart');
    // For testing purposes:
    // var addToCartBtn = document.getElementById('search-button');
    // var removeFromCartBtn = document.getElementById('search-button');

    // addToCartBtn.addEventListener('click', () => {
    //     cartCount++;
    //     updateCartBadge();
    // });

    // removeFromCartBtn.addEventListener('click', () => {
    //     if (cartCount > 0) {
    //         cartCount--;
    //     }
    //     updateCartBadge();
    // });

} else {
    console.error("Header container element not found.");
}

// Function to populate dropdown
function populateDropdown() {
    var content = document.getElementsByClassName('dropdown-content')[0];
    data.categories.forEach(cat => {
        var dropItem = document.createElement('a');
        dropItem.textContent = cat.name;
        dropItem.classList.add('dropdown-item');
        dropItem.href = "#"; // Assign html page
        content.appendChild(dropItem);
    })
}

// Function to handle search suggestions
function handleSearchInput() {
    var searchInput = document.getElementById('search-input');
    var suggestionsContainer = document.getElementById('search-suggestions');
    var suggestionsList = document.querySelector('.suggestions-list');
    var overlay = document.getElementsByClassName('search-overlay')[0];

    var searchTerm = searchInput.value.toLowerCase();
    var suggestions = getSuggestions(searchTerm); // Fetch suggestions

    // Clear previous suggestions
    suggestionsList.innerHTML = ''; // Clear previous list even when searchTerm is empty

    if (searchTerm.trim() !== '') {
        if (suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
            suggestionsContainer.classList.add('show');
            overlay.style.display = 'block';
        } else { // if there are no any suggestions to display
            closeSearchSuggestions();
        }
    } else {
        closeSearchSuggestions();
    }
}

// Function to close search suggestions
function closeSearchSuggestions() {
    var suggestionsContainer = document.getElementById('search-suggestions');
    var overlay = document.getElementsByClassName('search-overlay')[0];

    suggestionsContainer.classList.remove('show');
    overlay.style.display = 'none';
}

// Function to toggle dropdown
function toggleDropdown() {
    const content = document.querySelector('.dropdown-content');
    const droparrow = document.getElementsByClassName('dropdown-arrow')[0];
    const overlay = document.getElementsByClassName('dropdown-overlay')[0];

    content.classList.toggle('show');
    droparrow.classList.toggle('show');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

// Function to close dropdown
function closeDropdown() {
    const openDropdown = document.getElementsByClassName("dropdown-content")[0];
    const overlay = document.getElementsByClassName('dropdown-overlay')[0];

    openDropdown.classList.remove('show');
    overlay.style.display = 'none';

    const dropdownArrow = document.getElementsByClassName('dropdown-arrow')[0];
    dropdownArrow.classList.remove('show');
}

// Simulate fetching suggestions (replace with actual data)
function getSuggestions(searchTerm) {
    var allSuggestions = [];

    // Collect category, subcategory, and product names
    data.categories.forEach(category => {
        // Add category name
        allSuggestions.push(category.name);

        // Loop through subcategories
        category.subcategories.forEach(subcategory => {
            allSuggestions.push(subcategory.name);

            // Add product names
            subcategory.products.forEach(product => {
                allSuggestions.push(product.name);
            });
        });
    });
    // console.log(allSuggestions);
    return allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(searchTerm)
    ).slice(0,5); // Limit to the first 5 suggestions
}

function updateCartBadge() {
    var cartBadge = document.getElementById('cart-badge');
    // Load cart count from localStorage (or set to 0 if not found)
    var cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
    
    if (cartCount > 0) {
        // cartBadge.style.display = 'inline-block';
        cartBadge.style.display = 'block';
        cartBadge.textContent = cartCount;
    } else {
        // cartBadge.style.display = 'none';
        cartBadge.style.display = 'none';
    }

    // Save the updated count to localStorage
    localStorage.setItem('cartCount', cartCount);
}