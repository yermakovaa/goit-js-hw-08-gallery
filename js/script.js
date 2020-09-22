import galleryItems from './data/gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  overlay: document.querySelector('.lightbox__overlay'),
  lightboxImg: document.querySelector('.lightbox__image'),
  closeModalBtn: document.querySelector('button[data-action="close-lightbox"]'),
};

const galleryItemsMarkup = createGalleryItems(galleryItems);

refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMarkup);
refs.gallery.addEventListener('click', onGalleryContainerClick);

// Создание разметки галереи картинок
function createGalleryItems(item) {
  return item
    .map(({ preview, original, description }) => {
      return `
      <li class="gallery__item">
        <a class="gallery__link" href="${original}">
          <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
          />
        </a>
      </li>
    `;
    })
    .join('');
}

// Реализация делегирования на галерее
function onGalleryContainerClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const curSrcOrigImg = event.target.dataset.source;
  const curAltOrigImg = event.target.getAttribute('alt');

  onOpenModal(curSrcOrigImg, curAltOrigImg);
}

// Открытие модального окна по клику на элементе галереe
function onOpenModal(src, alt) {
  refs.closeModalBtn.addEventListener('click', onCloseModal);
  refs.overlay.addEventListener('click', onOverlayClick);
  window.addEventListener('keydown', onEscKeyPress);
  window.addEventListener('keydown', onNextImgClick);

  refs.lightbox.classList.add('is-open');
  refs.lightboxImg.src = src;
  refs.lightboxImg.alt = alt;
}

// Закрытие модального окна по клику на кнопку
function onCloseModal() {
  refs.closeModalBtn.removeEventListener('click', onCloseModal);
  refs.overlay.removeEventListener('click', onOverlayClick);
  window.removeEventListener('keydown', onEscKeyPress);
  window.removeEventListener('keydown', onNextImgClick);

  refs.lightbox.classList.remove('is-open');
  refs.lightboxImg.src = '';
  refs.lightboxImg.alt = '';
}

// Закрытие модального окна по клику на overlay
function onOverlayClick() {
  onCloseModal();
}

// Закрытие модального окна по нажатию клавиши ESC
function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';

  if (event.code === ESC_KEY_CODE) {
    onCloseModal();
  }
}

// Пролистывание изображений галереи
function onNextImgClick(event) {
  const RIGHT_KEY_CODE = 'ArrowRight';
  const LEFT_KEY_CODE = 'ArrowLeft';

  let findIndexImg = galleryItems.findIndex(
    el => el.original === refs.lightboxImg.src,
  );

  if (event.code === LEFT_KEY_CODE) {
    if (findIndexImg === 0) {
      return;
    }
    findIndexImg -= 1;
  }

  if (event.code === RIGHT_KEY_CODE) {
    if (findIndexImg === galleryItems.length - 1) {
      return;
    }
    findIndexImg += 1;
  }

  refs.lightboxImg.src = galleryItems[findIndexImg].original;
  refs.lightboxImg.alt = galleryItems[findIndexImg].description;
}
