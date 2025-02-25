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
let thumbnails = document.querySelectorAll(".thumbnail");
changePagination(thumbnails, carousel);
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
//sort dropdown menu

const dropdownBtn = document.getElementById("customDropdownButton");
const dropdownMenu = document.querySelector(".custom-dropdown-menu");

// Toggle dropdown menu on button click
dropdownBtn.addEventListener("click", function () {
  dropdownMenu.classList.toggle("show");
});

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  if (
    !dropdownBtn.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownMenu.classList.remove("show");
  }
});

//pagination for reviews -> adding buttons for pages dynamically dependinfg on number of reviews
const reviewsPerPage = 3;
const reviews = document.querySelectorAll(".review");
let currentPage = 1;
let totalPages = Math.ceil(reviews.length / reviewsPerPage);
const paginationContainer = document.querySelector(".pagination");
const prevBtn = document.createElement("button");
const nextBtn = document.createElement("button");
prevBtn.classList.add("arrow", "prev");
nextBtn.classList.add("arrow", "next");
prevBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
nextBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;

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
//create button pagination
createPaginationButtons();
//showing the first page by default
showReviews(currentPage);

const swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  slidesPerView: "auto",
  spaceBetween: 0,
});
