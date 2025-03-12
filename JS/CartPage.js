import dataService from './dataService.js';

// Fetch the JSON file for products data 
dataService.fetchData()
    .then(data => {
        console.log(data); // Log the JSON data
        displayCartItems(data);
        setupEventListeners(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// passing data??? 
function setupEventListeners(data) {
    // Event Delegation 
    /* We attach a single click event listener to the .cart-items div, which is the parent of all the remove buttons element. */
    // Get the parent container of all the remove buttons
    var cartItemsContainer = document.getElementById('cart-items');
    // Add event listener for click on the container
    cartItemsContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a remove button inside the .cart-items div
        if (event.target.closest('#remove-from-cart')) {
            // Handle the click event for the remove button
            // const button = event.target.closest('#remove-from-cart');
            const item = event.target.closest('.cart-product');
            // console.log(item);
            dataService.removeFromCart(item.dataset.productId);
            displayCartItems(data);
        }

        // Check if the clicked element is an edit button inside the .cart-items div
        if (event.target.closest('#edit-cart-item')) {
            // Handle the click event for the edit button
            // const button = event.target.closest('#edit-cart-item');
            const item = event.target.closest('.cart-product');
            // Remove the item the user want to edit 
            dataService.removeFromCart(item.dataset.productId);
            // Redirect user back to product page so they can edit and re-add the product to cart
            window.location.href = `../HTML/productDetails.html?cid=${item.dataset.categoryId}&sid=${item.dataset.subcategoryId}&pid=${item.dataset.productId}`;
            // console.log(item.dataset.productId);
            displayCartItems(data);
        }
    });

    // Attach a single event listener to the cart items container (event delegation)
    cartItemsContainer.addEventListener('change', function (event) {
        // Get the closest cart item element ie. the user clicked on
        const item = event.target.closest('.cart-product');

        // Get the quantity of this specific cart item
        const itemQty = event.target.closest('.select-element');
        
        // Update quantity in local storage 
        dataService.updateQuantity(item.dataset.productId,itemQty.value);

        // Re-render to update areas in cart that are affected by quantity
        displayCartItems(data);
    });
}

// Function to render the cart
function displayCartItems(data) {
    // var cartContainer = document.getElementById("cart");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) // cId,sId,pId,quantity
    
    var cartItemsdiv = document.getElementById("cart-items");
    cartItemsdiv.innerHTML = ''; // Clear previous content

    // If cart is empty
    var cartEmptydiv = document.getElementById("cart-empty");
    var orderPricediv = document.getElementById("order-price");
    if(cartItems.length == 0){
        cartEmptydiv.style.display = "block";
        orderPricediv.style.display = "none";
        return;
    } else {
        cartEmptydiv.style.display = "none";
        orderPricediv.style.display = "block";
    }
    
    var itemSTotal = 0;
    var totalDisc = 0;
    var subtotal = 0;
    var shipping = 18.08;
    var totalQty = 0;

    cartItems.forEach((item, index) => {
        // console.log(index);
        var cId = parseInt(item.categoryId);
        var sId = parseInt(item.subcategoryId);
        var pId = parseInt(item.productId);
        var quantity = parseInt(item.quantity);

        var cat = data.categories.find(cat => cat.id === cId);
        var sub = cat.subcategories.find(sub => sub.id === sId);
        var product = sub.products.find(prod => prod.id === pId);

        // let itemData = data.categories[cId].subcategories[sId].products[pId];
        var itemData = product;

        var itemTotal = parseFloat(itemData.price) * quantity;
        var itemDiscPrice = (parseFloat(itemData.discPrice) -  parseFloat(itemData.price)) * quantity;
        
        itemSTotal += itemTotal;
        totalDisc += itemDiscPrice;
        subtotal = itemSTotal - totalDisc;
        totalQty += quantity;
        // console.log(totalQty);

        var itemElement = document.createElement("div");
        itemElement.classList = "cart-product grid-item cart-content-left";
        itemElement.setAttribute("data-category-id", cat.id);
        itemElement.setAttribute("data-subcategory-id", sub.id);
        itemElement.setAttribute("data-product-id", product.id);

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
                        <div class="product-img" style="width: 190px; height: 190px;">
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
                                                <div class="cart-edit">
                                                    <button id="edit-cart-item">Edit</button>
                                                </div>
                                                <div class="cart-remove">
                                                    <button id="remove-from-cart">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-price">
                                    <div class="badge-text"><span>${itemData.discount}% off</span></div>
                                    <div class="current-price">
                                        <span class="money">
                                            <span class="currency-symbol">USD</span>
                                            <span class="currency-value">${itemData.price}</span>
                                        </span>
                                    </div>
                                    <div class="old-price">
                                        <span class="money price-strikethrough">
                                            <span class="currency-symbol">USD</span>
                                            <span class="currency-value">${itemData.discPrice}</span>
                                        </span>
                                    </div>
                                </div>
                        </div>
                    </div>
        `;

        // cartContainer.insertBefore(itemElement,cartContainer.firstChild);
        cartItemsdiv.appendChild(itemElement);

        document.getElementsByClassName("select-element")[index].value = quantity;

    });

    var total = subtotal + shipping;

    document.getElementById("items-total").innerText = itemSTotal.toFixed(2);
    document.getElementById("total-discount").innerText = totalDisc.toFixed(2);
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    // document.getElementById("shipping").innerText = `$${shipping.toFixed(2)}`;
    document.getElementById("shipping").innerText = shipping.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);

    document.getElementById("total-qty").innerText = totalQty;
}