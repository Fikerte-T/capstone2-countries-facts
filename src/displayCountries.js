import { getStuff, postStuff, countriesAndFlagsURL } from './api-stuff.js';

const codeForSingleCountry = (country) => `<div class="card country">
               <img class="card-img-top flag" src="${country.flag}">
                <div class="card-body">
                    <div class="nameAndLikes">
                        <h5 class="card-title">${country.name}</h5>
                        <h6><i class="far fa-heart"></i><span class="nbLikes" data-ctr-likes="${country.name}">0</span> likes</h6>
                    </div>
                    <div class="commentBtn">
                         <button type="button"><i class="fas fa-comment"></i> Comments and facts </button>
                    </div>
                </div>
            </div>`;
const displayAllCountries = (arr, sortCrit = 'a-z', limit = 300, filterStr = '') => {
  const arrToDisplay = arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    return 1;
  })
    .slice(0, limit);

  console.log(arrToDisplay);
  const htmlCode = arrToDisplay.map((el) => codeForSingleCountry(el)).join('');
  // eslint-disable-next-line no-undef
  $('#countriesGrid').html(htmlCode);
};

(async () => {
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    const countriesArr = countriesData.data;
    displayAllCountries(countriesArr);
  }
})();