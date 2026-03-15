const showInputError = (inputElement, errorMessage, settings) => {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (inputElement, settings) => {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";
};

const checkInputValidity = (inputElement, settings) => {
  const errorMessage = inputElement.dataset.errorMessage;
  if (!inputElement.validity.valid) {
     if (inputElement.validity.patternMismatch) {
      showInputError(inputElement, errorMessage, settings);
    } else {
      showInputError(inputElement, inputElement.validationMessage, settings);
    }
  } else {
    hideInputError(inputElement, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return Array.from(inputList).some((item) => {
    return !item.validity.valid;
  }); 
};

const disableSubmitButton =  (buttonElement, settings) => {
  buttonElement.setAttribute("disabled", "");
  buttonElement.classList.add(settings.inactiveButtonClass);
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.removeAttribute("disabled");
  buttonElement.classList.remove(settings.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)){
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, settings);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  inputList.forEach((element) => {
    hideInputError(formElement, element, settings);
  });
  disableSubmitButton(buttonElement, settings); 
};

const enableValidation = (validationSettings) => {
  const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationSettings);
  });
};


export { enableValidation, clearValidation};