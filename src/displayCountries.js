import { getStuff, countriesAndFlagsURL } from './api-stuff.js';
import { mf } from './missingFlags.js';

const codeForSingleCountry = (country) => {
  let flagUrl = country.flag;
  if (mf[country.name]) flagUrl = mf[country.name];

  return `<div class="card country">
               <img class="card-img-top flag" src="${flagUrl}">
                <div class="card-body">
                    <div class="nameAndLikes">
                        <h5 class="card-title">${country.name}</h5>
                        <h6><i class="far fa-heart"></i><span class="nbLikes" data-ctr-likes="${country.name}">0</span> likes</h6>
                    </div>
                    <div class="commentBtn">
                         <button type="button" data-country="${country.name}"><i class="fas fa-comment"></i> Comments and facts </button>
                    </div>
                </div>
        </div>`;
};

const addClicksListener = () => {
  const buttonsArr = [...document.querySelectorAll('.commentBtn button')];
  buttonsArr.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const country = e.target.getAttribute('data-country');
    });
  });
};

const displayAllCountries = (arr, sortCrit = 'a-z', limit = 30, filterStr = '') => {
  const arrToDisplay = arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    return 1;
  })
    .slice(0, limit);

  const htmlCode = arrToDisplay.map((el) => codeForSingleCountry(el)).join('');
  // eslint-disable-next-line no-undef
  $('#countriesGrid').html(htmlCode);
  addClicksListener();
};

(async () => {
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    const countriesArr = countriesData.data;
    displayAllCountries(countriesArr);
  }
})();