//  Get the header container
const headerContainer = document.getElementById('header-placeholder');

// Ensure the header container exists before proceeding
if (headerContainer) {
    // Listen for clicks on the document
    document.addEventListener('click', function(event) {

        /* Dropdown */
        // Check if the clicked element or any of its parents is the dropdown button
        if (event.target.closest('.dropbtn')) {
            // Run your dropdown logic
            const content = document.querySelector('.dropdown-content');
            const droparrow = document.getElementsByClassName('dropdown-arrow')[0];
            const overlay = document.getElementsByClassName('dropdown-overlay')[0];

             if (content) {
                content.classList.toggle('show');
            } else {
                console.error("Error: Dropdown content element not found");
            }
            if (droparrow) {
                 droparrow.classList.toggle('show');
            } else {
                console.error("Error: Dropdown arrow element not found");
            }

            // Check if overlay exists before trying to change its display
            if (overlay) {
                overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
            } else {
                console.error("Error: Dropdown overlay element not found");
            }

             event.stopPropagation();
        } else if (!event.target.closest('.dropbtn')){
             const openDropdown = document.getElementsByClassName("dropdown-content")[0];
             const overlay = document.getElementsByClassName('dropdown-overlay')[0];

           
            if (openDropdown && openDropdown.classList.contains('show')) {
                // console.log("Closing open dropdown");
                openDropdown.classList.remove('show');
                document.getElementsByClassName('dropdown-arrow')[0].classList.remove('show');
            }
            if (overlay) {
                // console.log("Hiding overlay");
                overlay.style.display = 'none';
            }
        }
    });

    // const inputElement = document.querySelector('input#search-input');
    // const datalistElement = document.querySelector('datalist#suggestions');
    // const categories = ["Handmade Jewelry", "Personalized Gifts", "Home Decor", "Vintage Items", "Craft Supplies", "Jewelry", "Gifts", "Decor", "Vintage", "Supplies"]; // Example data source

    // // Debouncing function
    // function debounce(func, delay) {
    // let timeoutId;
    // return function (...args) {
    //     clearTimeout(timeoutId);
    //     timeoutId = setTimeout(() => {
    //     func.apply(this, args);
    //     }, delay);
    // };
    // }

    // // Function to filter categories based on input
    // function filterCategories(inputValue) {
    // const lowerCaseInput = inputValue.toLowerCase();
    // return categories.filter(category => category.toLowerCase().includes(lowerCaseInput));
    // }

    // // Function to update the datalist with suggestions
    // function updateSuggestions(suggestions) {
    // datalistElement.innerHTML = ''; // Clear existing options
    // if (suggestions.length === 0) return;
    // suggestions.forEach(suggestion => {
    //     const option = document.createElement('option');
    //     option.value = suggestion;
    //     datalistElement.appendChild(option);
    // });
    // }

    // // Function to handle search
    // function handleSearch(value) {
    // console.log('Searching for:', value);
    // // Here you would typically navigate to a search results page or update the current page
    // }

    // // Debounced filtering and suggestion update
    // const debouncedUpdateSuggestions = debounce(function (inputValue) {
    // const filteredCategories = filterCategories(inputValue);
    // updateSuggestions(filteredCategories);
    // }, 250); // 250ms delay

    // // Input event listener
    // inputElement.addEventListener('input', (event) => {
    // const inputValue = event.target.value;
    // debouncedUpdateSuggestions(inputValue);
    // });

    // // Change event listener (when an option is selected)
    // inputElement.addEventListener('change', (event) => {
    // const selectedValue = event.target.value;
    // handleSearch(selectedValue);
    // });

    // // Keydown event listener (when Enter is pressed)
    // inputElement.addEventListener('keydown', (event) => {
    // if (event.key === 'Enter') {
    //     const inputValue = event.target.value;
    //     handleSearch(inputValue);
    // }
    // });

    // Set aria-autocomplete attribute
    // inputElement.setAttribute('aria-autocomplete', 'list');

    // const searchInput = document.querySelector('.search-box');
    var searchInput = document.getElementById('search-input');
    var suggestionsContainer = document.getElementById('search-suggestions');
    var suggestionsList = document.querySelector('.suggestions-list');
    var overlay = document.getElementsByClassName('dropdown-overlay')[0];

    searchInput.addEventListener('input', () => {
      var searchTerm = searchInput.value.toLowerCase();
      // Simulate fetching suggestions (replace with your actual data source)
      var suggestions = getSuggestions(searchTerm);

      // Clear previous suggestions
      suggestionsList.innerHTML = '';

      if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
          const li = document.createElement('li');
          li.textContent = suggestion;
          suggestionsList.appendChild(li);
        });
        suggestionsContainer.style.display = 'block';
        overlay.style.display = 'block';
      } else {
        suggestionsContainer.style.display = 'none';
        overlay.style.display = 'none';
      }
    });

    // Simulate fetching suggestions (replace with your actual data source)
    function getSuggestions(searchTerm) {
      var allSuggestions = ['Apple', 'Banana', 'Orange', 'Apricot', 'Avocado', 'Blueberry'];
      return allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(searchTerm)
      );
    }

    // You can also set up other event listeners here if needed
} else {
    console.error("Header container element not found.");
}