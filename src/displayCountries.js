/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import { getStuff, countriesAndFlagsURL } from './api-stuff.js';
import { mf } from './missingFlags.js';

let allCountriesArr = [];
let filteredCountriesArr = [];
const searchInput = document.querySelector('#searchCountriesInput');
const sortBtn = document.querySelector('.sortBtn');
const { nbPerPageForm } = document.forms;
const { nbPerPageInput } = nbPerPageForm;
const allCountriesLink = document.querySelector('#allCountriesLink');
const dropdownItems = [...document.querySelectorAll('.dropdown-item')];
let allCountriesNb = 0;
const searchFeedback = document.querySelector('.searchFeedback');

const codeForSingleCountry = (country) => {
  let flagUrl = country.flag;
  if (flagUrl === undefined) {
    flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/338px-No_flag.svg.png';
  }
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
  if (nb === 1) {
    return `<li class="page-item activeItem" data-number="1">
                            <span class="page-link numbered" data-number="1">1</span>
                         </li>`;
  }
  return `<li class="page-item" data-number="${nb}"><a class="page-link numbered" data-number="${nb}" href="#">${nb}</a></li>`;
};

const handleClickOnPaginationElts = (arrOfNbs, nbPp) => {
  const allNbItems = [...document.querySelectorAll('.numbered')];
  for (let i = 0; i < allNbItems.length; i += 1) {
    const nbi = allNbItems[i];
    nbi.addEventListener('click', (e) => {
      e.stopPropagation();
      const previousNb = Number(document.querySelector('.page-item.activeItem').getAttribute('data-number'));
      const nb = Number(e.target.getAttribute('data-number'));
      if (nb === 1) {
        document.querySelector('.previousBtn').classList.add('disabled');
      } else {
        document.querySelector('.previousBtn').classList.remove('disabled');
        if (nb === arrOfNbs[arrOfNbs.length - 1]) {
          document.querySelector('.nextBtn').classList.add('disabled');
        } else {
          document.querySelector('.nextBtn').classList.remove('disabled');
        }
      }
      if (previousNb !== nb) {
        allNbItems.forEach((nbii) => {
          nbii.parentElement.classList.remove('activeItem');
        });
        e.target.parentElement.classList.add('activeItem');
        e.target.classList.add('activeItem');
        const from = (nb - 1) * nbPp;
        const param = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
        // eslint-disable-next-line no-use-before-define
        displayArrayOfCountries(filteredCountriesArr, false, param, from, nbPp);
      }
    });
  }

  // Previous and next buttons
  document.querySelector('.previousBtn').addEventListener('click', (e) => {
    if (!e.target.classList.contains('disabled')) {
      const activePage = Number(document.querySelector('.page-item.activeItem').getAttribute('data-number'));
      if (activePage !== 1) {
        document.querySelector('.nextBtn').classList.remove('disabled');
        allNbItems[activePage - 1].parentElement.classList.remove('activeItem');
        allNbItems[activePage - 2].parentElement.classList.add('activeItem');
        const from = (activePage - 2) * nbPp;
        const param = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
        // eslint-disable-next-line no-use-before-define
        displayArrayOfCountries(filteredCountriesArr, false, param, from, nbPp);
        if ((activePage - 1) === 1) {
          document.querySelector('.previousBtn').classList.add('disabled');
        }
      }
    }
  });
  document.querySelector('.nextBtn').addEventListener('click', (e) => {
    if (!e.target.classList.contains('disabled')) {
      const activePage = Number(document.querySelector('.page-item.activeItem').getAttribute('data-number'));
      const lastPage = Number(allNbItems[allNbItems.length - 1].getAttribute('data-number'));
      if (activePage !== lastPage) {
        document.querySelector('.previousBtn').classList.remove('disabled');
        allNbItems[activePage - 1].parentElement.classList.remove('activeItem');
        allNbItems[activePage].parentElement.classList.add('activeItem');
        const from = activePage * nbPp;
        const param = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
        // eslint-disable-next-line no-use-before-define
        displayArrayOfCountries(filteredCountriesArr, false, param, from, nbPp);
        if (activePage === (lastPage - 1)) {
          document.querySelector('.nextBtn').classList.add('disabled');
        }
      }
    }
  });
};

const handlePagination = (nbElts, nbPerPage) => {
  const ctn = document.querySelector('.paginationContainer');
  const totalPages = Math.ceil(nbElts / nbPerPage);
  const arrOfNbs = [...Array(totalPages + 1).keys()].slice(1);

  const paginationCode = `<nav aria-label="Pagination of the countries container">
    <ul class="pagination justify-content-center mb-5">
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
  setTimeout(() => {
    handleClickOnPaginationElts(arrOfNbs, nbPerPage);
  }, 500);
};

const displayArrayOfCountries = (arr, shouldHandlePagination = false, sortCrit = 'a-z', from = 0, limit = 24) => {
  filteredCountriesArr = arr.sort((a, b) => {
    let value = 1;
    switch (sortCrit) {
      case 'a-z': if (a.name > b.name) value = 1; else value = -1;
        break;
      case 'z-a': if (a.name > b.name) value = -1; else value = 1;
        break;
      default: value = 1;
    }
    return value;
  });
  const arrToDisplay = filteredCountriesArr.slice(from, from + limit);

  $('#countriesGrid').html('');
  const htmlCode = arrToDisplay.map((el) => codeForSingleCountry(el)).join('');
  // eslint-disable-next-line no-undef
  $('#countriesGrid').html(htmlCode);
  addClicksListener();
  if (shouldHandlePagination) {
    handlePagination(arr.length, limit);
  }
};

const handleSearch = () => {
  searchInput.addEventListener('input', () => {
    const str = searchInput.value;
    const strLc = str.toLowerCase();
    if (str.length > 0) {
      filteredCountriesArr = allCountriesArr.filter((c) => c.name.toLowerCase().includes(strLc));
    } else {
      filteredCountriesArr = allCountriesArr;
    }
    if (filteredCountriesArr.length > 0) {
      if (filteredCountriesArr.length === allCountriesNb) {
        searchFeedback.innerHTML = '';
      } else {
        const text = filteredCountriesArr.length === 1 ? 'country' : 'countries';
        searchFeedback.innerHTML = `<p style="font-size: 22px; padding:7px; border-radius: 10px; background-color: #7ac481; margin-inline: 20%; opacity: 0.7;"><span style="font-size: 28px; margin-right: 15px;">✅</span> Displaying <b>${filteredCountriesArr.length}</b> ${text}.<p>`;
      }
    } else {
      searchFeedback.innerHTML = '<p style="font-size: 22px; padding:10px; border-radius: 10px; background-color: #fc7290; margin-inline: 20%; opacity: 0.7;"><span style="font-size: 28px; margin-right: 15px;">🥺</span>No result. Nothing to display.</p>';
    }
    const sortParam = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
    const nb = Number(nbPerPageInput.value);
    displayArrayOfCountries(filteredCountriesArr, true, sortParam, 0, nb);
  });
};

const handleSort = () => {
  dropdownItems.forEach((di, i, w) => {
    di.addEventListener('click', (e) => {
      e.preventDefault();
      const text = di.getAttribute('data-text');
      const sortParam = di.getAttribute('data-sort-param');
      const nb = Number(nbPerPageInput.value);
      w.forEach((ww) => {
        ww.classList.remove('selected');
      });
      dropdownItems[i].classList.add('selected');
      sortBtn.textContent = text;
      displayArrayOfCountries(filteredCountriesArr, true, sortParam, 0, nb);
    });
  });
};

const handleNbChange = () => {
  nbPerPageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nb = Number(nbPerPageInput.value);
    const sortParam = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
    displayArrayOfCountries(filteredCountriesArr, true, sortParam, 0, nb);
  });
};

const handleDisplayAll = () => {
  allCountriesLink.addEventListener('click', (e) => {
    e.preventDefault();
    filteredCountriesArr = allCountriesArr;
    const nb = Number(nbPerPageInput.value);
    const sortParam = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
    searchInput.value = '';
    searchFeedback.innerHTML = '';
    displayArrayOfCountries(allCountriesArr, true, sortParam, 0, nb);
  });
};

(async () => {
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    allCountriesArr = countriesData.data;
    allCountriesNb = allCountriesArr.length;
    document.querySelector('#allCountriesLink').textContent = `All countries (${allCountriesNb})`;
    filteredCountriesArr = countriesData.data;
    displayArrayOfCountries(allCountriesArr, true);
    handleDisplayAll();
    handleSearch();
    handleSort();
    handleNbChange();
  }
})();