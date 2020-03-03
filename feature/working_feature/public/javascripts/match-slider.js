console.log('Initializing matches slider...');

const matchSlider = document.querySelector('#match-items');
const matchSliderItems = document.querySelector('#match-items ul');
const fwdButton = document.querySelector('#slide-forward');
const backButton = document.querySelector('#slide-back');
const slideIcons = document.querySelectorAll('.slider-nav .slide-icon');
let listOffset = 0;
const step = 364;

matchSlider.style.overflow = 'hidden';

// Set first icon to selected
document.querySelector('.slider-nav .material-icons[data-slide="0"]').innerHTML = 'fiber_manual_record';

// Event listeners for the backward and forward button
fwdButton.addEventListener('click', () => {
  if(Math.abs(listOffset)/step >= matches.length-1) {
    return;
  }
  listOffset -= step;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
  setSliderIcon(true);
});

backButton.addEventListener('click', () => {
  if(listOffset == 0) {
    return;
  }
  listOffset += step;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
  setSliderIcon(false);
});

slideIcons.forEach((slide) => {
  slide.addEventListener('click', (e) => {
    let prevSlide = Math.abs(listOffset)/step;
    let slide = e.target.dataset.slide;
    listOffset = -slide * step;
    matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
    removeSliderIcon(prevSlide);

    if(prevSlide > slide) {
      setSliderIcon(false);
    } else {
      setSliderIcon(true);
    }
  });
})

// Fill the icon of the active match (true for direction = forward move)
function setSliderIcon(direction) {
  if(direction) { removeSliderIcon(Math.abs(listOffset) / step - 1); }
  else { removeSliderIcon(Math.abs(listOffset) / step + 1); }

  let slideNow = document.querySelector(`.slider-nav .material-icons[data-slide="${ Math.abs(listOffset) / step }"]`);
  slideNow.innerHTML = 'fiber_manual_record';
  return;
}

function removeSliderIcon(icon) {
  document.querySelector(`.slider-nav .material-icons[data-slide="${ icon }"]`).innerHTML = 'panorama_fish_eye';
  return;
}