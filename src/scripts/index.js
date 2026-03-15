/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, 
        getCardList, 
        setUserInfo, 
        setUserAvatar,
        addNewCard, 
        deleteServCard,
        changeLikeCardStatus
      } from "./components/api.js";
// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const submitButtonsForm = document.querySelectorAll(".popup__form");
const submitButtons = document.querySelectorAll(".button[type=submit]");

const removeCardModal = document.querySelector('.popup_type_remove-card');
const removeCardForm = removeCardModal.querySelector('.popup__form');

const usersStatsModalWindow = document.querySelector('.popup_type_info');
const usersStatsModalTitle = usersStatsModalWindow.querySelector('.popup__title');
const usersStatsModalInfoList = usersStatsModalWindow.querySelector('.popup__info');
const usersStatsModalText = usersStatsModalWindow.querySelector('.popup__text');
const usersStatsModalUserList = usersStatsModalWindow.querySelector('.popup__list');
const infoTemplate = document.querySelector('#popup-info-definition-template');

const logo = document.querySelector('.header__logo');


submitButtonsForm.forEach((item) => {
  item.setAttribute("novalidate", "");
});

submitButtons.forEach((item) => {
  item.setAttribute("disabled", "");
  item.classList.add("popup__button_disabled");
});

profileTitleInput.setAttribute("required", "");   
profileTitleInput.setAttribute("minlength", "2");
profileTitleInput.setAttribute("maxlength", "40");
profileTitleInput.setAttribute("pattern", "^[A-Za-zА-Яа-яЁё\\s\\-]+$");
profileTitleInput.setAttribute("data-error-message", "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы");

const nameError = document.createElement("span");
nameError.classList.add("popup__error");
nameError.id = "user-name-error";
profileTitleInput.parentNode.appendChild(nameError);

profileDescriptionInput.setAttribute("required", "");
profileDescriptionInput.setAttribute("minlength", "2");
profileDescriptionInput.setAttribute("maxlength", "200");
 
const descriptionError = document.createElement("span");
descriptionError.classList.add("popup__error");
descriptionError.id = "user-description-error";
profileDescriptionInput.parentNode.appendChild(descriptionError);

avatarInput.setAttribute("required", "");
const avatarError = document.createElement("span");
avatarError.id = "user-avatar-error";
avatarError.classList.add("popup__error");
avatarInput.parentNode.appendChild(avatarError);

cardNameInput.setAttribute("required", "");
cardNameInput.setAttribute("minlength", "2");
cardNameInput.setAttribute("maxlength", "30");
cardNameInput.setAttribute("pattern", "^[A-Za-zА-Яа-яЁё\\s\\-]+$");
cardNameInput.setAttribute("data-error-message", "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы");
const cardNameError = document.createElement("span");
cardNameError.id = "place-name-error";
cardNameError.classList.add("popup__error");
cardNameInput.parentNode.appendChild(cardNameError);

cardLinkInput.setAttribute("required", "");
const cardLinkError = document.createElement("span");
cardLinkError.id = "place-link-error";
cardLinkError.classList.add("popup__error");
cardLinkInput.parentNode.appendChild(cardLinkError);

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings); 


const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const infoItem = infoTemplate.content.cloneNode(true);
  const termElement = infoItem.querySelector('.popup__info-term');
  const descriptionElement = infoItem.querySelector('.popup__info-description');
  
  if (termElement) {
    termElement.textContent = term;
  };
  if (descriptionElement) {
    descriptionElement.textContent = description;
  };
  
  return infoItem;
}; 

const handleLogoClick = () => {
  usersStatsModalInfoList.textContent = '';
  while (usersStatsModalUserList.firstChild) {
    usersStatsModalUserList.removeChild(usersStatsModalUserList.firstChild);
  }
  getCardList()
    .then((cards) => {
      const userCardCount = {};
      const users = {};
      const allCardDates = [];
      cards.forEach((item)=> {
        if (item.owner && item.owner._id) {
          const userId = item.owner._id;
          if (userCardCount[userId] === undefined) {
            userCardCount[userId] = 1;
          } else {
            userCardCount[userId] = userCardCount[userId] + 1;
          }
          users[userId] = item.owner;
          allCardDates.push(new Date(item.createdAt));
        }
      });
      let uniqueUsersCount = 0;
      for (const i in userCardCount) {
        uniqueUsersCount++;
      }
      const totalCards = cards.length;
      let firstCardDate = null;
      let lastCardDate = null;
      
      firstCardDate = allCardDates[0];
      for (let i = 1; i < allCardDates.length; i++) {
        if (allCardDates[i] < firstCardDate) {
          firstCardDate = allCardDates[i];
        }
      }
      lastCardDate = allCardDates[0];
      for (let i = 1; i < allCardDates.length; i++) {
        if (allCardDates[i] > lastCardDate) {
          lastCardDate = allCardDates[i];
        }
      }
      let maxCardsFromOneUser = 0;
      let maxCardsUserId = null;
      let maxCardsUserName = 'Пользователь';
      
      for (const userId in userCardCount) {
        if (userCardCount[userId] > maxCardsFromOneUser) {
          maxCardsFromOneUser = userCardCount[userId];
          maxCardsUserId = userId;
          if (users[userId] && users[userId].name) {
            maxCardsUserName = users[userId].name;
          }
        }
      }
      usersStatsModalTitle.textContent = 'Статистика пользователей';
      usersStatsModalInfoList.append(
        createInfoString('Всего карточек:', totalCards.toString())
      );
      usersStatsModalInfoList.append(
          createInfoString('Первая создана:', formatDate(firstCardDate))
      );
      usersStatsModalInfoList.append(
          createInfoString('Последняя создана:', formatDate(lastCardDate))
      );
      usersStatsModalInfoList.append(
        createInfoString('Всего пользователей:', uniqueUsersCount.toString())
      );
      usersStatsModalInfoList.append(
          createInfoString('Максимум карточек от одного:', 
            maxCardsUserName + ' (' + maxCardsFromOneUser + ')')
      );
      usersStatsModalText.textContent = 'Все пользователи:';
      for (const userId in users) {
        const user = users[userId];
        const userName = user.name;
        
        const listItem = document.createElement('li');
        listItem.className = 'popup__list-item';
        listItem.textContent = userName;
        
        usersStatsModalUserList.appendChild(listItem);
      }
      openModalWindow(usersStatsModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
}; 

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector('.popup__button');
  const previousText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;
  setUserInfo({
    name: profileTitleInput.value, 
    about: profileDescriptionInput.value
  }).then((userData) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closeModalWindow(profileFormModalWindow);
  }).catch((err)=>{
    console.log(err);
  }).finally(()=>{
    submitButton.textContent = previousText;
    submitButton.disabled = false;
  });
};
const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  const previousText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;
  setUserAvatar(avatarInput.value)
    .then((userData)=>{
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    closeModalWindow(avatarFormModalWindow);
  }).catch((err)=>{
    console.log(err);
  }).finally(()=>{
    submitButton.textContent = previousText;
    submitButton.disabled = false;
  });
  
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector('.popup__button');
  const previousText = submitButton.textContent;
  submitButton.textContent = "Создание...";
  submitButton.disabled = true;
  addNewCard({
    name: cardNameInput.value, 
    link: cardLinkInput.value
  }).then((cardData)=>{
      const cardElement = createCardElement(
        {
          name: cardData.name,
          link: cardData.link,
        },
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (likeButton)=>{handleLikeCard(cardData._id, likeButton)},
          onDeleteCard: handleDeleteCard,
        },
        currentUserId
      );
      cardElement.dataset.cardId = cardData._id;
      placesWrap.prepend(cardElement);
      closeModalWindow(cardFormModalWindow);
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{
      submitButton.textContent = previousText;
      submitButton.disabled = false;
    });
};

const handleLikeCard = (cardId, likeButton) => {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard)=>{
      likeButton.classList.toggle('card__like-button_is-active');
      const likeCountElement = likeButton.nextElementSibling;
      if (likeCountElement && updatedCard.likes) {
        likeCountElement.textContent = updatedCard.likes.length;
      }
    })
    .catch((err)=>{
      console.log(err);
    });
};

const handleDeleteCard = (cardElement) => {
  const cardId = cardElement.dataset.cardId;
  
  openModalWindow(removeCardModal);
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const deleteButton = removeCardForm.querySelector('.popup__button');
    const originalText = deleteButton.textContent;
    deleteButton.textContent = 'Удаление...';
    deleteButton.disabled = true;
    
    deleteServCard(cardId)
      .then(() => {
        cardElement.remove();
        closeModalWindow(removeCardModal);
      })
      .catch(console.error)
      .finally(() => {
        deleteButton.textContent = originalText;
        deleteButton.disabled = false;
        removeCardForm.removeEventListener('submit', handleSubmit);
      });
  };
  removeCardForm.addEventListener('submit', handleSubmit);
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);
logo.addEventListener('click', handleLogoClick);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});
let currentUserId = null;
Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData])=>{
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    cards.forEach((cardData) => {
      const cardElement = createCardElement(cardData, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: (likeButton)=>{handleLikeCard(cardData._id, likeButton)},
        onDeleteCard: handleDeleteCard,
      }, currentUserId);
      cardElement.dataset.cardId = cardData._id;
      placesWrap.append(cardElement);
    });
  })
  .catch((err)=>{
    console.log(err);
  });