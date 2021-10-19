import { getStuff, postStuff, countriesAndFlagsURL } from './api-stuff.js';

const countriesGrid = document.querySelector('.countriesGrid');

const codeForSingleCountry = (country) => `<div class="card country">
               <img class="card-img-top flag" src="${country.flag}">
                <div class="card-body">
                    <h5 class="card-title">${country.name}</h5>
                </div>
            </div>`;
const displayAllCountries = (arr, sortCrit = 'a-z', limit = 30, filterStr = '') => {
  const arrToDisplay = arr.sort((a, b) => {
    if (sortCrit === 'a-z') return a.name - b.name;
    if (sortCrit === 'z-a') {
      return b.name - a.name;
    }
    return 1;
  }).slice(0, limit);

  countriesGrid.innerHTML = arrToDisplay.map((c) => codeForSingleCountry(c)).join('');
};

(async () => {
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    const countriesArr = countriesData.data;
    displayAllCountries(countriesArr, 'a-z', 50);
  }
})();