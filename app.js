const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

// Load Recommended Images on Page Load
async function loadRecommendedImages() {
    const url = `https://api.unsplash.com/photos/random?count=6&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    data.forEach((result) => {
        createImageCard(result);
    });

    showMoreButtonEl.style.display = "none"; // Hide Show More initially
}

// Function to Search Images
async function searchImages() {
    inputData = searchInputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
        searchResultsEl.innerHTML = ""; // Clear previous results
    }

    data.results.forEach((result) => {
        createImageCard(result);
    });

    page++;

    if (data.results.length > 0) {
        showMoreButtonEl.style.display = "block";
    }
}

// Function to Create Image Card
function createImageCard(result) {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("search-result");

    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;

    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";
    imageLink.textContent = result.alt_description || "View Image";

    // Create Download Button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.classList.add("download-btn");

    // Show Confirmation Dialog Before Downloading
    downloadButton.addEventListener("click", () => {
        showConfirmationDialog(result.urls.full);
    });

    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    imageWrapper.appendChild(downloadButton);
    searchResultsEl.appendChild(imageWrapper);
}

// Function to Show Confirmation Dialog
function showConfirmationDialog(imageURL) {
    const confirmationBox = document.createElement("div");
    confirmationBox.classList.add("confirmation-box");

    confirmationBox.innerHTML = `
        <p>Do you want to download this image?</p>
        <button class="confirm-yes">Yes</button>
        <button class="confirm-no">Cancel</button>
    `;

    document.body.appendChild(confirmationBox);

    document.querySelector(".confirm-yes").addEventListener("click", async () => {
        await downloadImage(imageURL);
        document.body.removeChild(confirmationBox);
    });

    document.querySelector(".confirm-no").addEventListener("click", () => {
        document.body.removeChild(confirmationBox);
    });
}

// Function to Download Image
async function downloadImage(imageURL) {
    try {
        const response = await fetch(imageURL, { cache: "no-cache" });
        const blob = await response.blob();
        const blobURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "image.jpg";
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobURL);
        }, 1000);
    } catch (error) {
        console.error("Download failed:", error);
    }
}

// Event Listeners
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
    searchImages();
});

// Load Recommended Images when Page Loads
window.onload = loadRecommendedImages;
