import dataService from "./dataService.js";
//pagination for reviews -> adding buttons for pages dynamically dependinfg on number of reviews
let reviews = [];
const reviewsPerPage = 3;
let currentPage = 1;
let totalPages = Math.ceil(reviews.length / reviewsPerPage);
const paginationContainer = document.querySelector(".pagination");
const prevBtn = document.createElement("button");
const nextBtn = document.createElement("button");
prevBtn.classList.add("arrow", "prev");
nextBtn.classList.add("arrow", "next");
prevBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
nextBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
const fixedURL = "?cid=1&sid=11&pid=111";
window.history.pushState({}, "", fixedURL);

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch("../Resources/JSON/data.json");
    const data = await response.json();
    const categoryId = dataService.getCid();
    const subcategoryId = dataService.getSid();
    const productId = dataService.getPid();
    console.log(dataService.getCid()); // Should print "1"

    const category = data.categories.find((cat) => cat.id === categoryId);
    if (!category) return console.error("Category not found!");
    const subcategory = category.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    if (!subcategory) return console.error("Subcategory not found!");

    const product = subcategory.products.find((prod) => prod.id === productId);
    if (!product) return console.error("Product not found!");

    // Load carousel images
    fetchCarouselImages(product);
    // Load reviews and initialize pagination
    await fetchReviews(product);
    updateCollapsible(product); // to update collapsible details
    fetchProduct(product, category.name, subcategory.name);
    populateForm(category.name, subcategory.name, data);

    //local storage with form
    document
      .getElementById("addTocart")
      .addEventListener("click", function (event) {
        //prevent default behavior-> reload the page
        event.preventDefault();

        let dropdown1 = document.querySelectorAll(".dropdown select")[0].value;
        let dropdown2 = document.querySelectorAll(".dropdown select")[1].value;
        let personalization = document.querySelector("textarea").value;

        let cartItem = {
          productId: productId,
          subcategoryId: subcategoryId,
          categoryId: categoryId,
          option1: dropdown1,
          option2: dropdown2,
          personalization: personalization,
        };

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems.push(cartItem);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        window.location.href = `CartPage.html?cid=${categoryId}&sid=${subcategoryId}&pid=${productId}`;
        dataService.addToCart(categoryId, subcategoryId, productId, 1);
      });
  } catch (error) {
    console.error("Failed to fetch JSON:", error);
  }
}
function fetchCarouselImages(product) {
  var carouselInner = document.querySelector(
    "#productCarousel .carousel-inner"
  );
  var thumbnailList = document.querySelector(".thumbnail-list");

  // Clear HTML
  carouselInner.innerHTML = "";
  thumbnailList.innerHTML = "";
  carouselInner.classList.add("d-block", "w-100");

  product.image.forEach((imgSrc, index) => {
    const isActive = index === 0 ? "active" : "";
    const carouselItem = `<div class="carousel-item ${isActive}">
      <img class="productImg d-block w-100" src=${imgSrc} alt="Product Image ${
      index + 1
    }">
    </div>`;
    carouselInner.innerHTML += carouselItem;
    thumbnailList.innerHTML += `<img class="thumbnail mb-2 ${isActive}" src=${imgSrc} alt="Product Image ${
      index + 1
    }">`;
  });
  let thumbnails = document.querySelectorAll(".thumbnail");
  let carousel = new bootstrap.Carousel(
    document.querySelector("#productCarousel")
  );
  changePagination(thumbnails, carousel);
}

// Function to fetch reviews and initialize pagination
async function fetchReviews(product) {
  const reviewsDiv = document.getElementById("item-reviews");
  const reviewImagesContainer = document.getElementById(
    "reviewImagesContainer"
  );
  reviewImagesContainer.innerHTML = "";
  reviewsDiv.innerHTML = "";
  reviews = product.reviews || [];
  reviews.forEach((review) => {
    const reviewHTML = `<div class="review" data-rating=${
      review.stars
    } data-date=${review.date}>
      <div class="stars-black">${generateStars(parseInt(review.stars))}</div>
      <p>${review.text}</p>
      <div class="reviewer">
        <img src="${
          review.reviewerPhotoUrl || "../Resources/Images/Users/User2.jpg"
        }" alt="User Image">
        <span class="name">${review.author}</span>
        <span class="date">${new Date(review.date).toDateString()}</span>
      </div>
      <div class="ratings">
        <span>Item quality <span class="stars">${generateStars(
          review.ratings.itemQuality
        )}</span></span>
        <span>Shipping <span class="stars">${generateStars(
          review.ratings.shipping
        )}</span></span>
        <span>Customer service <span class="stars">${generateStars(
          review.ratings.customerService
        )}</span></span>
      </div>
    </div>`;
    reviewsDiv.innerHTML += reviewHTML;

    if (review.photoUrl) {
      const slide = document.createElement("div");
      slide.classList.add(
        "swiper-slide",
        "subcat-item",
        "col-12",
        "col-sm-6",
        "col-md-3"
      );
      slide.innerHTML = `<img src="${review.photoUrl}" alt="Review Image"/>`;
      reviewImagesContainer.appendChild(slide);
    }
  });

  new Swiper(".mySwiper", {
    loop: false,
    autoplay: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: "auto",
    spaceBetween: 0,
  });

  // Initialize pagination after reviews are loaded
  initializeReviewsAndPagination();
}

function initializeReviewsAndPagination() {
  const reviews = document.querySelectorAll(".review");
  totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (reviews.length === 0) {
    console.log("No reviews found! Pagination will not be created.");
    return;
  }

  createPaginationButtons();
  showReviews(currentPage);
}
function generateStars(starCount) {
  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    starsHtml += `<i class="${
      i < starCount ? "fa-solid fa-star" : "fa-regular fa-star"
    }"></i>`;
  }
  return starsHtml;
}

// dropdown options in form
document.querySelectorAll(".dropdown select").forEach((select) => {
  let arrowIcon = select.nextElementSibling; // get the arrow icon next to the select
  select.addEventListener("focus", function () {
    arrowIcon.classList.remove("fa-chevron-down");
    arrowIcon.classList.add("fa-chevron-up");
  });
  select.addEventListener("blur", function () {
    arrowIcon.classList.remove("fa-chevron-up");
    arrowIcon.classList.add("fa-chevron-down");
  });
});
//pagination of images (thumbnails)
let carousel = new bootstrap.Carousel(
  document.querySelector("#productCarousel")
);
// let thumbnails = document.querySelectorAll(".thumbnail");
// changePagination(thumbnails, carousel);
function changePagination(thumbnails, carousel) {
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", function () {
      thumbnails.forEach((th) => th.classList.remove("active"));
      thumb.classList.add("active");
      carousel.to(index); //jumps the Bootstrap Carousel to the slide at index
    });
  });
}

//collapsible part
const buttons = document.querySelectorAll(".collapsible-btn");
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const content = this.nextElementSibling;
    const icon = this.querySelector(".collapsible-icon");
    content.classList.toggle("active");
    icon.classList.toggle("rotate");
  });
});

// reviews tab toggle
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelector(".tab.active").classList.remove("active");
    this.classList.add("active");

    document
      .querySelectorAll(".reviews-list")
      .forEach((list) => (list.style.display = "none"));
    document.getElementById(this.dataset.target).style.display = "block";
  });
});

//create pages dynamically based on number of reviews
function createPaginationButtons() {
  paginationContainer.innerHTML = "";
  //add previous btn
  paginationContainer.appendChild(prevBtn);
  //add page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("circle");
    pageBtn.textContent = i;
    pageBtn.dataset.page = i; // data-page=i (custom attribute)
    if (i === 1) {
      pageBtn.classList.add("active");
    }
    pageBtn.addEventListener("click", function () {
      currentPage = parseInt(this.dataset.page);
      showReviews(currentPage);
    });
    paginationContainer.appendChild(pageBtn);
  }
  paginationContainer.appendChild(nextBtn);
}

function showReviews(page) {
  //page 2 start= 1*3=3, end= 3+3=6
  //reviews indices [0,1,2,3,4,5,6,7,8]
  //page 2 will display 3 to 5 (end-1)
  const start = (page - 1) * 3;
  const end = start + reviewsPerPage;
  const reviews = document.querySelectorAll(".review");

  reviews.forEach((review, index) => {
    review.style.display = index >= start && index < end ? "block" : "none";
  });

  document
    .querySelectorAll(".pagination button")
    .forEach((pageBtn) => pageBtn.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`).classList.add("active");

  if (page === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  if (page === totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

prevBtn.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    showReviews(currentPage);
  }
});

nextBtn.addEventListener("click", function () {
  if (currentPage < totalPages) {
    currentPage++;
    showReviews(currentPage);
  }
});

//heart button on carousel
document.querySelector(".heart-btn").addEventListener("click", function () {
  const heartIcon = this.querySelector("i");
  if (heartIcon.classList.contains("fa-regular")) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  } else {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  }
  this.classList.toggle("active");
});

// // drop down sorting
let sortDropdownBtn = document.getElementById("sortDropdownButton");
let sortDropdownMenu = document.querySelector(".custom-dropdown-menu");
let sortDropdown = document.querySelector(".custom-dropdown");
let items = document.querySelectorAll(".custom-dropdown-item");
let reviewsContainer = document.getElementById("item-reviews");

sortDropdownBtn.addEventListener("click", () => {
  sortDropdown.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  if (!sortDropdown.contains(event.target)) {
    sortDropdown.classList.remove("active");
  }
});

items.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selectedSort = event.target.getAttribute("data-sort"); // Get sorting type
    sortDropdownBtn.innerHTML = `<strong>Sort by: ${event.target.innerText}</strong><i class="fa fa-chevron-down collapsible-icon"></i>`;
    sortDropdown.classList.remove("active"); // Close dropdown
    sortReviews(selectedSort); // Call sorting function
  });
});

function sortReviews(criteria) {
  let reviews = Array.from(document.querySelectorAll(".review"));
  if (reviews) {
    console.log("reviews loaded el87");
  }
  switch (criteria) {
    case "recent":
      reviews.sort(
        (a, b) => new Date(b.dataset.date) - new Date(a.dataset.date)
      );
      break;
    case "high":
      reviews.sort((a, b) => b.dataset.rating - a.dataset.rating);
      break;
    case "low":
      reviews.sort((a, b) => a.dataset.rating - b.dataset.rating);
      break;
    default:
      reviews.sort((a, b) => a.dataset.index - b.dataset.index);
      break;
  }
  reviews.forEach((review) => reviewsContainer.appendChild(review));
}

//item details &shipping
function updateCollapsible(product) {
  const vendorName = product.vendor;
  // console.log(vendorName);
  const vendorElement = document.querySelector(
    ".highlight-list li:first-child strong"
  );

  if (vendorElement) {
    vendorElement.textContent = vendorName;
  }
  //materials
  const materials = product.materials;

  const materialsElement = document.querySelector(
    ".highlight-list li:nth-child(2)"
  );
  if (materials && materials.length > 0) {
    materialsElement.append(` ${materials.join(", ")}`);
  } else {
    materialsElement.remove();
  }
  //gemcolor
  const gemColor = product.gemColor;
  const gemColorElement = document.querySelector(
    ".highlight-list li:nth-child(3)"
  );
  if (gemColor) {
    gemColorElement.append(gemColor);
  } else {
    gemColorElement.remove();
  }
  //band color
  const bandColor = product.bandColor;
  const bandColorElement = document.querySelector(
    ".highlight-list li:nth-child(4)"
  );
  if (bandColor) {
    bandColorElement.append(bandColor);
  } else {
    bandColorElement.remove();
  }
  //style
  const Style = product.style;
  const styleElement = document.querySelector(
    ".highlight-list li:nth-child(5)"
  );
  if (Style) {
    styleElement.append(Style);
  } else {
    styleElement.append(Style);
  }
  //personalized
  const personalized = product.personalized;
  const personalizedElement = document.querySelector(
    ".highlight-list li:nth-child(6)"
  );
  if (personalized === true) {
    personalizedElement.append("Can be personalized");
  } else {
    personalizedElement.remove();
  }

  //recycled
  const recycled = product.recycled;
  const recyledElement = document.querySelector(
    ".highlight-list li:nth-child(7)"
  );
  if (recycled) {
    recyledElement.append("Recycled");
  } else {
    recyledElement.remove();
  }
  //made To Order
  const madeToOrder = product.madeToOrder;
  const madeToOrderElement = document.querySelector(
    ".highlight-list li:nth-child(8)"
  );
  if (madeToOrder) {
    madeToOrderElement.append("Made to Order");
  } else {
    madeToOrderElement.remove();
  }

  //shipping section
  const shipping = product.shipping;
  const startDate = new Date(shipping.estimatedDelivery.start);
  const endDate = new Date(shipping.estimatedDelivery.end);
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const shippingList = document.querySelectorAll(".highlight-list")[1];
  const orderDateElement = shippingList.querySelector(
    "li:nth-child(1) strong.underlined-text"
  );
  const returnPolicyElement = shippingList.querySelector(
    "li:nth-child(2) strong"
  );
  const shippingCostElement = shippingList.querySelector(
    "li:nth-child(3) strong"
  );
  const shipsFromElement = shippingList.querySelector("li:nth-child(4) strong");

  if (shipping.estimatedDelivery) {
    orderDateElement.textContent = `${diffDays} days`;
  }
  if (shipping.returnsAcceptedWithinDays) {
    returnPolicyElement.textContent = `${shipping.returnsAcceptedWithinDays} days`;
  }
  if (shipping.cost) {
    shippingCostElement.textContent = `USD ${shipping.cost.toFixed(2)}`;
  }
  if (shipping.shipsFrom) {
    shipsFromElement.textContent = shipping.shipsFrom;
  }
}

function fetchProduct(product, categoryName, subcategoryName) {
  // fill product description before form

  const price = parseFloat(product.price);
  const discPrice = parseFloat(product.discPrice);
  document.querySelector(".views").textContent = subcategoryName;
  document.querySelector(".discount-tag").textContent = product.discount + "%";
  document.querySelector(".price").innerHTML = `USD ${discPrice.toFixed(2)}+ 
      <span class="color-span text-decoration-line-through before-discount">USD ${price.toFixed(
        2
      )}</span>`;
  document.querySelector(".taxes").textContent =
    "Local taxes included (where applicable)";
  document.querySelector(".col-md-4 p:nth-of-type(2)").textContent =
    product.description;
  document.querySelector(".col-md-4 a").textContent = product.vendor;
}

//form
function populateForm(categoryName, subcategoryName, data) {
  const category = data.categories.find((cat) => cat.name === categoryName);
  const subcategory = category.subcategories.find(
    (sub) => sub.name === subcategoryName
  );
  const form = document.querySelector(".productForm form");
  const labels = form.querySelectorAll("label");
  const selects = form.querySelectorAll("select");

  let labelIndex = 0;

  Object.keys(subcategory.formFields).forEach((fieldId, index) => {
    const fieldData = subcategory.formFields[fieldId];
    while (
      labels[labelIndex] &&
      labels[labelIndex].textContent.includes("Add your personalization")
    ) {
      labelIndex++; //skip this label as it is static html
    }
    if (labels[labelIndex]) {
      labels[labelIndex].textContent = fieldData.label;
      labelIndex++;
    }
    const select = selects[index];
    if (select) {
      fieldData.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
      });
    }
  });
}
