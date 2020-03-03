const matchSlider = document.querySelector('#match-items');
const matchSliderItems = document.querySelector('#match-items ul');
const fwdButton = document.querySelector('#slide-forward');
const backButton = document.querySelector('#slide-back');
const slideIcons = document.querySelectorAll('.slider-nav .slide-icon');
let listOffset = 0;
const step = 364;
const filledDot = 'fiber_manual_record';
const emptyDot = 'panorama_fish_eye';

matchSlider.style.overflow = 'hidden';

// Set first icon to selected
document.querySelector('.slider-nav .material-icons[data-slide="0"]').innerHTML = 'fiber_manual_record';

// Event listener for the forward button
fwdButton.addEventListener('click', () => {
  if(Math.abs(listOffset)/step >= matches.length-1) {
    return;
  }
  removeSliderIcon((Math.abs(listOffset)/step));
  listOffset -= step;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
  setSliderIcon(Math.abs(listOffset)/step);
});

// Event listener for the backward button
backButton.addEventListener('click', () => {
  if(listOffset == 0) {
    return;
  }
  removeSliderIcon((Math.abs(listOffset)/step));
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

    listOffset = -slide * step;
    matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
    removeSliderIcon(prevSlide);
    setSliderIcon(slide);
  });
})

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