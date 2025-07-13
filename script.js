let currentPage = 1;
const moviesPerPage = 6;
let allMovies = [];
let filteredMovies = [];

const display = document.getElementById("displayMovies");
const sort = document.getElementById("sort");
const filterByGenre = document.getElementById("filterByGenre");

async function fetchMovies() {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows`);
    allMovies = await res.json();
    filteredMovies = [...allMovies];
    renderMovies();
  } catch (error) {
    console.error("Error fetching movies", error);
  }
}

function renderMovies() {
  display.innerHTML = "";
  const start = (currentPage - 1) * moviesPerPage;
  const moviesToDisplay = filteredMovies.slice(start, start + moviesPerPage);

  if (moviesToDisplay.length === 0) {
    display.innerHTML = `<p>No movies to show</p>`;
    return;
  }

  moviesToDisplay.forEach(e => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${e.image?.medium}" alt="${e.name}">
      <p><strong>${e.name}</strong></p>
      <p>${e.genres.join(", ")}</p>
      <p>⭐ ${e.rating?.average ?? "N/A"}</p>
    `;
    display.appendChild(div);
  });

  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
}

function sortMovies() {
  const sortValue = sort.value;
  if (sortValue === "rating-highToLow") {
    filteredMovies.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
  } else if (sortValue === "alphabetically") {
    filteredMovies.sort((a, b) => a.name.localeCompare(b.name));
  }
  currentPage = 1;
  renderMovies();
}

function filterMovies() {
  const genre = filterByGenre.value;

  if (genre === "") {
    filteredMovies = [...allMovies];
  } else {
    filteredMovies = allMovies.filter(e => e.genres.includes(genre));
  }

  sortMovies();
}

function next() {
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderMovies();
  }
}

function previous() {
  if (currentPage > 1) {
    currentPage--;
    renderMovies();
  }
}

document.getElementById("nextBtn").addEventListener("click", next);
document.getElementById("prevBtn").addEventListener("click", previous);
sort.addEventListener("change", sortMovies);
filterByGenre.addEventListener("change", filterMovies);

fetchMovies();




