import { getStuff, postStuff, countriesAndFlagsURL } from './api-stuff.js';

const countriesGrid = document.querySelector('.countriesGrid');


const codeForSingleCountry = (country) => {
    return `<div class="country">
                <div class="flag">
                    <img src="${country.flag}">
                </div>
                <div class="name">
                    <h3>${country.name}</h3>
                </div>
            </div>`;
}
function displayAllCountries(arr, sortCrit="a-z", limit=30, filterStr="") {

    let arrToDisplay = arr.sort((a, b) => {
        if(sortCrit=="a-z")
            return a.name - b.name;
        else if(sortCrit=="z-a") {
            return b.name - a.name;
        }
        else {
            return 1;
        }
    }).slice(0, limit);

    countriesGrid.innerHTML = arrToDisplay.map(c => codeForSingleCountry(c)).join('');
}

(async () => {
    const countriesData = await getStuff(countriesAndFlagsURL);
    if(countriesData.data)
    {
      const countriesArr = countriesData.data;
      displayAllCountries(countriesArr, "a-z", 30);
    }
  })();