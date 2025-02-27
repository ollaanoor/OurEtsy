// Fetch the JSON file for products data 
fetch('../Resources/JSON/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON
    })
    .then(data => {
        console.log(data); // Log the JSON data
        var randomIndexCat = Math.floor(Math.random() * data.categories.length);
        const cat = data.categories[randomIndexCat].subcategories;
        
        // Pick a random product to display on right banner on each refresh
        const randomIndexSub = Math.floor(Math.random() * cat.length);
        const selectedBanner = cat[randomIndexSub];

        // Update the HTML content
        document.getElementById('banner-right-title').textContent = selectedBanner.name;
        document.getElementById('banner-right-img').src = selectedBanner.image;

        // Render Personalized Gifts Sections
        // renderProducts(data.categories[7].subcategories[3].products);
        renderProducts(data);

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Fetch & Render Home Page banners
fetch('../Resources/JSON/banner.json')
    .then(response => response.json())
    .then(data => {
        const banners = data.LeftBanner;

        // Pick a random banner on each refresh
        const randomIndex = Math.floor(Math.random() * banners.length);
        const selectedBanner = banners[randomIndex];

        // Update the HTML content
        document.getElementById('banner-left-title').textContent = selectedBanner.title;
        document.getElementById('banner-left-text').textContent = selectedBanner.text;
        document.getElementById('banner-left-img').src = selectedBanner.image;
    })
    .catch(error => console.error('Error loading the JSON file:', error));

// document.addEventListener('DOMContentLoaded', function () {
window.onload = function() {
    /* Dropdown */
    var dropdowns = document.getElementsByClassName('dropbtn')[0];
    var overlay = document.getElementsByClassName('dropdown-overlay')[0];
    
    console.log(dropdowns);

    dropdowns.addEventListener('click', (event)=>{
        var content = document.querySelector('.dropdown-content');
        var droparrow = document.getElementsByClassName('dropdown-arrow')[0];
        content.classList.toggle('show');
        droparrow.classList.toggle('show');

        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';

         // Prevent the click from bubbling to the document
        event.stopPropagation();
    })

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function(event){
        if (!event.target.matches('.dropbtn')) {
            var openDropdown = document.getElementsByClassName("dropdown-content")[0];
            // var droparrow = document.getElementsByClassName('dropdown-arrow')[0];
            if(openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                // droparrow.classList.remove('show');
            }
            overlay.style.display = 'none';
        }
    })

    /* Personalized Gifts Favorite Icons */
    // Event Delegation 
    /* We attach a single click event listener to the .grid-container div, which is the parent of all the fav-btn elements. */
    // Get the parent container of the favorite buttons
    const gridContainer = document.querySelector('.grid-container');

    // Add event listener for click on the container
    gridContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a button inside the fav-btn div
        if (event.target.closest('.fav-btn button')) {
            // Handle the click event for the favorite button
            const button = event.target.closest('.fav-btn button');
            toggleFav(button);
        }
    });
// });
}

function toggleFav(button) {
        
    const icon = button.querySelector('img');

    // Toggle the icon to indicate if the item is favorited or not
    if (icon.src.includes('fav-icon-2.png')) {
        icon.src = '../Resources/Images/fav-icon-2-fill.png';  // Change to filled icon
        addFavorite(1); //itemID
    } else {
        icon.src = '../Resources/Images/fav-icon-2.png';  // Change back to unfilled icon
        removeFavorite(1); //itemID
    }

    // Log which item was favorited
    // console.log('Favorited item:', button);
}

function addFavorite(categoryId,productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes({categoryId, productId})) {
        favorites = favorites.filter(item => item[0] !== categoryId && item[1] !== productId);
        alert(itemId + " removed from favorites!");
    } else {
        favorites.push({categoryId, productId});
        alert(itemId + " added to favorites!");
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Remove product from favorites
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to render products
function renderProducts(data) {
    var products3 = data.categories[7].subcategories[4].products;

    var productList1 = document.getElementById('discover-gifts-section');
    var productList2 = document.getElementById('most-popular-section');
    var productList3 = document.getElementById('personalized-gifts-list');

    var arrIdx = [];
    for(let i=0; i<6; i++){
        var products1 = data.categories[7].subcategories;
        var randomIndexCat = Math.floor(Math.random() * products1.length);
        
        if(arrIdx.includes(randomIndexCat)){
            i--;
            continue;
        }
        arrIdx.push(randomIndexCat);

        var productCard1 = document.createElement('div');
        productCard1.classList = 'card col-2 d-flex align-items-center';

        productCard1.innerHTML = `
            <img src="${products1[randomIndexCat].image}" alt="${products1[randomIndexCat].name}">
            <div class="container">
                <p class="text-center">${products1[randomIndexCat].name}</p>
            </div>
        `;

        productList1.appendChild(productCard1);
    }

    for(let i = 0; i < 6; i++){
        var randomIndexCat = Math.floor(Math.random() * data.categories.length);
        var products2 = data.categories[randomIndexCat].subcategories;

        // Make sure products has enough elements
        if (i >= products2.length) {
            i--;
            continue; // Skip this iteration if not
        }

        var productCard2 = document.createElement('div');
        productCard2.className = 'most-popular-card';

        productCard2.innerHTML = `
            <img src="${products2[i].image}" alt="${products2[i].name}">
            <p>${products2[i].name}</p>
        `;

        productList2.appendChild(productCard2);
    }
    

    // products1.forEach(product => {
    //     var productCard1 = document.createElement('div');
    //     productCard1.classList = 'card col-2 d-flex align-items-center';

    //     productCard1.innerHTML = `
    //         <img src="${product.image}" alt="${product.name}">
    //         <div class="container">
    //             <p class="text-center">${product.name}</p>
    //         </div>
    //     `;

    //     productList1.appendChild(productCard1);
    // });

    // products2.forEach(product => {
    //     var productCard2 = document.createElement('div');
    //     productCard2.className = 'most-popular-card';

    //     productCard2.innerHTML = `
    //         <img src="${product.image}" alt="${product.name}">
    //         <p>${product.name}</p>
    //     `;

    //     productList2.appendChild(productCard2);
    // });

    products3.forEach(product => {
        var productCard3 = document.createElement('div');
        productCard3.className = 'grid-item';

        // Fill the product card with data
        productCard3.innerHTML = `
            <div class="gift-grid-card" data-category-id="${product.categoryId}" data-product-id="${product.productId}" data-name="${product.name}" data-price="${product.price}"> 
                <div class="fav-btn">
                    <button href="#" type="button">
                        <img src="../Resources/Images/fav-icon-2.png" alt="favorites">
                    </button>
                </div>
                <img src="${product.image}" alt="${product.name}">
                <div class="price-badge">
                    <div class="price-badge-2">
                        <span>
                            <span class="currency-symbol fw-bold">USD </span>
                            <span class="currency-value fw-bold">${product.price}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Append the product card to the list
        productList3.appendChild(productCard3);
    });
}