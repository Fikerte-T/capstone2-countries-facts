import { postData, getData, involvementLikesEndPoint } from './apiRelated.js';

// eslint-disable-next-line import/no-mutable-exports
let allLikedCountriesArr = [];

const getAllLikedCountries = async () => {
  let res;
  try {
    res = await getData(involvementLikesEndPoint);
  } catch (err) {
    res = [];
  }
  allLikedCountriesArr = res;
};

const handleLikeFeature = (callback) => {
  const allLikesBtns = [...document.querySelectorAll('.nameAndLikes .fa-heart')];

  allLikesBtns.forEach((likeBtn) => {
    likeBtn.addEventListener('click', async () => {
      const ctrToLike = likeBtn.getAttribute('data-country');
      const data = {
        item_id: ctrToLike,
      };
      await postData(involvementLikesEndPoint, data, true);
      await getAllLikedCountries();
      callback();
    });
  });
};

export { handleLikeFeature, getAllLikedCountries, allLikedCountriesArr };