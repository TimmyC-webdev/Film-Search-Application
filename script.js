"use strict";

const movieVal = document.getElementById("movie_title");
const searchBtn = document.getElementById("search_btn");
const resultDiv = document.getElementById("result");
const posterDiv = document.getElementById("poster");

// Function to update dynamic content and trigger screen reader notification
function updateDynamicContent(newContent) {
  resultDiv.innerHTML = newContent;

  // Trigger a custom event to notify screen readers of the change
  const event = new Event("content-update");
  resultDiv.dispatchEvent(event);
}

// Function to create an HTML element with appropriate ARIA attributes
function createAriaElement(tag, content, ariaAttributes) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(ariaAttributes)) {
    element.setAttribute(key, value);
  }
  element.innerHTML = content;
  return element;
}

// Function to get the movie details from the API

let getMovieTitle = () => {
  let movieTitle = movieVal.value;

  if (movieTitle.length <= 0) {
    updateDynamicContent(
      `<h2 class="message">Please Enter Your Search Here</h2>`
    );
  } else {
    console.log(API_KEY);
    let url = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True") {
          // Update dynamic content for movie details
          const movieDetailsContent = `
            <h1 id="movie-title" class="movieDetails" aria-labelledby="movie-title">${data.Title.toUpperCase()}</h1>
            <span>${data.Genre}</span>
            <span>${data.Year}</span>
            <span>${data.Rated}</span>
            <div class="movieDetails">Running time: ${data.Runtime.replace(
              "min",
              "'"
            )}</div>
            <div class="movieDetails">Director: ${data.Director}</div>
            <div class="movieDetails">Cast: ${data.Actors}</div>
            <div class="movieDetails"><i class="fa-solid fa-award"></i>${
              data.Awards
            }</div>
            <div class="movieDetails">Origin: ${data.Country}</div>
            <div class="movieDetails">
              <span id="ratings">${
                data.Ratings[0].Source
              }</span><span id="value">${data.Ratings[0].Value}</span>
              <span id="ratings">${
                data.Ratings[1].Source
              }</span><span id="value">${data.Ratings[1].Value}</span>
              <span id="ratings">${
                data.Ratings[2].Source
              }</span><span id="value">${data.Ratings[2].Value}</span>
            </div>`;
          updateDynamicContent(movieDetailsContent);

          // Update dynamic content for movie poster and synopsis
          const posterContent = `<h2>Synopsis:</h2>
          <div class="detailsWrapper">
            <div class="moviePoster"><img src=${data.Poster} alt="${data.Title} Poster"></div>
            <div class="plot">${data.Plot}</div> </div>`;

          posterDiv.innerHTML = posterContent;

          console.log(data.Plot);
        } else {
          // Handle error response
          updateDynamicContent(`<h2>${data.Error}</h2>`);
        }
      })
      .catch(() => {
        // Handle fetch error
        updateDynamicContent(`<h2>Error occurred</h2>`);
      });
  }
  movieVal.value = "";
};

// Attach event listener to search button
searchBtn.addEventListener("click", getMovieTitle);
