const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateResults();
});

const generateResults = () => {
    const results = searchForm.elements.searchInput.value;
    const delay = Math.floor(Math.random() * 3000);
    setTimeout(async() => {
        if(delay < 2500) {
            try {
                const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${results}`);
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("CONNECTION TIMEOUT: PLEASE TRY AGAIN LATER...");
        }
    }, delay)
}
