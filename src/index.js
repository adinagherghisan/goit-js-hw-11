import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const apiKey = "42449548-3afe96e5baf687cb33b4d7101";
let page = 1;
let searchQuery = "";
let lightbox = new SimpleLightbox('.gallery a');

const fetchImages = async (query) => {
    try {
        const response = await axios.get("https://pixabay.com/api/", {
            params: {
                key: apiKey,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: 40
            }
        });

        const totalHits = response.data.totalHits;

        if (totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        if (page === 1) {
            gallery.innerHTML = "";
        }

        response.data.hits.forEach(image => {
            const card = document.createElement("div");
            card.classList.add("photo-card");
            card.innerHTML = `
                <a href="${image.largeImageURL}">
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                    <p class="info-item"><b>Views:</b> ${image.views}</p>
                    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                </div>
            `;
            gallery.appendChild(card);
        });

        lightbox.refresh();

        if (totalHits > page * 40) {
            loadMoreBtn.style.display = "block";
        } else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.style.display = "none";
        }

        page++;
    } catch (error) {
        console.error("Error fetching images:", error);
        Notiflix.Notify.failure("Something went wrong. Please try again.");
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    page = 1;
    searchQuery = form.searchQuery.value.trim();
    fetchImages(searchQuery);
});

loadMoreBtn.addEventListener("click", () => {
    fetchImages(searchQuery);
});

const scrollToNext = () => {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

