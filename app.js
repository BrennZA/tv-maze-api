const searchForm = document.querySelector("#searchForm");
const resultsContainer = document.querySelector("#resultsContainer");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateResults();
});

const generateResults = () => {
    const results = searchForm.elements.searchInput.value;
    const delay = Math.floor(Math.random() * 3000);
    setTimeout(async() => {
        if(delay < 3000) {
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
    for(let result of results) {
        const showContainer = document.createElement("div");
        addImgAndName(result, showContainer);        
        addShowChannel(result, showContainer);

        resultsContainer.appendChild(showContainer);
        console.log(result.show.premiered)
    }
}

const addImgAndName = (result, showContainer) => {
    if(result.show.image) {
        const showImage = document.createElement("img");
        showImage.src = result.show.image.medium;
        showContainer.appendChild(showImage);
    }
    
    const showName = document.createElement("h2");
    showName.innerText = result.show.name;
    showContainer.appendChild(showName);
}

const addShowChannel = (result, showContainer) => {
    if(result.show.network) {
        const showChannel = document.createElement("a");
        showChannel.innerText = result.show.network.name;
        showContainer.appendChild(showChannel);
    } else if(result.show.webChannel.name) {
        showChannel = document.createElement("a");
        showChannel.innerText = `${result.show.webChannel.name}, `;
        showContainer.appendChild(showChannel);
    }
}

const clearResults = (results) => {
    while(results.length > 0) {
        results[0].remove();
    }
}
