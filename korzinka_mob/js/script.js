document.addEventListener("DOMContentLoaded", function () {
  // Фри мод слайдер 
  if (document.querySelector('.freeMode-slider')) {
    new Swiper('.freeMode-slider', {
      // slidesPerView: 2,
      spaceBetween: 14,
      freeMode: true,
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
          if (dataForm.classList.contains('login-one')) {
            dataForm.style.display = 'none';
            document.querySelector('.login-two').style.display = 'block';
          };
          console.log('отправка');
        } else {
          console.log('есть ошибки');
        }
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


  // Форма ввода кода из смс
  let signinSms = document.querySelector('.sms');

  if (signinSms) {
    let smsInput = document.querySelectorAll('.sms__input');

    // Переключение активного инпута
    smsInput.forEach(input => {
      input.addEventListener('keydown', function () {
        let value = this.value;
        let len = value.length;
        let curTabIndex = parseInt(this.getAttribute('tabindex'));
        let nextTabIndex = curTabIndex + 1;
        let prevTabIndex = curTabIndex - 1;
        if (len > 0) {
          value.substr(0, 1);
          document.querySelector('[tabindex="' + nextTabIndex + '"]').focus();
        } else if (len == 0 && prevTabIndex !== 0) {
          document.querySelector('[tabindex="' + nextTabIndex + '"]').focus();
        };
      });
    });

    // Проверка и отправка
    signinSms.querySelector('.btn__submit').addEventListener('click', function (e) {
      e.preventDefault();
      let errorsForm = 0;

      smsInput.forEach(input => {
        if (input.value > 0 && input.value <= 9) {
        } else {
          ++errorsForm;
        }
      });

      if (errorsForm == 0) {
        console.log('заполнено')
      };
    });
  };


  // Клики по кнопке назад
  let backBtn = document.querySelectorAll('.back[data-back-to]');

  backBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      let id = this.getAttribute('data-back-to');
      let content = document.querySelector('[data-back="' + id + '"]');

      this.closest('[data-wrapper]').style.display = 'none';
      content.style.display = 'block';
    });
  });

});