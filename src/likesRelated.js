import { postStuff, getStuff, involvementLikesEndPoint } from './api-stuff.js';

// eslint-disable-next-line import/no-mutable-exports
let allLikedCountriesArr = [];

const getAllLikedCountries = async () => {
  let res;
  try {
    res = await getStuff(involvementLikesEndPoint);
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
      await postStuff(involvementLikesEndPoint, data, true);
      await getAllLikedCountries();
      callback();
    });
  });
};

// eslint-disable-next-line import/prefer-default-export
export { handleLikeFeature, getAllLikedCountries, allLikedCountriesArr };