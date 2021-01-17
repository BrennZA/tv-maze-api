const searchForm = document.querySelector("#searchForm");
const resultsContainer = document.querySelector("#resultsContainer");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateResults();
});

const generateResults = () => {
    const results = searchForm.elements.searchInput.value;
    const delay = Math.floor(Math.random() * 3000);
    setTimeout(async () => {
        if (delay < 3000) {
            try {
                const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${results}`);
                displayResults(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("CONNECTION TIMEOUT: PLEASE TRY AGAIN LATER...");
        }
    }, delay)
}

const displayResults = (results) => {
    clearResults(resultsContainer.children);
    for (let result of results) {
        const show = result.show;
        const showContainer = document.createElement("div");
        addImgAndName(show, showContainer);

        resultsContainer.appendChild(showContainer);
    }
}

const addImgAndName = (show, showContainer) => {
    if (show.image) {
        const showImage = document.createElement("img");
        showImage.src = show.image.medium;
        showContainer.appendChild(showImage);

        // NEW SHOW DETAILS DIV
        const showDetails = document.createElement("div"); 
        const showName = document.createElement("h2");
        showName.innerText = show.name;
        // MOVE SHOW NAME INTO SHOW DETAILS
        showDetails.appendChild(showName);

        // CHANGED SHOW CONTAINER PARAM TO SHOW DETAILS
        addSourceInfo(show, showDetails);
        // CHANGED SHOW CONTAINER PARAM TO SHOW DETAILS
        addShowDescription(show, showDetails);

        // CREATED SHOW CONTAINER APPEND SHOW DETAILS
        showContainer.appendChild(showDetails);
    }
}

// CHANGED SHOW CONTAINER PARAM BELOW TO SHOW DETAILS
const addSourceInfo = (show, showDetails) => {
    const sourceContainer = document.createElement("span");
    addShowChannel(show, sourceContainer);
    // CHANGED SHOW CONTAINER PARAM BELOW TO SHOW DETAILS
    addShowRuntime(show, showDetails, sourceContainer);
    // CHANGED SHOW CONTAINER APPEND TO SHOW DETAILS
    showDetails.appendChild(sourceContainer);
}

const addShowChannel = (show, sourceContainer) => {
    if (show.network) {
        const showChannel = document.createElement("a");
        showChannel.innerText = `${show.network.name} | `;
        sourceContainer.appendChild(showChannel);
    } else if (show.webChannel.name) {
        showChannel = document.createElement("a");
        showChannel.innerText = `${show.webChannel.name} | `;
        sourceContainer.appendChild(showChannel);
    }
}

// CHANGED SHOW CONTAINER PARAM BELOW TO SHOW DETAILS
const addShowRuntime = async (show, showDetails, sourceContainer) => {
    if (show.premiered) {
        sourceContainer.innerText += show.premiered.slice(0, 4);
        // MOVED SOURCE CONTAINER APPEND INTO SHOW CONTAINER BELOW
    }

    if (show.status.toLowerCase() === "running") {
        sourceContainer.innerText += " - Now";
    } else if (show.status.toLowerCase() === "ended") {
        if(show._links.previousepisode) {
            const res = await axios.get(show._links.previousepisode.href);
            const lastEpisode = res.data.airdate;
            sourceContainer.innerText += ` - ${lastEpisode.slice(0, 4)}`;
        }
    }
    // MOVED APPEND SOURCE CONTAINER TO SHOW DETAILS IN ADD SOURE INFO FUNCTION
}

// CHANGED SHOW CONTAINER PARAM BELOW TO SHOW DETAILS
const addShowDescription = (show, showDetails) => {
    const descriptionContainer = document.createElement("div");
    // REMOVED SHOW CONTAINER PARAM BELOW
    addShowGenre(show, descriptionContainer);
    // REMOVED SHOW CONTAINER PARAM BELOW
    addShowRating(show, descriptionContainer);
    // CHANGED SHOW CONTAINER PARAM BELOW TO SHOW DETAILS
    addShowSummary(show, showDetails, descriptionContainer);
}

// REMOVED SHOW CONTAINER PARAM BELOW
const addShowGenre = (show, descriptionContainer) => {
    if (show.genres) {
        const showGenre = document.createElement("span");
        showGenre.innerText = show.genres;
        descriptionContainer.appendChild(showGenre);
        // REMOVED SHOW CONTAINER APPEND BELOW         
    }
}

// REMOVED SHOW CONTAINER PARAM BELOW
const addShowRating = (show, descriptionContainer) => {
    if (show.rating.average) {
        const showRating = document.createElement("span");
        showRating.innerHTML = `<i class='fas fa-star'></i> ${show.rating.average}`;
        descriptionContainer.appendChild(showRating);
        // REMOVED SHOW CONTAINER APPEND TO BELOW
    }
}

// CHANGED SHOW CONTAINER PARAM TO SHOW DETAILS PARAM
const addShowSummary = (show, showDetails, descriptionContainer) => {
    const showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary;
    descriptionContainer.appendChild(showSummary);
    // CHANGED SHOW CONTAINER APPEND TO SHOW DETAILS APPEND
    showDetails.appendChild(descriptionContainer);
}

const clearResults = (results) => {
    while (results.length > 0) {
        results[0].remove();
    }
}
