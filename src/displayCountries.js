import { getStuff, countriesAndFlagsURL } from './api-stuff.js';
import { mf } from './missingFlags.js';

let allCountriesArr = [];
let filteredCountriesArr = [];

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

const paginationNumberCode = (nb) => {
    if(nb === 1) return `<li class="page-item activeItem" data-number="1">
                            <span class="page-link numbered" data-number="1">1</span>
                         </li>`;
     return `<li class="page-item" data-number="${nb}"><a class="page-link numbered" data-number="${nb}" href="#">${nb}</a></li>`;
}

const handlePagination = (nbElts, nbPerPage) => {
    let ctn = document.querySelector('.paginationContainer');
    let totalPages = Math.ceil(nbElts / nbPerPage);
    let arrOfNbs = [...Array(totalPages + 1).keys()].slice(1);

    let paginationCode = `<nav aria-label="Pagination of the countries container">
    <ul class="pagination pagination-lg justify-content-center mb-5">
      <li class="page-item previousBtn disabled">
        <span class="page-link">&laquo;</span>
      </li>
      ${arrOfNbs.map((nb) => paginationNumberCode(nb)).join('')}
      <li class="page-item nextBtn">
        <a class="page-link" href="#">&raquo;</a>
      </li>
    </ul>
  </nav>`;

  ctn.innerHTML = paginationCode;

  // Click event on page number
  let allNbItems = [...document.querySelectorAll('.numbered')];

  allNbItems.forEach((nbi) => {
      nbi.addEventListener('click', (e) => {
        let previousNb = Number(document.querySelector('.page-item.activeItem').getAttribute('data-number'));
        console.log(previousNb);
        const nb = Number(e.target.getAttribute('data-number'));
        console.log(nb);
        if(nb === 1) {
            document.querySelector('.previousBtn').classList.add('disabled');
        }
        else {
            document.querySelector('.previousBtn').classList.remove('disabled');
            if(nb === arrOfNbs[arrOfNbs.length - 1])
            {
                document.querySelector('.nextBtn').classList.add('disabled');
            }
            else {
                document.querySelector('.nextBtn').classList.remove('disabled');
            }
        }
        if(previousNb !== nb) {
            [...document.querySelectorAll('.numbered')][nb - 1].parentElement.classList.add('activeItem');
            const from = (nb - 1) * nbPerPage;
            // eslint-disable-next-line no-use-before-define
            displayArrayOfCountries(filteredCountriesArr, 'a-z', from, nbPerPage);
        }
      });
  })
};

const displayArrayOfCountries = (arr, sortCrit = 'a-z', from = 0, limit = 25) => {
  const arrToDisplay = arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    return 1;
  })
    .slice(from, from + limit);

  $('#countriesGrid').html('');
  const htmlCode = arrToDisplay.map((el) => codeForSingleCountry(el)).join('');
  // eslint-disable-next-line no-undef
  $('#countriesGrid').html(htmlCode);
  addClicksListener();
  handlePagination(arr.length, 25);
};


(async () => {
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    allCountriesArr = countriesData.data;
    filteredCountriesArr = countriesData.data;
    displayArrayOfCountries(allCountriesArr);
  }
})();