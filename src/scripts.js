import LazyLoad from 'vanilla-lazyload';
import jump from 'jump.js';

import './components/complex/preloader/preloader.js';
import './services/custom-libs/hystmodal/hystmodal.js';
import './components/complex/header/header.js';
import './components/embedded/form/form.js';

// ПЛАВНАЯ ПРОКРУТКА К ЭЛЕМЕНТАМ
const anchors = document.querySelectorAll('[data-my-anchor]');

if (anchors) {
  anchors.forEach((item) => {
    item.onclick = () => {
      jump(item.getAttribute('data-my-anchor'), {
        offset: -60, // насколько не докрутить до нужного элемента (н-р, при фиксированном меню)
      });
    };
  });
}

// МОДАЛКИ
const myModalIgnored = new window.HystModal({
  linkAttributeName: 'data-hystmodal',
  backscroll: true,
  fixedSelectors: '*[data-hystfixed]',
  // настройки (не обязательно), см. API
});

// ЛЕНИВАЯ ЗАГРУЗКА
const lazyLoadInstance = new LazyLoad({
  // Your custom settings go here
});

lazyLoadInstance.update();

// АНИМАЦИЯ ПОЯВЛЕНИЯ
const scrollspyElems = document.querySelectorAll('[data-scrollspy]');

// Добавляем класс hidden, чтобы скрыть блоки
scrollspyElems.forEach((elem) => {
  elem.classList.add('hidden');
});

// Обработчик события scroll
window.addEventListener('scroll', () => {
  // Переменная для хранения текущего индекса блока
  let index = 0;

  // Функция для появления блоков с задержкой
  function showBlocks() {
    // Проверяем, есть ли еще блоки, которые нужно показать
    if (index < scrollspyElems.length) {
      // Получаем текущий блок
      const elem = scrollspyElems[index];

      // Если блок уже появился на экране (отступ 200 px), то добавляем ему класс анимации
      if (elem.getBoundingClientRect().top + 200 < window.innerHeight) {
        const animationType = elem.getAttribute('data-scrollspy');

        elem.classList.remove('hidden');
        elem.classList.add(animationType);
        index++; // Увеличиваем индекс для следующего блока
      }
      setTimeout(showBlocks, 300); // Вызываем функцию снова через 200 мс
    }
  }
  showBlocks(); // Вызываем функцию для первоначального запуска
});
