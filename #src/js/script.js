document.addEventListener("DOMContentLoaded", function () {
  let body = document.querySelector('body');

  // Слайдеры 
  if (document.querySelector('.discount-slider')) {
    new Swiper('.discount-slider', {
      slidesPerView: 'auto',
      spaceBetween: 14,
      freeMode: true,
    });
  };

  if (document.querySelector('.special-offer-slider')) {
    new Swiper('.special-offer-slider', {
      slidesPerView: 'auto',
      spaceBetween: 14,
      freeMode: true,
    });
  };

  if (document.querySelector('.card-detail__slider')) {
    new Swiper('.card-detail__slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  };

  // Клик по кнопке В корзину у карточки
  let cardToCart = document.querySelectorAll('.card__tocart');

  cardToCart.forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.card__bottom').classList.add('added');
    });
  });

  // Табы
  let tabsBtns = document.querySelectorAll('.tabs__btn');

  if (tabsBtns) {
    tabsBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        let id = this.getAttribute('data-tab');
        let content = document.querySelector('.tabs__item[data-tab="' + id + '"]');

        this.closest('.tabs__btns').querySelector('.tabs__btn.active').classList.remove('active');
        this.classList.add('active');

        this.closest('.tabs').querySelector('.tabs__item.active').classList.remove('active');
        content.classList.add('active');
      });
    });
  };


  // Счетчик в карточке
  let counterWrapper = document.querySelectorAll('.counter');

  counterWrapper.forEach(counter => {
    let counterInput = counter.querySelector('.counter__input');
    let counterMinus = counter.querySelector('.counter__minus');
    let counterPlus = counter.querySelector('.counter__plus');

    counterPlus.addEventListener('click', function (e) {
      e.preventDefault();
      counterInput.value++;
    });
    counterMinus.addEventListener('click', function (e) {
      e.preventDefault();
      if (counterInput.value > 0) {
        counterInput.value--;
      }
    });
    counterInput.addEventListener('input', function (e) {
      e.preventDefault();
      if (counterInput.value < 0) {
        counterInput.value = 0;
      };
    });
  });


  // Формы
  let dataForm = document.querySelectorAll('.form');

  if (dataForm.length) {
    dataForm.forEach(dataForm => {
      let dataInput = dataForm.querySelectorAll('.required');
      let btnSubmit = dataForm.querySelector('.btn__submit');

      btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        let validInput;
        let errorsForm = 0;

        // проверка только инпутов с классом required
        dataInput.forEach(dataInput => {
          validInput = checkValue(dataInput);

          if (validInput) {
            dataInput.classList.remove('error');
          } else {
            dataInput.classList.add('error');
            ++errorsForm;
            return errorsForm;
          };
        });

        if (errorsForm == 0) {
          // Действия в зависимости от вида формы

          // Форма ввода телефона при входе
          if (dataForm.classList.contains('login-one') && dataForm.querySelector('.js-auth-tel')) {
            // Проверка виртуальной карты
            // if () {
            // если найдена
            dataForm.style.display = 'none';
            document.querySelector('.login-two').style.display = 'block';
            console.log('отправка');
            // } else {
            // если не найдена
            // let cardNotFound = document.querySelector('[data-modal="cardNotFound"]');
            // showModal(cardNotFound, 'cardNotFound');
            // };
          } else if (dataForm.classList.contains('card-detail__form')) {
            dataForm.querySelector('.btn__submit').classList.add('added');
            dataForm.querySelector('.btn__submit').innerHTML = 'В корзине';
          };
        };
      });
    });
  };

  // inputmask
  if (document.querySelector('input[type="tel"]')) {
    new Inputmask({
      mask: '+7 999 999-99-99',
      clearMaskOnLostFocus: false,
      oncomplete: function () {
        checkValue(this);
      },
      onincomplete: function () {
        checkValue(this);
      },
    }).mask(document.querySelectorAll('input[type="tel"]'));
  }

  // Валидация
  function checkValue(input) {
    let isValid = false;

    if (input.getAttribute('type') == 'tel') {
      // Телефон
      isValid = Inputmask.isValid(input.value, { mask: "+7 999 999-99-99" });

    } else if (input.getAttribute('type') == 'email') {
      // Почта
      let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      reg.test(input.value) ? isValid = true : isValid = false;

    } else if (input.getAttribute('type') == 'search') {
      // Поиск
      let reg = /^[а-яА-Я\s.,()]+?\d+/i;
      reg.test(input.value) ? isValid = true : isValid = false;

    } else if (input.querySelector('.counter__input')) {
      // Счетчик
      let reg = /^[0-9]$/;
      reg.test(input.querySelector('.counter__input').value) ? isValid = true : isValid = false;

    } else if (input.classList.contains('date')) {
      // Дата
      if (input.value != '' && input.value.length == 10 && input.value > '1900-01-01' && input.value < '2020-01-01') {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (input.getAttribute('type') == 'checkbox') {
      // Чекбокс
      input.checked ? isValid = true : isValid = false;

    } else if (input.getAttribute('type') == 'radio') {
      // Радиокнопки
      let radioBtn = document.querySelectorAll('[type="radio"]');
      let checkedRadio = 0;

      radioBtn.forEach(radio => {
        if (radio.checked) {
          checkedRadio++
        };
      });
      checkedRadio >= 1 ? isValid = true : isValid = false;

    } else if (input.constructor.name == 'HTMLTextAreaElement') {
      // Текстовое поле
      let reg = /^(?=[а-яa-z0-9])[а-яa-z0-9\s]{1,4000}[а-яa-z0-9]$/i;
      reg.test(input.value) ? isValid = true : isValid = false;

    } else {
      // Короткий текст (имя, фамилия и тд)
      let reg = /^[A-Za-zА-Яа-яЁё]+$/;
      reg.test(input.value) ? isValid = true : isValid = false;
    }

    if (!isValid) {
      return false;
    } else {
      return true;
    };
  };

  // Форма ввода кода из смс
  const inputsNL = document.querySelectorAll('.sms__input');
  const inputsList = Array.prototype.slice.call(inputsNL);

  inputsList.forEach((input, index) => {
    input.addEventListener('keyup', function (e) {
      if (e.which === 69) return input.value = '';
      let value = input.value;
      let len = value.length;
      if (e.which === 8 && inputsList[index - 1]) {
        return inputsList[index - 1].focus();
      }
      if (len === 1) {
        input.value = value.substr(0, 1);
        if (inputsList[index + 1]) inputsList[index + 1].focus();
      } else if (inputsList[index + 1] && e.which != 8) {
        input.value = value.substr(0, 1);
        inputsList[index + 1].focus();
        inputsList[index + 1].value = value.substr(1, 1);
      } else if (len > 1 && !inputsList[index + 1]) {
        input.value = value.substr(0, 1);
      };
    });
  });

  // Клики по кнопкам-ссылкам
  let linkBtn = document.querySelectorAll('[data-link-to]');

  linkBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      let id = this.getAttribute('data-link-to');
      let content = document.querySelector('[data-link="' + id + '"]');

      this.closest('[data-link-wrapper]').style.display = 'none';
      content.style.display = 'block';
    });
  });

  // Вызов модалки
  function showModal(btnTrigger, modalId) {
    let id = btnTrigger.getAttribute('data-modal-trigger');
    let content;
    if (modalId != undefined) {
      content = document.querySelector('[data-modal="' + modalId + '"]');
    } else {
      content = document.querySelector('[data-modal="' + id + '"]');
    }

    let modalBg = document.createElement('div');
    modalBg.classList.add('modal__bg');

    content.append(modalBg);
    content.style.display = 'block';
    body.classList.add('noscroll');


    // Активный таб в модалке
    if (btnTrigger.getAttribute('data-active-window')) {
      let tabName = btnTrigger.getAttribute('data-active-window');
      let tabItem = content.querySelectorAll('[data-tab]');
      tabItem.forEach(item => {
        if (tabName == item.getAttribute('data-tab')) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        };
      });
    };

    // Закрытие клик на Задний фон
    modalBg.addEventListener('click', function () {
      content.removeAttribute('style');
      body.classList.remove('noscroll');
      modalBg.remove();
    });

    // Закрытие клик на кнопку Закрыть
    let modalClose = document.querySelectorAll('[data-modal-close]');
    if (modalClose) {
      modalClose.forEach(modalClose => {
        modalClose.addEventListener('click', function () {
          modalClose.closest('[data-modal]').removeAttribute('style');
          modalBg.remove();
          body.classList.remove('noscroll');
        });
      });
    };
  };

  let modalTrigger = document.querySelectorAll('[data-modal-trigger]');
  if (modalTrigger) {
    modalTrigger.forEach(btn => {
      btn.addEventListener('click', () => {
        showModal(btn);
      });
    });
  };

  // Каталог кнопка выбрать известный адрес
  let locationConfirm = document.querySelector('.js-location-confirm');
  if (locationConfirm) {
    locationConfirm.addEventListener('click', function () {
      this.closest('.location').remove();
    });
  };

  // Инпут плейсхолдер
  let placeholder = document.querySelectorAll('.placeholder');

  if (placeholder) {
    placeholder.forEach(placeholder => {
      if (placeholder.querySelector('.input').value != '') {
        placeholder.querySelector('.placeholder__text').remove();
      } else {
        placeholder.addEventListener('click', function () {
          this.querySelector('.placeholder__text').remove();
        });
      };
    });
  };

  // Прикрепление файла
  // список файлов хранится в инпуте submit-files
  let msgInput = document.querySelectorAll('.file__input');

  if (msgInput) {
    msgInput.forEach(input => {
      let filesList = [];
      let bottom = input.closest('.file');

      // Функция проверки файлов. Если есть, скрываем кнопку "Прикрепить", иначе показываем
      function checkFiles(bottom, files) {
        if (files.length != 0) {
          bottom.querySelector('.file__attach').style.display = 'none';
        } else {
          bottom.querySelector('.file__attach').style.display = 'block';
        };
      }

      // Прикрепляем файлы к скрытому интпуту (для отправки формы через ajax)
      function assignFiles(bottom, files) {
        const fileInput = bottom.querySelector('.submit-files');
        const dataTransfer = new DataTransfer();
        files.forEach(file => {
          dataTransfer.items.add(file);
        });
        fileInput.files = dataTransfer.files;
      }

      // Функция вывода списка файлов
      function renderFileList(files, bottom) {
        let filesWrapper = bottom.querySelector('.file__list');
        filesWrapper.innerHTML = '';

        // Показываем/Скрываем кнопку 
        checkFiles(bottom, filesList);

        //Проходимся по файлам
        for (let i = 0; i < files.length; i++) {
          // Создаем span, содержащий имя файла и кнопку удалить
          let span = document.createElement('span');
          span.classList.add('file__item');
          span.innerHTML = files[i].name;

          // Создаем кнопку (лучше оставить тег button, чтобы работало во всех браузерах норм)
          let removeBtn = document.createElement('button');
          removeBtn.setAttribute('type', 'button');
          removeBtn.classList.add('file__remove-button');
          removeBtn.insertAdjacentHTML('beforeend', `
                    <svg class="file__remove-icon" fill="#47b200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
                        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"/>
                    </svg>
                `);

          // Функция обработчик клика удаления файла 
          function onRemoveButtonClick(e) {
            e.preventDefault();
            let fileHTML = this.closest('.file__item');
            filesList = filesList.filter((f) =>
            (
              f.name !== files[i].name
              // && f.lastModified !== files[i].lastModified
            ));
            fileHTML.remove();

            // переприсваеваем файлы
            checkFiles(bottom, filesList);
            assignFiles(bottom, filesList);

            removeBtn.removeEventListener('click', onRemoveButtonClick)
          }


          removeBtn.addEventListener('click', onRemoveButtonClick)


          // Прикрепляем к форме
          span.append(removeBtn);
          filesWrapper.append(span)
        };

        // Инпут, хранящий все файлы
        assignFiles(bottom, filesList);
      };

      input.addEventListener('click', (e) => {
        e.target.value = '';
      });

      input.addEventListener('change', (e) => {
        let files = e.target.files;

        Array.from(files).forEach(file => {
          let foundFile = filesList.find(f => (
            f.name === file.name
            && f.lastModified === file.lastModified
          ));
          // добавляем только файлы с разными названиями
          if (!foundFile) {
            filesList.push(file);
          }
        });

        renderFileList(filesList, bottom);
      });
    });
  };

  // Выбор адреса из списка
  let searchItem = document.querySelectorAll('.search__item');

  if (searchItem) {
    searchItem.forEach(btn => {
      btn.addEventListener('click', function (e) {
        let search = btn.closest('.address__form').querySelector('.search__input');
        search.value = btn.textContent;
        search.setAttribute('disabled', '');
        search.closest('.search').classList.add('selected');
      });
    });
  };

  // Кнопка стереть в поиске
  let removeBtn = document.querySelectorAll('.js-remove');

  if (removeBtn) {
    removeBtn.forEach(btn => {
      btn.addEventListener('click', function () {
        btn.closest('.search').classList.remove('selected');
        btn.closest('.search').querySelector('.search__input').removeAttribute('disabled');
        btn.closest('.search').querySelector('.search__input').value = '';
      });
    });
  };

  // Переключатель
  let switcherBtn = document.querySelectorAll('.switcher__item');

  if (switcherBtn) {
    switcherBtn.forEach(btn => {
      btn.addEventListener('click', function () {
        let activeBtn = btn.closest('.switcher').querySelector('.switcher__item.active');

        if (btn != activeBtn) {
          activeBtn.classList.remove('active');
          btn.classList.add('active');
        };
      });
    });
  };

  // Удаление перетаскиванием
  let draggableElems = document.querySelectorAll('.cart__inner');
  if (draggableElems) {
    let draggies = [];

    for (let draggableElem of draggableElems) {
      let draggie = new Draggabilly(draggableElem, {
        handle: '.draggieHandle',
        axis: 'x',
      });
      draggies.push(draggie);

      draggie.on('dragEnd', function () {
        if (this.position.x <= -160) {
          let item = this;
          this.element.closest('.cart__item').style.transform = 'scale(0)';
          window.setTimeout(function () {
            item.element.closest('.cart__item').remove();
          }, 100);

        } else {
          this.element.style.left = '0';
        };
      });
    };
  };
});