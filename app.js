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

        const showName = document.createElement("h2");
        showName.innerText = show.name;
        showContainer.appendChild(showName);

        addSourceInfo(show, showContainer);
        addShowDescription(show, showContainer);
    }
}

const addSourceInfo = (show, showContainer) => {
    const sourceContainer = document.createElement("span");
    addShowChannel(show, sourceContainer);
    addShowRuntime(show, showContainer, sourceContainer);
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

const addShowRuntime = async (show, showContainer, sourceContainer) => {
    if (show.premiered) {
        sourceContainer.innerText += show.premiered.slice(0, 4);
        showContainer.appendChild(sourceContainer);
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
}

const addShowDescription = (show, showContainer) => {
    const descriptionContainer = document.createElement("div");
    addShowGenre(show, showContainer, descriptionContainer);
    addShowRating(show, showContainer, descriptionContainer);
    addShowSummary(show, showContainer, descriptionContainer);
}

const addShowGenre = (show, showContainer, descriptionContainer) => {
    if (show.genres) {
        const showGenre = document.createElement("span");
        showGenre.innerText = show.genres;
        descriptionContainer.appendChild(showGenre);
        showContainer.appendChild(descriptionContainer);
    }
}

const addShowRating = (show, showContainer, descriptionContainer) => {
    if (show.rating.average) {
        const showRating = document.createElement("span");
        showRating.innerHTML = `<i class='fas fa-star'></i> ${show.rating.average}`;
        descriptionContainer.appendChild(showRating);
        showContainer.appendChild(descriptionContainer);
    }
}

const addShowSummary = (show, showContainer, descriptionContainer) => {
    const showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary;
    descriptionContainer.appendChild(showSummary);
    showContainer.appendChild(descriptionContainer);
}

const clearResults = (results) => {
    while (results.length > 0) {
        results[0].remove();
    }
}
