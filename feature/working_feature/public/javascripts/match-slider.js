console.log('Initializing matches slider...');

const matchSlider = document.querySelector('#match-items');
const matchSliderItems = document.querySelector('#match-items ul');
const fwdButton = document.querySelector('#slide-forward');
const backButton = document.querySelector('#slide-back');
let listOffset = 0;

matchSlider.style.overflow = 'hidden';

fwdButton.addEventListener('click', () => {
  listOffset -= 100;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
});

backButton.addEventListener('click', () => {
  if(listOffset == 0) {
    return;
  }
  listOffset += 100;
  matchSliderItems.style.transform = `translateX(${ listOffset }px)`;
});

console.log(fwdButton);
