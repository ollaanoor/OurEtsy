window.onload = function(){
    displayFavorites();
}

// Display favorites on the favorites page
function displayFavorites() {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var favoritesList = document.getElementById('favorites-list');

    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite products yet.</p>';
        return;
    }

    favorites.forEach((item, index) => {
        favoritesList.innerHTML += `
            <div class="grid-item fav-card">
                        <div class="fav-btn">
                            <button href="#" type="button">
                                <img src="../Resources/Images/fav-icon-2-fill.png" alt="favorites">
                            </button>
                        </div>
                        <img src="../Resources/Images/grid-item-1.png">
                        <div class="fav-card-info">
                            <h3>
                                14k Solid Gold Mother's Ring / 3 Stone Gold Birthstone Ring for Mom / Personalized Gift Ring for Women / Gifts for Grandma / Birthday Gift
                            </h3>
                            <p>Juvalin</p>
                            <div>
                                <span class="currency-symbol">USD</span>
                                <span class="currency-value">189.00</span>
                            </div>
                        </div>
                    </div>
        `;
    });
}

// Remove product from favorites
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}