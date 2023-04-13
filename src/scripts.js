import LazyLoad from 'vanilla-lazyload';
import jump from 'jump.js';

import './components/complex/preloader/preloader.js';
import './services/custom-libs/hystmodal/hystmodal.js';
import './components/complex/header/header.js';
import './components/embedded/form/form.js';
import './components/embedded/accordion/accordion.js';
import './components/embedded/faq-list/faq-list.js';

// ПЛАВНАЯ ПРОКРУТКА К ЭЛЕМЕНТАМ
const anchors = document.querySelectorAll('[data-my-anchor]');

if (anchors.length) {
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

// создание обсервера
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const animationType = entry.target.getAttribute('data-scrollspy');

    if (entry.isIntersecting) {
      if (entry.target.classList.contains('for-childs')) {
        // анимация для списка элементов
        const childs = entry.target.children;

        childs.forEach((child, index) => {
          setTimeout(() => {
            child.classList.remove('hidden');

            if (animationType) {
              child.classList.add(animationType);
            } else {
              child.style.opacity = '1';
            }
          }, 300 * index);
        });
      } else {
        // анимация для больших элементов
        setTimeout(() => {
          entry.target.classList.remove('hidden');

          if (animationType) {
            entry.target.classList.add(animationType);
          } else {
            entry.target.style.opacity = '1';
          }
        }, 500);
      }
    }
  });
}, { threshold: 0.2 });

window.onload = () => {
  // передаем ему элементы
  scrollspyElems.forEach((el) => {
    observer.observe(el);
  });
};

// ЯНДЕКС КАРТА
/* global ymaps */

if (document.querySelector('#map')) {
  const TRINFIKO_POSITION = [55.77779714854112, 37.63736076633297];

  const init = () => {
    const myMap = new ymaps.Map('map', {
      center: TRINFIKO_POSITION,
      zoom: 15,
      controls: [],
    });

    // Создадим пользовательский макет ползунка масштаба.
    const ZoomLayout = ymaps.templateLayoutFactory.createClass(`
      <div class="ya-map__buttons">
        <button id='zoom-in' class='ya-map__button ya-map__button--in'><span>+</span></button>
        <button id='zoom-out' class='ya-map__button ya-map__button--out'><span>-</span></button>
      </div>`, {
      // Переопределяем методы макета, чтобы выполнять дополнительные действия
      // при построении и очистке макета.
      build() {
        // Вызываем родительский метод build.
        ZoomLayout.superclass.build.call(this);
        // Привязываем функции-обработчики к контексту и сохраняем ссылки
        // на них, чтобы потом отписаться от событий.
        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
        // Начинаем слушать клики на кнопках макета.
        document.getElementById('zoom-in').addEventListener('click', this.zoomInCallback);
        document.getElementById('zoom-out').addEventListener('click', this.zoomOutCallback);
      },

      clear() {
        // Снимаем обработчики кликов.
        document.getElementById('zoom-in').removeEventListener('click', this.zoomInCallback);
        document.getElementById('zoom-out').removeEventListener('click', this.zoomOutCallback);

        // Вызываем родительский метод clear.
        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
      },

      zoomOut() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
      },
    });
    const zoomControl = new ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });

    // расположение кнопок масштабирования в зависимости от размера видимой области
    let yaTop = 113;
    let yaRight = 5;

    if (window.innerWidth > 767) {
      yaTop = 225;
      yaRight = 22;
    }
    if (window.innerWidth > 1279) {
      yaTop = 222;
      yaRight = 29;
    }

    myMap.controls.add(zoomControl, {
      float: 'none',
      position: {
        top: yaTop,
        right: yaRight,
      },
    });

    const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(`
    <div class="trinfiko-round-icon">
      <div class="trinfiko-round-icon__wrapper">
        <svg style="fill: white;" class="inline-svg">
          <use xlink:href="images/sprite.svg#trinfiko"></use>
        </svg>
      </div>
    </div>
    `);

    const myPlacemarkWithContent = new ymaps.Placemark(TRINFIKO_POSITION, {}, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#imageWithContent',
      // Своё изображение иконки метки.
      iconImageHref: '',
      // Размеры метки.
      iconImageSize: [48, 48],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-24, -24],
      // Смещение слоя с содержимым относительно слоя с картинкой.
      iconContentOffset: [15, 15],
      // Макет содержимого.
      iconContentLayout: MyIconContentLayout,
    });

    myMap.geoObjects.add(myPlacemarkWithContent);
  };

  ymaps.ready(init);
}
