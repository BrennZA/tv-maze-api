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
        const showContainer = document.createElement("div");
        addImgAndName(result, showContainer);

        resultsContainer.appendChild(showContainer);

        console.log(result.show)
    }
}

const addImgAndName = (result, showContainer) => {
    if (result.show.image) {
        const showImage = document.createElement("img");
        showImage.src = result.show.image.medium;
        showContainer.appendChild(showImage);

        const showName = document.createElement("h2");
        showName.innerText = result.show.name;
        showContainer.appendChild(showName);

        addSourceInfo(result, showContainer);
        addShowDescription(result, showContainer);
    }
}

const addSourceInfo = (result, showContainer) => {
    const sourceContainer = document.createElement("span");
    addShowChannel(result, sourceContainer);
    addShowRuntime(result, showContainer, sourceContainer);
}

const addShowChannel = (result, sourceContainer) => {
    if (result.show.network) {
        const showChannel = document.createElement("a");
        showChannel.innerText = `${result.show.network.name} | `;
        sourceContainer.appendChild(showChannel);
    } else if (result.show.webChannel.name) {
        showChannel = document.createElement("a");
        showChannel.innerText = `${result.show.webChannel.name} | `;
        sourceContainer.appendChild(showChannel);
    }
}

const addShowRuntime = async (result, showContainer, sourceContainer) => {
    if (result.show.premiered) {
        sourceContainer.innerText += result.show.premiered.slice(0, 4);
        showContainer.appendChild(sourceContainer);
    }

    if (result.show.status.toLowerCase() === "running") {
        sourceContainer.innerText += " - Now";
    } else if (result.show.status.toLowerCase() === "ended") {
        if(result.show._links.previousepisode) {
            const res = await axios.get(result.show._links.previousepisode.href);
            const lastEpisode = res.data.airdate;
            sourceContainer.innerText += ` - ${lastEpisode.slice(0, 4)}`;
        }
    }
}

const addShowDescription = (result, showContainer) => {
    const descriptionContainer = document.createElement("div");
    addShowGenre(result, showContainer, descriptionContainer);
    addShowRating(result, showContainer, descriptionContainer);
    addShowSummary(result, showContainer, descriptionContainer);
}

const addShowGenre = (result, showContainer, descriptionContainer) => {
    if (result.show.genres) {
        const showGenre = document.createElement("span");
        showGenre.innerText = result.show.genres;
        descriptionContainer.appendChild(showGenre);
        showContainer.appendChild(descriptionContainer);
    }
}

const addShowRating = (result, showContainer, descriptionContainer) => {
    if (result.show.rating.average) {
        const showRating = document.createElement("span");
        showRating.innerHTML = `<i class='fas fa-star'></i> ${result.show.rating.average}`;
        descriptionContainer.appendChild(showRating);
        showContainer.appendChild(descriptionContainer);
    }
}

const addShowSummary = (result, showContainer, descriptionContainer) => {
    const showSummary = document.createElement("p");
    showSummary.innerHTML = result.show.summary;
    descriptionContainer.appendChild(showSummary);
    showContainer.appendChild(descriptionContainer);
}

const clearResults = (results) => {
    while (results.length > 0) {
        results[0].remove();
    }
}
