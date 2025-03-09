import dataService from './dataService.js';

// Fetch the JSON file for products data 
dataService.fetchData()
    .then(data => {
        console.log(data); // Log the JSON data
        displayCartItems(data);
        // setupEventListeners(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function setupEventListeners(data) {
    /* Favorite Products Add & Remove */
    // Event Delegation 
    /* We attach a single click event listener to the .grid-container div, which is the parent of all the fav-btn elements. */
    // Get the parent container of the favorite buttons
    // var gridContainer = document.querySelector('.grid-container');
    
    // // Add event listener for click on the container
    // gridContainer.addEventListener('click', function (event) {
    //     // Check if the clicked element is a button inside the fav-btn div
    //     if (event.target.closest('.fav-btn button')) {
    //         // Handle the click event for the favorite button
    //         const button = event.target.closest('.fav-btn button');
    //         const item = event.target.closest('.fav-card');
    //         // console.log(item);
    //         dataService.toggleFav(button,item.dataset.categoryId,item.dataset.subcategoryId,item.dataset.productId);
    //         displayFavorites(data);
    //     }
    // });
}

// Function to render the cart
function displayCartItems(data) {
    // var cartContainer = document.getElementById("cart");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) // cId,sId,pId,quantity
    
    var cartItemsdiv = document.getElementById("cart-items");
    cartItemsdiv.innerHTML = ''; // Clear previous content
    
    var subtotal = 0;
    var shipping = 18.08;

    cartItems.forEach((item) => {
        var cId = parseInt(item.categoryId);
        var sId = parseInt(item.subcategoryId);
        var pId = parseInt(item.productId);
        var quantity = parseInt(item.quantity);

        var cat = data.categories.find(cat => cat.id === cId);
        var sub = cat.subcategories.find(sub => sub.id === sId);
        var product = sub.products.find(prod => prod.id === pId);

        // let itemData = data.categories[cId].subcategories[sId].products[pId];
        var itemData = product;

        var itemTotal = itemData.price * item.quantity;
        subtotal += itemTotal;

        var itemElement = document.createElement("div");
        itemElement.classList = "grid-item cart-content-left";
        itemElement.innerHTML = `
            <div class="product-vendor">
                        <div class="vendor-img">
                            <img src="${itemData.vendorImg}">
                        </div>
                        <div class="vendor-name">
                            <p>${itemData.vendor}</p>
                        </div>
                    </div>
                    <div class="product-details">
                        <div class="product-img">
                            <img src="${itemData.image[0]}">
                        </div>
                        <div class="product-details-2">
                                <div class="product-details-3">
                                    <div class="product-name">
                                        <p><a href="#">${itemData.name}</a></p>
                                    </div>
                                    <div class="product-details-4">
                                        <div class="cart-item-details">
                                            <div class="cart-item-badge">
                                                <span class="badge-text">Style: <span>
                                                Satellite 16" +2" Ex [USD 26.18]
                                                </span></span>
                                            </div>
                                            <div class="cart-item-badge">
                                                <span class="badge-text">Initial: <span>O</span></span>
                                            </div>
                                        </div>
                                        <div class="product-details-5">
                                            <div class="cart-quantity">
                                                <select class="select-element">
                                                    <option value="1" selected="">1</option>
                                                    <option value="2" selected="">2</option>
                                                    <option value="3" selected="">3</option>
                                                    <option value="4" selected="">4</option>
                                                    <option value="5" selected="">5</option>
                                                    <option value="6" selected="">6</option>
                                                    <option value="7" selected="">7</option>
                                                    <option value="8" selected="">8</option>
                                                    <option value="9" selected="">9</option>
                                                    <option value="10" selected="">10</option>
                                                </select>
                                            </div>
                                            <div class="cart-item-buttons">
                                                <div class="cart-remove">
                                                    <button id="remove-from-cart" onclick="removeFromCart(${itemData.id})">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-price">
                                    <div class="badge-text"><span>30% off</span></div>
                                    <div class="current-price">
                                        <span class="money">
                                            <span class="currency-symbol">USD</span>
                                            <span class="currency-value">${itemData.price}</span>
                                        </span>
                                    </div>
                                    <div class="old-price">
                                        <span class="money price-strikethrough">
                                            <span class="currency-symbol">USD</span>
                                            <span class="currency-value">${itemData.discount}</span>
                                        </span>
                                    </div>
                                </div>
                        </div>
                    </div>
        `;

        // cartContainer.insertBefore(itemElement,cartContainer.firstChild);
        cartItemsdiv.appendChild(itemElement);

        document.getElementsByClassName("select-element")[0].value = quantity;

    });

    var total = subtotal + shipping;

    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    // document.getElementById("shipping").innerText = `$${shipping.toFixed(2)}`;
    document.getElementById("shipping").innerText = shipping.toFixed(2);
    document.getElementById("total").innerText = `$${total.toFixed(2)}`;
}