const accordions = document.querySelectorAll('.accordion');

if (accordions.length) {
  accordions.forEach((ac) => {
    ac.querySelectorAll('.accordion__item').forEach((item) => {
      const header = item.querySelector('.accordion__head');
      const body = item.querySelector('.accordion__body');

      header.addEventListener('click', () => {
        item.classList.toggle('accordion__item--active');

        if (item.classList.contains('accordion__item--active')) {
          const maxHeight = body.scrollHeight + body.style.paddingTop + body.style.paddingBottom;
          body.style.maxHeight = `${maxHeight}px`;
        } else {
          body.style.maxHeight = null;
        }
      });
    });
  });
}
