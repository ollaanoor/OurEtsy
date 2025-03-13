import dataService from './dataService.js';

// Fetch the JSON file for products data 
// fetch('../Resources/JSON/data.json')
dataService.fetchData()
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json(); // Parse JSON
    // })
    .then(data => {
        // console.log(data); // Log the JSON data
        displayFavorites(data);
        setupEventListeners(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function setupEventListeners(data) {
    /* Favorite Products Add & Remove */
    // Event Delegation 
    /* We attach a single click event listener to the .grid-container div, which is the parent of all the fav-btn elements. */
    // Get the parent container of the favorite buttons
    var gridContainer = document.querySelector('.grid-container');
    
    // Add event listener for click on the container
    gridContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a button inside the fav-btn div
        if (event.target.closest('.fav-btn button')) {
            // Handle the click event for the favorite button
            var button = event.target.closest('.fav-btn button');
            var item = event.target.closest('.fav-card');
            // console.log(item);
            dataService.toggleFav(button,item.dataset.categoryId,item.dataset.subcategoryId,item.dataset.productId);
            displayFavorites(data);
        }
         // Redirecting to product page when clicking on a grid item
        else if (event.target.closest('.fav-card')) { 
            // Check if the clicked element is inside the most popular categories div
            var favCard = event.target.closest('.fav-card');
            window.location.href = `../HTML/productDetails.html?cid=${favCard.dataset.categoryId}&sid=${favCard.dataset.subcategoryId}&pid=${favCard.dataset.productId}`;
        }
    });
}

// Display favorites on the favorites page
function displayFavorites(data) {
    // var data = data.categories;
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var favoritesList = document.getElementById('favorites-list');

    // console.log(favorites);

    favoritesList.innerHTML = '';
    var emptyFav = document.getElementById('empty-fav');
    if (favorites.length == 0) {
        emptyFav.style.display = 'block';
        return;
    } else {
        emptyFav.style.display = 'none';
    }

    favorites.forEach(item => {
        // values from local storage
        // console.log(typeof(item.categoryId));
        var cId = parseInt(item.categoryId);
        var sId = parseInt(item.subcategoryId);
        var pId = parseInt(item.productId);
        // console.log(typeof pId);

        // map the above values to get the products from json
        // var product = data.categories[cId].subcategories[sId].products[pId];
        var cat = data.categories.find(cat => cat.id === cId);
        // console.log(cat);
        var sub = cat.subcategories.find(sub => sub.id === sId);
        // console.log(sub);
        var product = sub.products.find(prod => prod.id === pId);
        // var product = data.categories.find(cat => cat.id === cId).subcategories.find(sub => sub.id === sId).products.find(prod => prod.id === pId);
        // console.log(product);
        
        favoritesList.innerHTML += `
            <div class="grid-item fav-card" data-category-id="${cat.id}" data-subcategory-id="${sub.id}" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <div class="fav-btn">
                            <button href="#" type="button">
                                <img src="../Resources/Images/fav-icon-2-fill.png" alt="favorites">
                            </button>
                        </div>
                        <img src="${product.image[0]}" alt="${product.name}" style="width: 300px; height: 300px;">
                        <div class="fav-card-info">
                            <h3>
                                ${product.name}
                            </h3>
                            <p>${product.vendor}</p>
                            <div>
                                <span class="currency-symbol">USD</span>
                                <span class="currency-value">${product.price}</span>
                            </div>
                        </div>
                    </div>
        `;
    });
}