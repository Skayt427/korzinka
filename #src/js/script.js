document.addEventListener("DOMContentLoaded", function () {
  let body = document.querySelector('body');

  // Слайдеры 
  if (document.querySelector('.discount-slider')) {
    new Swiper('.discount-slider', {
      slidesPerView: 1.3,
      spaceBetween: 14,
      freeMode: true,
      breakpoints: {
        320: {
          slidesPerView: 1.1,
        },
        375: {
          slidesPerView: 1.3,
        },
        420: {
          slidesPerView: 1.5,
        },
        480: {
          slidesPerView: 1.8,
        },
      }
    });
  };

  if (document.querySelector('.special-offer-slider')) {
    new Swiper('.special-offer-slider', {
      slidesPerView: 1.3,
      spaceBetween: 14,
      freeMode: true,
      breakpoints: {
        320: {
          slidesPerView: 1.3,
        },
        375: {
          slidesPerView: 1.6,
        },
        420: {
          slidesPerView: 1.9,
        },
        480: {
          slidesPerView: 2.2,
        },
      }
    });
  };

  // Клик по кнопке В корзину у карточки
  let cardToCart = document.querySelectorAll('.card__tocart');

  cardToCart.forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.card__bottom').classList.add('added');
    });
  });


  // Счетчик в карточке
  let counterWrapper = document.querySelectorAll('.counter');

  counterWrapper.forEach(counter => {
    let counterInput = counter.querySelector('.counter__input');
    let counterMinus = counter.querySelector('.counter__minus');
    let counterPlus = counter.querySelector('.counter__plus');

    counterPlus.addEventListener('click', function () {
      counterInput.value++;
    });
    counterMinus.addEventListener('click', function () {
      if (counterInput.value > 0) {
        counterInput.value--;
      }
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
          };
        };
      });
    });
  };

  // Валидация
  function checkValue(input) {
    let isValid = false;

    if (input.getAttribute('type') == 'tel') {
      isValid = Inputmask.isValid(input.value, { mask: "+7 999 999-99-99" });
    } else if (input.getAttribute('type') == 'checkbox') {
      input.checked ? isValid = true : isValid = false;
    }

    if (!isValid) {
      return false;
    } else {
      return true;
    };
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

  // Каталог
  // Кнопка выбрать известный адрес
  let locationConfirm = document.querySelector('.js-location-confirm');
  if (locationConfirm) {
    locationConfirm.addEventListener('click', function () {
      this.closest('.location').remove();
    });
  };

});