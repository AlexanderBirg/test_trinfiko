const accordions = document.querySelectorAll('.accordion');

function closeItem(item) {
  const body = item.querySelector('.accordion__body');
  body.style.maxHeight = null;

  item.classList.remove('accordion__item--active');
}

if (accordions.length) {
  accordions.forEach((ac) => {
    ac.querySelectorAll('.accordion__item').forEach((item) => {
      const header = item.querySelector('.accordion__head');
      const body = item.querySelector('.accordion__body');

      header.addEventListener('click', () => {
        // если указана настройка
        if (ac.getAttribute('data-accordion-single')) {
          // закрытие всех спойлеров крому текущего
          ac.querySelectorAll('.accordion__item').forEach((el) => {
            if (el !== item) {
              closeItem(el);
            }
          });
        }

        if (!item.classList.contains('accordion__item--active')) {
          item.classList.add('accordion__item--active');
          body.style.maxHeight = `${body.scrollHeight}px`;
        } else {
          item.classList.remove('accordion__item--active');
          body.style.maxHeight = null;
        }
      });
    });
  });
}
