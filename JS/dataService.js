/**
Fetching data.json.
Storing the fetched data.
Providing access to the data for other modules.
*/

let data = null; // To hold the fetched data

async function fetchData() {
  if (data) {
    return data; // If already fetched, return the existing data
  }

  try {
    const response = await fetch("../Resources/JSON/data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to handle it elsewhere if needed
  }
}

/* Common Functions */

// Add product to favorites
function addFavorite(categoryId, subcategoryId, productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // if(favorites.includes({categoryId, productId})) {
  //     favorites = favorites.filter(item => item[0] !== categoryId && item[1] !== productId);
  //     alert(productId + " removed from favorites!");
  // } else {
  //     favorites.push({categoryId, productId});
  //     alert(productId + " added to favorites!");
  // }

  var isFavorited = favorites.some((fav) => {
    return (
      fav.categoryId === categoryId &&
      fav.subcategoryId === subcategoryId &&
      fav.productId === productId
    );
  });
  // console.log(isFavorited);
  if (!isFavorited) {
    favorites.push({ categoryId, subcategoryId, productId });
    // alert(productId + " added to favorites!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

    showNotification("Product added to favorites",'fav');
}

// Remove product from favorites
function removeFavorite(cId, sId, pId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let index = favorites.findIndex(
    (f) => f.categoryId == cId && f.subcategoryId == sId && f.productId == pId
  );
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  // alert(pId + " removed from favorites!");
    showNotification("Product removed from favorites",'fav');
}

function toggleFav(button, categoryId, subcategoryId, productId) {
  const icon = button.querySelector("img");

  // Toggle the icon to indicate if the item is favorited or not
  if (icon.src.includes("fav-icon-2.png")) {
    icon.src = "../Resources/Images/fav-icon-2-fill.png"; // Change to filled icon
    addFavorite(categoryId, subcategoryId, productId);
  } else {
    icon.src = "../Resources/Images/fav-icon-2.png"; // Change back to unfilled icon
    removeFavorite(categoryId, subcategoryId, productId);
  }

  // Log which item was favorited
  // console.log('Favorited item:', button);
}

// function showNotification() {
//     var notification = document.getElementById('notification');
//     notification.classList.add('show');

//     // Hide the notification after 3 seconds
//     setTimeout(() => {
//         notification.classList.remove('show');
//     }, 3000);
// }

// Function to add item to cart
// function addToCart(cId, sId, pId, quantity) {
function addToCart(item) {
    let cartCount = JSON.parse(localStorage.getItem("cartCount")) || 0;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // cartItems.push({ cId, sId, pId, quantity });
    let product = cartItems.find(prod => prod.productId === item.productId);
    console.log(product);
    if(product) {
        product.quantity = String(parseInt(product.quantity) + 1);
    } else {
        cartItems.push(item);

        cartCount++;
        localStorage.setItem("cartCount", JSON.stringify(cartCount));
        updateCartBadge();
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    showNotification("Product added to cart",'cart');
}

// Function to remove item from cart
function removeFromCart(pId) {
    // cId, sId,
    let cartCount = JSON.parse(localStorage.getItem("cartCount")) || 0;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    cartItems = cartItems.filter((item) => item.productId !== pId);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    if (cartCount > 0) {
        cartCount--;
        localStorage.setItem("cartCount", JSON.stringify(cartCount));
    }
    updateCartBadge();

}

function updateCartBadge() {
    var cartBadge = document.getElementById("cart-badge");
    // Load cart count from localStorage (or set to 0 if not found)
    var cartCount = localStorage.getItem("cartCount")
        ? parseInt(localStorage.getItem("cartCount"))
        : 0;

    if (cartCount > 0) {
        // cartBadge.style.display = 'inline-block';
        cartBadge.style.display = "block";
        cartBadge.textContent = cartCount;
    } else {
        // cartBadge.style.display = 'none';
        cartBadge.style.display = "none";
    }

  // Save the updated count to localStorage
  // localStorage.setItem('cartCount', cartCount);
}

// Function to update quantity
function updateQuantity(itemId, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let item = cartItems.find((item) => item.productId === itemId);

    if (item) {
        item.quantity = parseInt(newQuantity);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Validate a field and show error message in cart forms
function validateField(input, errorElement) {
    if (errorElement) {
        if (!input.validity.valid) {
        errorElement.style.display = "block";
        return false;
        } else {
        errorElement.style.display = "none";
        return true;
        }
    }
}

// function showNotification() {
//     const popup = document.getElementById('popup');
//     popup.classList.add('show');

//     // Hide the notification after 3 seconds
//     setTimeout(() => {
//         popup.classList.remove('show');
//     }, 3000);
// }

function showNotification(message, type) {
    // Create the popup element
    const popup = document.createElement('div');
    popup.className = 'notification';
    let img, btntxt, btnURL;
    if(type == 'fav'){
        img = 'https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png'
        btntxt = 'Go to Favorites';
        btnURL = '../HTML/FavPage.html'
    } else if(type == 'cart'){
        img = 'https://img.icons8.com/ios-glyphs/30/FFFFFF/shopping-cart--v1.png'
        btntxt = 'Go to Cart';
        btnURL = '../HTML/CartPage.html'
    }
    popup.innerHTML = `<img src="${img}"><span>${message}</span>`;
    if(!window.location.href.includes("/HTML/CartPage.html") && !window.location.href.includes("/HTML/FavPage.html")) {
        popup.innerHTML += `<button onclick="location.href='${btnURL}'">${btntxt}</button>`;
    }

    // Add the popup to the body
    document.body.appendChild(popup);

    // Trigger show animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    // Auto-hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300); // Wait for animation to finish before removing
    }, 5000);
}

function getCid() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("cid"));
}

function getSid() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("sid"));
}

function getPid() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("pid"));
}

// makes the function available to the other scripts.
export default {
  fetchData,
  addFavorite,
  removeFavorite,
  toggleFav,
  addToCart,
  removeFromCart,
  updateCartBadge,
  updateQuantity,
  getCid,
  getSid,
  getPid,
  validateField,
    showNotification,
};
