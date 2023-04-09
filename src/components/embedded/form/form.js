import Cleave from 'cleave.js';

const formList = document.querySelectorAll('.form');
const inputBlockList = document.querySelectorAll('.input-block');
const textareaBlockList = document.querySelectorAll('.textarea-block');
const uploadBlockList = document.querySelectorAll('.upload-block');

function validateName(name) {
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
  return nameRegex.test(name);
}

function validateEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function validateTel(phone) {
  const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
  return phoneRegex.test(phone);
}

function validateFile(file) {
  const fileSize = file.size; // Размер файла в байтах
  const allowedExtensions = /(\.jpg|\.pdf|\.doc|\.docx)$/i; // Разрешенные расширения файлов

  // Проверяем тип и размер файла
  if (!allowedExtensions.test(file.name) || fileSize > 10000000) {
    return false;
  }

  return true;
}

// валидация инпут-блока
function validateInputBlock(inputBlock) {
  const input = inputBlock.querySelector('.input-block__input');
  let isValid = false;

  if (inputBlock.classList.contains('input-block--name')) {
    isValid = validateName(input.value);
  } else if (inputBlock.classList.contains('input-block--tel')) {
    isValid = validateTel(input.value);
  } else if (inputBlock.classList.contains('input-block--email')) {
    isValid = validateEmail(input.value);
  }

  if (isValid) {
    inputBlock.classList.add('input-block--valid');
    inputBlock.classList.remove('input-block--invalid');
  } else {
    inputBlock.classList.add('input-block--invalid');
    inputBlock.classList.remove('input-block--valid');
  }
}

// валидация текстовых полей формы
function validateFormInputBlocks(inputBlocks) {
  let errors = 0;

  inputBlocks.forEach((inputBlock) => {
    validateInputBlock(inputBlock);

    if (!inputBlock.classList.contains('input-block--valid')) ++errors;
  });

  return errors;
}

// валидация аплоад-блока
function validateUploadBlock(uploadBlock) {
  const input = uploadBlock.querySelector('.upload-block__input');

  if (input.value === '') {
    uploadBlock.classList.remove('upload-block--valid');
    uploadBlock.classList.remove('upload-block--invalid');
  } else {
    const isValid = validateFile(input.files[0]);

    if (isValid) {
      uploadBlock.classList.add('upload-block--valid');
      uploadBlock.classList.remove('upload-block--invalid');
    } else {
      uploadBlock.classList.add('upload-block--invalid');
      uploadBlock.classList.remove('upload-block--valid');
    }
  }
}

// валидация аплоад-блоков формы
function validateUploadBlocks(uploadBlocks) {
  let errors = 0;

  uploadBlocks.forEach((uploadBlock) => {
    validateUploadBlock(uploadBlock);

    if (!uploadBlock.classList.contains('upload-block--valid')) ++errors;
  });

  return errors;
}

// отображение имени выбранного файла
function showFileName(file, uploadBlock) {
  // получение расширения фалйа
  const curArr = file.split('.');
  const fileName = curArr[0];
  const fileType = curArr[curArr.length - 1];

  // вывод имени выранного файла
  if (fileName.length > 12) {
    // сокращение его, если слишком длинный
    uploadBlock.querySelector('.upload-block__text').innerText = `${fileName.substr(0, 9)}...${fileType}`;
  } else {
    uploadBlock.querySelector('.upload-block__text').innerText = `${fileName}.${fileType}`;
  }
}

// input-block
if (inputBlockList.length) {
  inputBlockList.forEach((inputBlock) => {
    const input = inputBlock.querySelector('.input-block__input');

    // добавляем класс если вдруг инпут оказался уже заполненым и отмечаем валидность блока
    if (input.value !== '') {
      inputBlock.classList.add('input-block--focus');
      validateInputBlock(inputBlock);
    }

    input.addEventListener('focus', () => {
      inputBlock.classList.add('input-block--focus');
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        inputBlock.classList.remove('input-block--focus');
      }

      validateInputBlock(inputBlock);
    });
  });
}

// textarea-block
if (textareaBlockList.length) {
  textareaBlockList.forEach((textareaBlock) => {
    const textarea = textareaBlock.querySelector('.textarea-block__textarea');

    // добавляем класс если вдруг инпут оказался уже заполненым
    if (textarea.value !== '') textareaBlock.classList.add('textarea-block--focus');

    textarea.addEventListener('focus', () => {
      textareaBlock.classList.add('textarea-block--focus');
    });

    textarea.addEventListener('blur', () => {
      if (textarea.value === '') {
        textareaBlock.classList.remove('textarea-block--focus');
      }
    });
  });
}

// upload-block
if (uploadBlockList.length) {
  uploadBlockList.forEach((uploadBlock) => {
    const input = uploadBlock.querySelector('.upload-block__input');
    const resetButton = uploadBlock.querySelector('.upload-block__reset-button');

    // если инпут уже заполнен
    if (input.value) {
      validateUploadBlock(uploadBlock);
      showFileName(input.files[0].name, uploadBlock);
    }

    // очистка
    resetButton.onclick = () => {
      input.value = '';
      uploadBlock.querySelector('.upload-block__text').innerText = 'Прикрепить файл';
      uploadBlock.classList.remove('upload-block--focus');

      validateUploadBlock(uploadBlock);
    };

    input.addEventListener('focus', () => {
      uploadBlock.classList.add('upload-block--focus');
    });

    input.addEventListener('blur', () => {
      if (input.files.length === 0) {
        uploadBlock.classList.remove('upload-block--focus');
      }
    });

    input.addEventListener('change', () => {
      validateUploadBlock(uploadBlock);

      showFileName(input.files[0].name, uploadBlock);
    });
  });
}

// Маска телефон
document.querySelectorAll('.input-phone').forEach((tel) => {
  new Cleave(tel, {
    prefix: '+7',
    blocks: [2, 3, 3, 2, 2],
    delimiter: ' ',
    delimiterLazyShow: false,
    noImmediatePrefix: true,
    numericOnly: true,
  });
});

formList.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let errors = 0;

    const inputBlocks = form.querySelectorAll('.input-block');
    const uploadBlocks = form.querySelectorAll('.upload-block');
    errors += validateFormInputBlocks(inputBlocks);
    errors += validateUploadBlocks(uploadBlocks);

    // капча пройдена или нет
    if (form.querySelector('input[name="smart-token"]').value === '') {
      return;
    }

    if (!errors) {
      const formData = new FormData(form); // Создаем объект FormData из формы

      // Отправляем форму на сервер с помощью fetch
      fetch(form.action, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          const modalSuccess = new window.HystModal();

          // закрытие всех модалок
          document.querySelectorAll('.hystmodal').forEach((modal) => {
            modal.querySelector('.hystmodal__close').click();
          });

          modalSuccess.open('#message-modal');
        });
    } else {
      alert('Ошибка!');
    }
  });
});
