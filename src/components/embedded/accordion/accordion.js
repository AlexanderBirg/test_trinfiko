const accordions = document.querySelectorAll('.accordion');

accordions.forEach((accordion) => {
  const header = accordion.querySelector('.accordion__head');
  const body = accordion.querySelector('.accordion__body');

  header.addEventListener('click', () => {
    accordion.classList.toggle('accordion--active');
    if (accordion.classList.contains('accordion--active')) {
      const maxHeight = body.scrollHeight + body.style.paddingTop + body.style.paddingBottom;
      body.style.maxHeight = `${maxHeight}px`;
    } else {
      body.style.maxHeight = null;
    }
  });
});
