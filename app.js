const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateResults();
});

const generateResults = async () => {
    const results = searchForm.elements.searchInput.value;
    try {
        const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${results}`);
        console.log(res.data);
    } catch (err) {
        console.log(err);
    }
}
