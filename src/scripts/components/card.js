export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard },
  currentUserId
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  cardImage.src = data.link;
  cardImage.alt = data.name;
  
  cardElement.querySelector(".card__title").textContent = data.name;

  if (likeCountElement && data.likes) {
    likeCountElement.textContent = data.likes.length;
  }

  if (currentUserId && data.likes) {
    const isLikedByCurrentUser = data.likes.some(like => like._id === currentUserId);
    if (isLikedByCurrentUser) {
      likeButton.classList.add("card__like-button_is-active");
    }
  }

  if (currentUserId && data.owner && data.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }
  
  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton, likeCountElement));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
