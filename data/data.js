import { galleryGrid } from "../components/gallery/gallery.js";
import { modal } from "../components/modal/modal.js";
import { nextPage } from "../components/footer/footer.js";

const gallery = document.querySelector("#image-grid");
const footer = document.querySelector("footer");
footer.innerHTML = nextPage();

let currentPage = 1;
let lastUserInput;

export const fetchPhotos = async (
  userInput = "technology",
  page = 1,
  perPage = 15
) => {
  const accessKey = "fP-RjlG-8xBqIFbPtw-sWMqxaK1zUYzf1R6ZRJ1BDoc";

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${userInput}&page=${page}&per_page=${perPage}&client_id=${accessKey}`
    );
    const allPhotos = await res.json();
    console.log(allPhotos);
    const photosArray = allPhotos.results;

    gallery.innerHTML = "";

    photosArray.forEach((photo) => {
      gallery.innerHTML += galleryGrid(photo);
    });

    if (photosArray.length === 0) {
      gallery.innerHTML = modal();
      footer.innerHTML = "";

      const suggestedButtons = document.querySelectorAll(".suggested-button");
      suggestedButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const inputValue = button.textContent;
          fetchPhotos(inputValue, currentPage);
          footer.innerHTML = nextPage();
          flipPage();
        });
      });
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
};

export const renderPhotos = () => {
  const searchForm = document.querySelector("#search-form");
  const input = document.querySelector("#search");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    lastUserInput = input.value;
    console.log(lastUserInput);
    if (lastUserInput) {
      currentPage = 1;
      fetchPhotos(lastUserInput, currentPage);
    } else {
      console.log("No photos found.");
    }
  });
};

export const flipPage = () => {
  const nextPageButton = document.querySelector(".next-page-button");
  const nextPageText = document.querySelector(".next-page-text");

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    nextPageText.textContent = currentPage;
    fetchPhotos(lastUserInput, currentPage);
  });
};
