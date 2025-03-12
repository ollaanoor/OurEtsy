//async to avoid error  "Uncaught SyntaxError: import declarations may only appear at top level of a module"
let dataService; // Declare globally

async function loadModule() {
  const module = await import("./dataService.js");
  dataService = module.default;
}
loadModule();

function filterProduct(
  categoryId = 0,
  subcategoryId = null,
  minPrice = 0,
  maxPrice = 100000,
  discountprice = false
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
  /***title and Desc**/
  //Get categories & subcategories name, and Categories desc
  const categoryName = myData2.categories[categoryIndex].name;
  const categoryDesc = myData2.categories[categoryIndex].title;

  if (subcategoryId) {
    // console.log(subcategoryId);---> becarful 22 not 2
    var temp = (subcategoryId % 10) - 1;
    // console.log("temp");
    fillsubProduct(-1);

    const subCategoryName =
      myData2.categories[categoryId - 1].subcategories[temp].name;
    document.getElementById("tiltlePage").innerText = subCategoryName;
    document.getElementById(
      "breadpath"
    ).innerHTML = `<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb col-12">
        <li class="breadcrumb-item" id="breadcrumb-item-head"><a href="#">${categoryName}</a></li>
        <li class="breadcrumb-item active" aria-current="page">${subCategoryName}</li>
      </ol>
    </nav>`;
    document
      .getElementById("breadcrumb-item-head")
      .setAttribute("cidcrumb", categoryId);
  } else {
    document.getElementById("tiltlePage").innerText = categoryName;
    document.getElementById("page-caption").innerText = categoryDesc;
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
    // if no sub cat selected show all subcategories in this category
    subcategoriesToShow = myData2.categories[categoryIndex].subcategories;
  }

  // Loop through each relevant subcategory and filter products by price
  subcategoriesToShow.forEach((subcategory) => {
    // Filter products by price range
    let filteredProducts = subcategory.products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    if (discountprice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.discount != null
      );
    }

    // Render the filtered products
    filteredProducts.forEach((product) => {
      renderProductCard(mainPag, categoryIndex, subcategory, product);
    });
  });
  setupEventListeners();
}

// Extract the product card rendering logic into a separate function for reuse
function renderProductCard(container, categoryIndex, subcategory, product) {
  let imgCard = product.image[0];
  let priceCard = [product.discPrice, product.price, product.discount];
  let namCard = product.name;
  let vendorCard = product.vendor;
  let viewNumber = product.reviewsNum;
  let starsNumber; //make sure that u have review
  if (product.hasOwnProperty("reviews")) {
    starsNumber =
      product.reviews.length != 0 //may be there with no element in there
        ? product.reviews.reduce((sum, rev) => sum + rev.stars, 0) /
          product.reviews.length
        : 0;
  } else {
    starsNumber = 0;
    // console.log("No");
  }

  // console.log(starsNumber);
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
              <span class="number">(${viewNumber})</span>`;
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
  cardContain.setAttribute("category-id", myData2.categories[categoryIndex].id);
  cardContain.setAttribute("subcategory-id", subcategory.id);
  cardContain.setAttribute("product-id", product.id);
  cardContain.setAttribute("price", product.price);

  /*Class List */
  // cardContain.classList.add("product-card"); //Just to get it
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

onload = function () {
  x();
  /**Fill page */
  async function x() {
    console.log("in x");
    res = await fetch("../Resources/JSON/data.json");
    myData2 = await res.json();
    const urlParams = new URLSearchParams(window.location.search);
    const cid = urlParams.get("cid");
    const sid = urlParams.get("sid");
    const categoryIndex = myData2.categories.findIndex((cat) => cat.id == cid);
    const categoryName = myData2.categories[categoryIndex].name;
    const categoryDesc = myData2.categories[categoryIndex].title;
    if (categoryIndex !== -1) {
      const mainPag = document.getElementById("productsec");
      if (sid) {
        var temp = (sid % 10) - 1;
        fillsubProduct(-1);

        const subCategoryName =
          myData2.categories[cid - 1].subcategories[temp].name;
        document.getElementById("tiltlePage").innerText = subCategoryName;
        const subcategory = myData2.categories[categoryIndex].subcategories //subcateg obj not just index
          .find((sub) => sub.id == sid);
        subcategory.products.forEach((p) => {
          renderProductCard(mainPag, categoryIndex, subcategory, p);
        });
        var temp = (sid % 10) - 1;
        // console.log("temp");
        fillsubProduct(-1);

        document.getElementById(
          "breadpath"
        ).innerHTML = `<nav style="--bs-breadcrumb-divider: '/';" aria-label="breadcrumb">
      <ol class="breadcrumb col-12">
        <li class="breadcrumb-item" id="breadcrumb-item-head"><a href="#">${categoryName}</a></li>
        <li class="breadcrumb-item active" aria-current="page">${subCategoryName}</li>
      </ol>
    </nav>`;
        document
          .getElementById("breadcrumb-item-head")
          .setAttribute("cidcrumb", cid);
      } else {
        document.getElementById("tiltlePage").innerText = categoryName;
        document.getElementById("page-caption").innerText = categoryDesc;
        fillsubProduct(categoryIndex);
        myData2.categories[categoryIndex].subcategories.forEach((subcat) => {
          subcat.products.forEach((p) => {
            renderProductCard(mainPag, categoryIndex, subcat, p);
          });
        });
      }
      setupEventListeners();
    }
    //Set up show prodct, and git element to sort

    var card = setupFilterControls();
  }
};
function setupEventListeners() {
  //Set up event listener on card
  const productCard = document.querySelectorAll(".product-card");
  productCard.forEach((card) => {
    card.addEventListener("click", function () {
      // console.log(this.getAttribute("product-id"));
      //new method with link
      const cid = this.getAttribute("category-id");
      const sid = this.getAttribute("subcategory-id");
      const pid = this.getAttribute("product-id");
      window.location.href = `productDetails.html?cid=${cid}&sid=${sid}&pid=${pid}`;
    });
  });

  // Set up favorite button functionality for the newly rendered cards
  const btnsFav = document.querySelectorAll(".favorite-btn");
  btnsFav.forEach((fav) => {
    fav.addEventListener("click", function (e) {
      // Stop the event from go up to the card
      e.stopPropagation();
      this.classList.toggle("active");
      loadModule().then(() => {
        if (fav.classList.contains("active")) {
          dataService.addFavorite(
            fav.parentElement.getAttribute("category-id"),
            fav.parentElement.getAttribute("subcategory-id"),
            fav.parentElement.getAttribute("product-id")
          );
        } else {
          dataService.removeFavorite(
            fav.parentElement.getAttribute("category-id"),
            fav.parentElement.getAttribute("subcategory-id"),
            fav.parentElement.getAttribute("product-id")
          );
        }
      });
    });
  });

  //breadcrumb
  const breadlink = document.getElementById("breadcrumb-item-head");
  if (breadlink) {
    breadlink.addEventListener("click", () => {
      breadlink.parentElement.innerHTML = "";
      window.location.href = `categorypage.html?cid=${parseInt(
        breadlink.getAttribute("cidcrumb")
      )}`;
      // filterProduct(parseInt(breadlink.getAttribute("cid")));
    });
  }
}

function setupFilterControls() {
  const categorySelect = document.getElementById("category-select");
  const subcategorySelect = document.getElementById("subcategory-select");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const discountinput = document.getElementById("on-sale");
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
      const discount = discountinput.checked;
      filterProduct(categoryId, subcategoryId, minPrice, maxPrice, discount);
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
    //add attribute to use it in clicked
    swipCard.setAttribute(
      "subcat-id",
      myData2.categories[cat].subcategories[subcat].id
    );
    swipCard.setAttribute("cat-id", myData2.categories[cat].id);
    // console.log(swipCard.getAttribute("subcat-id"));
    // console.log(myData2.categories[0].subcategories[subcat].name);
  }
  //Set up event listener on subcat
  const subCatCard = document.querySelectorAll(".subcat-item");
  if (subCatCard) {
    // console.log(subCatCard);
    subCatCard.forEach((card) => {
      card.addEventListener("click", function () {
        const cid = parseInt(card.getAttribute("cat-id"));
        const sid = parseInt(card.getAttribute("subcat-id"));
        window.location.href = `categorypage.html?cid=${cid}&sid=${sid}`;
      });
    });
  }
}
