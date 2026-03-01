  const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "0c0ee88f-b42f-4302-a66f-c0a49e292cc0",
    "Content-Type": "application/json",
  },
};

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}; 

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, { 
    headers: config.headers, 
  }).then(getResponseData); 
};

export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, { 
    headers: config.headers, 
  }).then(getResponseData); 
};

export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(getResponseData);
};


export const setUserAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar
    }),
  }).then(getResponseData);
};

export const addNewCard = ({ name, link}) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link
    }),
  }).then(getResponseData);
};


export const deleteServCard = (cardId) => {
 return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers
    }).then(getResponseData);
};

export const changeLikeCardStatus = (cardID, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: isLiked ?  "DELETE" : "PUT",
    headers: config.headers,
  }).then((res) => getResponseData(res));
};