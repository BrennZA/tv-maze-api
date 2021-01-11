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
        const showName = document.createElement("h2");
        showName.innerText = result.show.name;

        const showContainer = document.createElement("div");
        showContainer.appendChild(showName);

        resultsContainer.appendChild(showContainer);
    }
}

const clearResults = (results) => {
    while(results.length > 0) {
        results[0].remove();
    }
}
