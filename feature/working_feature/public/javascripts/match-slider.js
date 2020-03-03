console.log('Initializing matches slider...');

const matchSlider = document.querySelector('#match-items');
const matchSliderItems = document.querySelector('#match-items ul');
const fwdButton = document.querySelector('#slide-forward');
const backButton = document.querySelector('#slide-back');
const slideIcons = document.querySelector('.slider-nav .material-icons');
let listOffset = 0;
const step = 364;

matchSlider.style.overflow = 'hidden';

// Set first icon to selected
document.querySelector('.slider-nav .material-icons[data-slide="0"]').innerHTML = 'fiber_manual_record';

fwdButton.addEventListener('click', () => {
  if(Math.abs(listOffset)/step >= matches.length-1) {
    console.log('done');
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

function setSliderIcon(direction) {
  if(direction) { document.querySelector(`.slider-nav .material-icons[data-slide="${ Math.abs(listOffset) / step - 1 }"]`).innerHTML = 'panorama_fish_eye'; }
  else { document.querySelector(`.slider-nav .material-icons[data-slide="${ Math.abs(listOffset) / step + 1 }"]`).innerHTML = 'panorama_fish_eye'; }

  let slideNow = document.querySelector(`.slider-nav .material-icons[data-slide="${ Math.abs(listOffset) / step }"]`);
  slideNow.innerHTML = 'fiber_manual_record';
}
