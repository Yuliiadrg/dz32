//Create object request
const settings = {
  //Where send request and parameters
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '539ac9544bmsh9038ba6e494a847p1708e4jsne58ebb42946d',
		'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
	}
};
//On success request from server (variant of syntacis requst "fetch, then-catch")
fetch('https://online-movie-database.p.rapidapi.com/auto-complete?q=game%20of%20thr', settings)
	.then(response => response.json()) //parse response
	.then(response => console.log(response)) 
	.catch(err => console.error(err)); //handle error

const myApiKey = "34731faf"; 
let currentPage = 1;
//Call to elements from html
const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");
const pagination = document.getElementById("pagination");
const movieDetails = document.getElementById("movie-details");

function searchMovies(searchQuery, searchType) {
  const searchUrl = `https://www.omdbapi.com/?s=${searchQuery}&type=${searchType}&page=${currentPage}&apikey=${myApiKey}`;

  fetch(searchUrl) 
    .then(response => response.json())
    .then(data => { 
      if (data.Response === "True") {
        const movies = data.Search;
        const moviesHtml = movies.map(movie => {
          return `<div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <div class="movie-info">
              <h3>${movie.Title} (${movie.Year})</h3>
              <button class="details-btn" data-imdb-id="${movie.imdbID}">Details</button>
            </div>
          </div>`;
        }).join(""); // eslint-disable-line
        movieList.innerHTML = moviesHtml; 
        
        const totalPages = Math.ceil(data.totalResults / 10); 
        const buttonsHtml = Array.from({
          length: totalPages
        }, (_, i) => { 
          const pageNum = i + 1;
          return `<button class="pagination-button ${pageNum === currentPage ? "active" : ""}">${pageNum}</button>`;
        }).join("");
        pagination.innerHTML = buttonsHtml;
      } else {
        movieList.innerHTML = `<p>${data.Error}</p>`;
        pagination.innerHTML = "";
      }
    })
    .catch(error => console.error(error));
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const searchInput = document.getElementById("search-input");
  const typeSelect = document.getElementById("type-select");
  currentPage = 1;
  searchMovies(searchInput.value, typeSelect.value);
});

pagination.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON" && event.target.classList.contains("pagination-button")) {
    currentPage = parseInt(event.target.textContent);
    const searchInput = document.getElementById("search-input");
    const typeSelect = document.getElementById("type-select");
    searchMovies(searchInput.value, typeSelect.value);
  }
});

movieList.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON" && event.target.classList.contains("details-btn")) {
    const imdbID = event.target.dataset.imdbId;
    const detailsUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${myApiKey}&plot=full`;

    fetch(detailsUrl)
      .then(response => response.json())
      .then(data => {
        const detailsHtml = `<div class="movie-details">
          <img src="${data.Poster}" alt="${data.Title}" />
          <div class="movie-info">
            <h3>${data.Title} (${data.Year})</h3>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
          </div>
        </div>`;

        movieDetails.innerHTML = detailsHtml;
      })
      .catch(error => console.error(error));
  }
});