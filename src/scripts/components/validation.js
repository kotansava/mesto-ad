const showInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
};

const checkInputValidity = (formElement, inputElement, settings) => {
  let errorMessage = '';
  
  if (inputElement.validity.valueMissing) {
    errorMessage = 'Это поле обязательно';
  }
  else if (inputElement.validity.typeMismatch && inputElement.type === 'url') {
    errorMessage = 'Введите корректный URL-адрес';
  }
  else if (inputElement.classList.contains('popup__input_type_name')) {
    const valueLength = inputElement.value.length;
    if (valueLength < 2) {
      errorMessage = 'Имя должно содержать минимум 2 символа';
    } else if (valueLength > 40) {
      errorMessage = 'Имя должно содержать максимум 40 символов';
    } else if (inputElement.validity.patternMismatch) {
      errorMessage = inputElement.dataset.errorMessage || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
    }
  }
  else if (inputElement.classList.contains('popup__input_type_description')) {
    const valueLength = inputElement.value.length;
    if (valueLength < 2) {
      errorMessage = 'Описание должно содержать минимум 2 символа';
    } else if (valueLength > 200) {
      errorMessage = 'Описание должно содержать максимум 200 символов';
    }
  }
  else if (inputElement.classList.contains('popup__input_type_card-name')) {
    const valueLength = inputElement.value.length;
    if (valueLength < 2) {
      errorMessage = 'Название должно содержать минимум 2 символа';
    } else if (valueLength > 30) {
      errorMessage = 'Название должно содержать максимум 30 символов';
    } else if (inputElement.validity.patternMismatch) {
      errorMessage = inputElement.dataset.errorMessage || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
    }
  }
  else if (inputElement.classList.contains('popup__input_type_avatar')) {
    if (inputElement.validity.typeMismatch) {
      errorMessage = 'Введите корректный URL-адрес';
    }
  }
  else if (inputElement.classList.contains('popup__input_type_url')) {
    if (inputElement.validity.typeMismatch) {
      errorMessage = 'Введите корректный URL-адрес';
    }
  }
  
  if (errorMessage) {
    inputElement.setCustomValidity(errorMessage);
    showInputError(formElement, inputElement, settings);
    return false;
  } else {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, settings);
    return true;
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => {
    return !inputElement.validity.valid;
  });
};

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, settings);
  
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach(inputElement => {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, settings);
  });
  
  disableSubmitButton(buttonElement, settings);
};

const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach(formElement => {
    setEventListeners(formElement, settings);
    
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
  });
};

export { enableValidation, clearValidation };