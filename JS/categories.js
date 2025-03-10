function filterProduct(
  categoryId = 0,
  subcategoryId = null,
  minPrice = 0,
  maxPrice = 100000
) {
  // Clear the current products display
  const mainPag = document.getElementById("productsec");
  mainPag.innerHTML = "";

  // Find the selected category
  const categoryIndex = myData2.categories.findIndex(
    (cat) => cat.id === categoryId
  );
  //No Match
  if (categoryIndex === -1) {
    // console.error("Category not found");
    var notFoundimg = document.createElement("img");
    notFoundimg.src = "../Resources/Images/notfound.jpeg";
    mainPag.appendChild(notFoundimg);
    return;
  }

  // Get the subcategories to display
  let subcategoriesToShow = [];

  if (subcategoryId !== null) {
    // If a subcategory is specified, only show that one
    const subcategory = myData2.categories[categoryIndex].subcategories.find(
      (subcat) => subcat.id === subcategoryId
    );

    if (subcategory) {
      subcategoriesToShow.push(subcategory);
    } else {
      console.error("Subcategory not found");
      return;
    }
  } else {
    // Otherwise show all subcategories in this category
    subcategoriesToShow = myData2.categories[categoryIndex].subcategories;
  }

  // Loop through each relevant subcategory and filter products by price
  subcategoriesToShow.forEach((subcategory) => {
    // Filter products by price range
    const filteredProducts = subcategory.products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // Render the filtered products
    filteredProducts.forEach((product) => {
      renderProductCard(mainPag, categoryIndex, subcategory, product);
    });
  });

  // Set up favorite button functionality for the newly rendered cards
  const btnsFav = document.querySelectorAll(".favorite-btn");
  btnsFav.forEach((fav) => {
    fav.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });
}

// Extract the product card rendering logic into a separate function for reuse
function renderProductCard(container, categoryIndex, subcategory, product) {
  let imgCard = product.image[0];
  let priceCard = [product.discPrice, product.price, product.discount];
  let namCard = product.name;
  let vendorCard = product.vendor;

  let cardContain = document.createElement("div");
  let imgContain = document.createElement("img");
  let favbtn = document.createElement("div");
  let cardBody = document.createElement("div");
  let cardText = document.createElement("p");
  let cardVendor = document.createElement("div");
  let cardRev = document.createElement("div");
  let cardPrice = document.createElement("div");

  favbtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>`;
  imgContain.src = imgCard;
  cardText.innerText = namCard;
  cardRev.innerHTML = `<span class="star"
                ><span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span
              ></span>
              <span class="number">(4,336)</span>`;
  cardVendor.innerText = `ad by ${vendorCard}`;
  /*********Check if product has offer or not*****/
  if (priceCard[2] == null) {
    cardPrice.innerHTML = `<span>USD ${priceCard[1]}</span>`;
  } else {
    cardPrice.innerHTML = `<span>USD ${priceCard[1]}</span>
                  <span class="offer">
                    <span class="old-price"> USD ${priceCard[0]} </span>
                    <span class="discount"></span>(${priceCard[2]}% off)
                  </span>`;
  }
  cardContain.classList.add(
    "col-12",
    "col-sm-6",
    "col-md-4",
    "col-lg-4",
    "col-xl-3",
    "card",
    "product-card"
  );

  /*Set attribute */
  // card.setAttribute("P-ID", product.id);
  cardContain.setAttribute(
    "data-category-id",
    myData2.categories[categoryIndex].id
  );
  cardContain.setAttribute("subcategory-id", subcategory.id);
  cardContain.setAttribute("product-id", product.id);
  cardContain.setAttribute("price", product.price);

  /*Class List */
  cardContain.classList.add("product-card"); //Just to get it
  imgContain.classList.add("card-img-top");
  favbtn.classList.add("favorite-btn");
  cardBody.classList.add("card-body", "card-text");
  cardRev.classList.add("review");
  cardPrice.classList.add("price");
  cardText.classList.add("caption");
  cardVendor.classList.add("ad");

  /*Build Card Tree */
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardRev);
  cardBody.appendChild(cardPrice);
  cardBody.appendChild(cardVendor);
  cardContain.appendChild(imgContain);
  cardContain.appendChild(favbtn);
  cardContain.appendChild(cardBody);
  container.appendChild(cardContain);
}

// Update the onload function to set up filter controls
onload = function () {
  x();
  /**Fill page */
  async function x() {
    console.log("in x");
    res = await fetch("../Resources/JSON/data.json");
    myData2 = await res.json();

    /*Fill subCat */
    fillsubProduct();

    /*Fill product */
    fillProduct();

    // Set up favorite buttons
    var btnsFav = document.querySelectorAll(".favorite-btn");
    btnsFav.forEach((fav) => {
      fav.addEventListener("click", function () {
        this.classList.toggle("active");
      });
    });
    //Set up show prodct
    var card =
      // Set up category filter buttons (you need to add these to your HTML)
      setupFilterControls();
  }
};

function setupFilterControls() {
  const categorySelect = document.getElementById("category-select");
  const subcategorySelect = document.getElementById("subcategory-select");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const filterButton = document.getElementById("btn-apply");
  /* Drop down*/
  if (categorySelect) {
    myData2.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

    // Update subcategories when category changes
    categorySelect.addEventListener("change", function () {
      subcategorySelect.classList.remove("inactive");
      const selectedCategoryId = parseInt(this.value);
      const categoryIndex = myData2.categories.findIndex(
        (cat) => cat.id === selectedCategoryId
      );

      // Clear current subcategories
      subcategorySelect.innerHTML =
        '<option value="">All Subcategories</option>';

      // Add subcategories for selected category
      if (categoryIndex !== -1) {
        myData2.categories[categoryIndex].subcategories.forEach(
          (subcategory) => {
            const option = document.createElement("option");
            option.value = subcategory.id;
            option.textContent = subcategory.name;
            subcategorySelect.appendChild(option);
          }
        );
      } else {
        subcategorySelect.classList.add("inactive");
      }
    });
  }

  // Apply filter button
  if (filterButton) {
    filterButton.addEventListener("click", function () {
      const categoryId = parseInt(categorySelect.value) || 0;
      const subcategoryId = subcategorySelect.value
        ? parseInt(subcategorySelect.value)
        : null;
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || 100000;

      filterProduct(categoryId, subcategoryId, minPrice, maxPrice);
      const offcanvasElement = document.getElementById("offcanvasExample");
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      offcanvas.hide();
      /*************Category or subcat****************/
      if (subcategorySelect.value === "") {
        // console.log("null");
        fillsubProduct(categoryId - 1);
      } else {
        fillsubProduct(-1);
      }
    });
  }
}
function fillProduct(cat = 0) {
  // var cat = productID - 1;
  var mainPag = document.getElementById("productsec");

  for (
    let subcateg = 0;
    subcateg < myData2.categories[cat].subcategories.length;
    subcateg++
  ) {
    for (
      let pr = 0;
      pr < myData2.categories[cat].subcategories[subcateg].products.length;
      pr++
    ) {
      let imgCard =
        myData2.categories[cat].subcategories[subcateg].products[pr].image[0];
      let priceCard = [
        myData2.categories[cat].subcategories[subcateg].products[pr].discPrice,
        myData2.categories[cat].subcategories[subcateg].products[pr].price,

        myData2.categories[cat].subcategories[subcateg].products[pr].discount,
      ];
      let namCard =
        myData2.categories[cat].subcategories[subcateg].products[pr].name;
      let vendorCard =
        myData2.categories[cat].subcategories[subcateg].products[pr].vendor;
      // console.log(pr, imgCard, priceCard, vendorCard);-->test: done
      let cardContain = document.createElement("div");
      let imgContain = document.createElement("img");
      let favbtn = document.createElement("div");
      let cardBody = document.createElement("div");
      let cardText = document.createElement("p");
      let cardVendor = document.createElement("div");
      let cardRev = document.createElement("div");
      let cardPrice = document.createElement("div");

      favbtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>`;
      imgContain.src = imgCard;
      cardText.innerText = namCard;
      cardRev.innerHTML = `<span class="star"
                    ><span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star"></span
                  ></span>
                  <span class="number">(4,336)</span>`;
      cardVendor.innerText = `ad by ${vendorCard}`;
      /*********Check if product has offer or not*****/
      if (priceCard[2] == null) {
        cardPrice.innerHTML = `<span>USD ${priceCard[1]}</span>`;
      } else {
        cardPrice.innerHTML = `<span>USD ${priceCard[1]}</span>
                  <span class="offer">
                    <span class="old-price"> USD ${priceCard[0]} </span>
                    <span class="discount"></span>(${priceCard[2]}% off)
                  </span>`;
      }

      cardContain.classList.add(
        "col-12",
        "col-sm-6",
        "col-md-4",
        "col-lg-4",
        "col-xl-3",
        "card",
        "product-card"
      );
      // dont need to add attribute
      /*Class List */
      imgContain.classList.add("card-img-top");
      favbtn.classList.add("favorite-btn");
      cardBody.classList.add("card-body", "card-text");
      cardRev.classList.add("review");
      cardPrice.classList.add("price");
      cardText.classList.add("caption");
      cardVendor.classList.add("ad");
      /*Build Card Tree */
      cardBody.appendChild(cardText);
      cardBody.appendChild(cardRev);
      cardBody.appendChild(cardPrice);
      cardBody.appendChild(cardVendor);
      cardContain.appendChild(imgContain);
      cardContain.appendChild(favbtn);
      cardContain.appendChild(cardBody);
      mainPag.appendChild(cardContain);
    }
  }
}
function fillsubProduct(cat = 0) {
  var subcatSlider = document.getElementById("swiper-wrapper");
  //Already in one of sub cat
  if (cat == -1) {
    subcatSlider.innerText = "";
    return;
  }
  /**Make sure that empty */
  subcatSlider.innerText = "";
  for (
    let subcat = 0;
    subcat < myData2.categories[cat].subcategories.length;
    subcat++
  ) {
    /*Create slide */
    let swipCard = document.createElement("div");
    swipCard.classList.add(
      "swiper-slide",
      "subcat-item",
      "col-12",
      "col-sm-6",
      "col-md-3"
    );
    let subName = document.createElement("h2");
    subName.classList.add("cat-name");
    subName.innerText = myData2.categories[cat].subcategories[subcat].name;
    let subimg = document.createElement("img");
    subimg.src = myData2.categories[cat].subcategories[subcat].image;
    swipCard.appendChild(subimg);
    swipCard.appendChild(subName);
    subcatSlider.appendChild(swipCard);
    // console.log(myData2.categories[0].subcategories[subcat].name);
  }
}
