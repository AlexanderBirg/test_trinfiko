const accordion = document.querySelector('.faq-list');

if (accordion) {
  const items = accordion.querySelectorAll('.faq-list__item');
  if (items.length) {
    items.forEach((item, index) => {
      item.querySelector('.faq-list__counter').innerText = index < 10 ? `0${index + 1}.` : `${index + 1}.`;
    });
  }
}
