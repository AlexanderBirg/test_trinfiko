// Everything but IE

const preloader = document.querySelector('.preloader');

if (preloader) {
  window.addEventListener('load', () => {
    document.querySelector('.preloader').classList.remove('preloader--active');
  }, false);
}
