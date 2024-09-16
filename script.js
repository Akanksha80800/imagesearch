const accessKey = "z0uLhx7hWoqmnMItvryfdGE3agP7yOLOVwNVYN7o42KgUnCb4w3zfHBf";
// Select the HTML elements by their ID
const searchForm = document.getElementById("search-form"); // The form used for searching
const searchBox = document.getElementById("search-box"); // The input field where the user types their search query
const searchResult = document.getElementById("search-result"); // The area where search results will be displayed
const showMoreBtn = document.getElementById("show-more-btn"); // The button to load more results
const box = document.getElementById("box"); // The dropdown menu to select image or video

let keyword = ""; // Variable to store the search keyword
let page = 1; // Variable to keep track of the current page of results
let type = "image"; // Default to searching for images

// Function to search and display content based on the keyword and type
async function searchContent() {
    keyword = searchBox.value; // Get the search keyword from the input field
    type = box.value; // Get the selected type (image or video) from the dropdown menu

    let url; // Variable to store the API request URL
    if (type === "image") {
        // If searching for images, set the URL for image search
        url = `https://api.pexels.com/v1/search?page=${page}&query=${keyword}&per_page=12`;
    } else if (type === "video") {
        // If searching for videos, set the URL for video search
        url = `https://api.pexels.com/videos/search?page=${page}&query=${keyword}&per_page=12`;
    }

    // Fetch data from the Pexels API
    const response = await fetch(url, {
        headers: {
            Authorization: accessKey, // Include the API key in the request headers
        },
    });
    const data = await response.json(); // Parse the response JSON data

    if (page === 1) {
        searchResult.innerHTML = ""; // Clear previous search results if on the first page
    }

    const results = data[type === "image" ? "photos" : "videos"]; // Get the appropriate results array (photos or videos)

    // Loop through each result and display it
    results.forEach((result) => {
        const contentLink = document.createElement("a"); // Create a link element for each result

        if (type === "image") {
            // If the type is image, process image results
            if (result.src && (result.src.medium || result.src.large)) {
                // Check if the result has a source URL for medium or large images
                const imageUrl = result.src.medium || result.src.large; // Use medium image or fallback to large
                contentLink.href = imageUrl; // Set the link's href to the image URL
                contentLink.download = `image-${result.id}.jpg`; // Set the download attribute with a filename
                contentLink.target = "_blank"; // Open the link in a new tab

                const image = document.createElement("img"); // Create an image element
                image.src = imageUrl; // Set the image's src attribute to the image URL
                contentLink.appendChild(image); // Append the image to the link
                searchResult.appendChild(contentLink); // Append the link to the search results area
            } else {
                console.warn(`Image with ID ${result.id} has no medium or large src.`); // Log a warning if no suitable image URL is found
            }
        } else if (type === "video") {
            // If the type is video, process video results
            if (result.video_files && result.video_files.length > 0) {
                // Check if the result has video files
                const video = document.createElement("video"); // Create a video element
                video.src = result.video_files[0].link; // Set the video source to the first video file link
                video.controls = true; // Add controls to the video player
                contentLink.appendChild(video); // Append the video to the link
                searchResult.appendChild(contentLink); // Append the link to the search results area
            } else {
                console.warn(`Video with ID ${result.id} has no video files.`); // Log a warning if no video files are found
            }
        }
    });

    showMoreBtn.style.display = "block"; // Make the "Show More" button visible after displaying the results
}

// Add event listener for form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)
    page = 1; // Reset the page number to 1
    searchContent(); // Call the searchContent function to perform the search
});

// Add event listener for "Show More" button click
showMoreBtn.addEventListener("click", () => {
    page++; // Increment the page number to load the next set of results
    searchContent(); // Call the searchContent function to load more results
});
