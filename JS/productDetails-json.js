let reviews = [];
const reviewsPerPage = 3; // FIXED: Defined reviewsPerPage
let currentPage = 1;
let totalPages = 1;
const paginationContainer = document.querySelector(".pagination"); // FIXED: Ensure paginationContainer is selected
const prevBtn = document.createElement("button");
const nextBtn = document.createElement("button");
prevBtn.classList.add("arrow", "prev");
nextBtn.classList.add("arrow", "next");
prevBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
nextBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch("../Resources/JSON/data.json");
    const data = await response.json();
    reviews = data.categories[0].subcategories[0].products[1].reviews || [];

    await fetchReviews(data);
    // updateCollapsible(data);
    // fetchProduct(data);
  } catch (error) {
    console.error("Failed to fetch JSON:", error);
  }
}

async function fetchReviews(data) {
  const reviewsDiv = document.getElementById("item-reviews");
  reviewsDiv.innerHTML = "";
  reviews = data.categories[0].subcategories[0].products[1].reviews; // FIXED: Assign to global `reviews`

  if (reviews.length === 0) {
    console.log("No reviews found!");
  }

  reviews.forEach((review) => {
    const reviewHTML = `<div class="review" data-rating=${
      review.stars
    } data-date=${review.date}>
      <div class="stars-black">${generateStars(review.stars)}</div>
      <p>${review.text}</p>
      <div class="reviewer">
        <img src="${
          review.reviewerPhotoUrl || "../Resources/Images/User2.jpg"
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
  });

  initializeReviewsAndPagination();
}

function initializeReviewsAndPagination() {
  const reviewElements = document.querySelectorAll(".review"); // FIXED: Select elements after DOM update
  totalPages = Math.ceil(reviewElements.length / reviewsPerPage);

  if (reviewElements.length === 0) {
    console.log("No reviews found! Pagination will not be created.");
    return;
  }

  createPaginationButtons();
  showReviews(currentPage);
}

function createPaginationButtons() {
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("circle");
    pageBtn.textContent = i;
    pageBtn.dataset.page = i;
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
  const start = (page - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  const reviewElements = document.querySelectorAll(".review"); // FIXED: Select elements dynamically

  reviewElements.forEach((review, index) => {
    review.style.display = index >= start && index < end ? "block" : "none";
  });

  document
    .querySelectorAll(".pagination button")
    .forEach((pageBtn) => pageBtn.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`).classList.add("active");

  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === totalPages;
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
function generateStars(starCount) {
  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    starsHtml += `<i class="fa-solid fa-star ${
      i < starCount ? "filled" : "empty"
    }"></i>`;
  }
  return starsHtml;
}
