// Grab elements from HTML
const matchSlider = document.querySelector('#match-items');
const matchSliderItems = document.querySelector('#match-items ul');
const matchSliderItemsAll = document.querySelectorAll('#match-items ul li');
const fwdButton = document.querySelector('#slide-forward');
const backButton = document.querySelector('#slide-back');
const slideIcons = document.querySelectorAll('.slider-nav .slide-icon');
const viewedMatchesList = document.querySelector('#viewed-matches ul');

// Icons
const filledDot = 'fiber_manual_record';
const emptyDot = 'panorama_fish_eye';

// Defaults for the slider
const step = 364;
let listOffset = 0;
let viewedMatches = [];

// Hide scrollbar with Javascript
matchSlider.style.overflow = 'hidden';

// Set first icon to selected and add this match to the viewed-matches list
document.querySelector('.slider-nav .material-icons[data-slide="0"]').innerHTML = filledDot;
addViewedMatch(0);

// Fill the icon of the active match (true for direction = forward move)
function setSliderIcon(sliderStep) {
  document.querySelector(`.slider-nav .material-icons[data-slide="${ sliderStep }"]`).innerHTML = filledDot;
  return;
}

// Removes the icon that is provided
function removeSliderIcon(sliderStep) {
  document.querySelector(`.slider-nav .material-icons[data-slide="${ sliderStep }"]`).innerHTML = emptyDot;
  return;
}

// Create a new list item that can be appended to viewed-matches (higher-order function: addViewedMatch())
function createViewedMatch(match) {
  let li = document.createElement('li');
  // Set data attribute so it the list-item can be associated with the same slider item
  li.setAttribute('data-match', match)
  li.innerHTML = `
  <figure>
    <img
      src="${ matches[match].picture }"
      alt="Dating person"
      >
    <figcaption>${ matches[match].firstName } ${ matches[match].lastName }, ${ matches[match].age }</figcaption>
  </figure>
  `
  return li;

}

// Adds a viewed match to the viewed-matches list
function addViewedMatch(match) {
  if(viewedMatches.includes(match)) return;
  viewedMatches.push(match);
  return viewedMatchesList.appendChild(createViewedMatch(match));
}

// Event listener for the forward button
fwdButton.addEventListener('click', () => {
  if(Math.abs(listOffset)/step >= matches.length-1) {
    return;
  }
  removeSliderIcon(Math.abs(listOffset)/step);
  addViewedMatch(Math.abs(listOffset)/step);
  listOffset -= step;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
  setSliderIcon(Math.abs(listOffset)/step);
});

// Event listener for the backward button
backButton.addEventListener('click', () => {
  if(listOffset == 0) {
    return;
  }
  removeSliderIcon(Math.abs(listOffset)/step);
  addViewedMatch(Math.abs(listOffset)/step);
  listOffset += step;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
  setSliderIcon(Math.abs(listOffset)/step);
});

// Clicking on a dot below the slider can send you to another slide
slideIcons.forEach((slide) => {
  slide.addEventListener('click', (e) => {
    let prevSlide = Math.abs(listOffset)/step;
    let slide = e.target.dataset.slide;
    // If the active slide is being clicked, return
    if (slide == prevSlide) return;

    addViewedMatch(Math.abs(listOffset)/step);
    listOffset = -slide * step;
    matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
    removeSliderIcon(prevSlide);
    setSliderIcon(slide);
  });
})

// Add eventlistener to the list of viewed matches, to catch clicks and set move the slider accordingly
viewedMatchesList.addEventListener('click', (e) => {
  if(e.target && e.target.nodeName == "LI") {
    matchNr = e.target.dataset.match;
    // If clicked item == current active match, return
    if(matchNr == Math.abs(listOffset)/step) return;

    removeSliderIcon(Math.abs(listOffset)/step);
    addViewedMatch(Math.abs(listOffset)/step);
    listOffset = -matchNr * step;
    matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
    setSliderIcon(matchNr);
  }
});