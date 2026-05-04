const handleEscUp = (evt, activeModal) => {
  if (evt.key === "Escape") {
    closeModalWindow(activeModal);
  }
};

const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", (evt) => handleEscUp(evt, modalWindow));
};

const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", (evt) => handleEscUp(evt, modalWindow));
};

const setCloseModalWindowEventListeners = (modalWindows) => {
  modalWindows.forEach((modalWindow) => {
    const closeButton = modalWindow.querySelector(".popup__close");
    closeButton.addEventListener("click", () => closeModalWindow(modalWindow));
    modalWindow.addEventListener("click", (evt) => {
      if (evt.target === modalWindow) {
        closeModalWindow(modalWindow);
      }
    });
  });
};

export { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners };