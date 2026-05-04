import { createCardElement, likeCard, deleteCard } from './components/card.js';
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { initialCards } from './cards.js';

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const editProfileModal = document.querySelector('.popup_type_edit');
const addCardModal = document.querySelector('.popup_type_new-card');
const updateAvatarModal = document.querySelector('.popup_type_edit-avatar');
const imageModal = document.querySelector('.popup_type_image');

const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const updateAvatarButton = document.querySelector('.profile__avatar-edit-button');

const editProfileForm = document.forms['edit-profile'];
const addCardForm = document.forms['new-place'];
const updateAvatarForm = document.forms['update-avatar'];

const nameInput = editProfileForm?.querySelector('.popup__input_type_name');
const descriptionInput = editProfileForm?.querySelector('.popup__input_type_description');

const popupImage = imageModal?.querySelector('.popup__image');
const popupCaption = imageModal?.querySelector('.popup__caption');

const cardsContainer = document.querySelector('.places__list');

const openImagePopup = (cardData) => {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModalWindow(imageModal);
};

const addCardToPage = (cardData) => {
  const cardElement = createCardElement(cardData, {
    onPreviewPicture: openImagePopup,
    onLikeIcon: likeCard,
    onDeleteCard: deleteCard
  });
  cardsContainer.prepend(cardElement);
};

editProfileButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationSettings);
  openModalWindow(editProfileModal);
});

addCardButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationSettings);
  openModalWindow(addCardModal);
});

updateAvatarButton.addEventListener('click', () => {
  updateAvatarForm.reset();
  clearValidation(updateAvatarForm, validationSettings);
  openModalWindow(updateAvatarModal);
});

editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModalWindow(editProfileModal);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const nameInputField = addCardForm.querySelector('.popup__input_type_card-name');
  const linkInputField = addCardForm.querySelector('.popup__input_type_url');
  const newCard = {
    name: nameInputField.value,
    link: linkInputField.value
  };
  addCardToPage(newCard);
  addCardForm.reset();
  clearValidation(addCardForm, validationSettings);
  closeModalWindow(addCardModal);
});

updateAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const avatarInput = updateAvatarForm.querySelector('.popup__input_type_avatar');
  profileAvatar.style.backgroundImage = `url('${avatarInput.value}')`;
  updateAvatarForm.reset();
  clearValidation(updateAvatarForm, validationSettings);
  closeModalWindow(updateAvatarModal);
});

enableValidation(validationSettings);

const modals = [editProfileModal, addCardModal, updateAvatarModal, imageModal].filter(modal => modal !== null);
setCloseModalWindowEventListeners(modals);

initialCards.forEach(cardData => {
  const cardElement = createCardElement(cardData, {
    onPreviewPicture: openImagePopup,
    onLikeIcon: likeCard,
    onDeleteCard: deleteCard
  });
  cardsContainer.append(cardElement);
});