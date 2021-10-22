/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import { getStuff, countriesAndFlagsURL } from './api-stuff.js';
import { mf } from './missingFlags.js';
import { handleLikeFeature, allLikedCountriesArr, getAllLikedCountries } from './likesRelated.js';
import {
  countryInfo, displayComment, form, createNewComment, formValidation,
} from './popup.js';

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

/* eslint-disable no-unused-vars */
const itemsCounter = () => {
  const counter = allCountriesArr.length;
  return counter;
};

const codeForSingleCountry = (country) => {
  const ctrName = country.name;
  let flagUrl = country.flag;
  if (flagUrl === undefined) {
    flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/338px-No_flag.svg.png';
  }
  if (mf[ctrName]) flagUrl = mf[ctrName];
  const thisCtrLikes = allLikedCountriesArr.find((obj) => obj.item_id === ctrName) || { likes: 0 };
  const fasOrfar = thisCtrLikes.likes > 0 ? 'fas' : 'far';
  const text = thisCtrLikes.likes <= 1 ? 'like' : 'likes';

  return `<div class="card country">
               <img class="card-img-top flag" src="${flagUrl}">
                <div class="card-body">
                    <div class="nameAndLikes">
                        <h5 class="card-title">${ctrName}</h5>
                        <h6 class="ripple"><i class="${fasOrfar} fa-heart" data-country="${ctrName}"></i><span class="nbLikes" data-ctr-likes="${country.name}">${thisCtrLikes.likes}</span> ${text}</h6>
                    </div>
                    <div class="commentBtn">
                         <button type="button" data-country="${ctrName}" class="ripple" data-bs-toggle="modal" data-bs-target="#countriesDetailsModal"><i class="fas fa-comment"></i> Comments and facts </button>
                    </div>
                </div>
        </div>`;
};

const addCommentClicksListener = () => {
  const buttonsArr = [...document.querySelectorAll('.commentBtn button')];
  buttonsArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const country = e.target.getAttribute('data-country');
      form.setAttribute('data-country', country);
      await countryInfo(country);
      await displayComment(country);
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

const allParamsAndDisplay = (arr = filteredCountriesArr, bool = true, from = 0) => {
  const nb = Number(nbPerPageInput.value);
  const sortParam = document.querySelector('.dropdown-item.selected').getAttribute('data-sort-param');
  // eslint-disable-next-line no-use-before-define
  displayArrayOfCountries(arr, bool, sortParam, from, nb);
  handleLikeFeature(() => {
    allParamsAndDisplay(filteredCountriesArr, bool, from);
  });
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
        // eslint-disable-next-line no-use-before-define
        allParamsAndDisplay(filteredCountriesArr, false, from);
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
        // eslint-disable-next-line no-use-before-define
        allParamsAndDisplay(filteredCountriesArr, false, from);
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
        // eslint-disable-next-line no-use-before-define
        allParamsAndDisplay(filteredCountriesArr, false, from);
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
  }, 100);
};

const displayArrayOfCountries = (arr, shouldHandlePagination = false, sortCrit = 'a-z', from = 0, limit = 24) => {
  filteredCountriesArr = arr.sort((a, b) => {
    let value = 1;
    switch (sortCrit) {
      case 'a-z': if (a.name > b.name) value = 1; else value = -1;
        break;
      case 'z-a': if (a.name > b.name) value = -1; else value = 1;
        break;
      case 'mlf': if (a.name > b.name) value = 1; else value = -1;
        break;
      case 'llf': if (a.name > b.name) value = 1; else value = -1;
        break;
      default: value = 1;
    }
    return value;
  });
  if (sortCrit === 'mlf') {
    filteredCountriesArr = filteredCountriesArr.sort((a, b) => {
      const objA = allLikedCountriesArr.find((obj) => obj.item_id === a.name) || { likes: 0 };
      const likesA = objA.likes;
      const objB = allLikedCountriesArr.find((obj) => obj.item_id === b.name) || { likes: 0 };
      const likesB = objB.likes;
      return likesB - likesA;
    });
  }
  if (sortCrit === 'llf') {
    filteredCountriesArr = filteredCountriesArr.sort((a, b) => {
      const objA = allLikedCountriesArr.find((obj) => obj.item_id === a.name) || { likes: 0 };
      const likesA = objA.likes;
      const objB = allLikedCountriesArr.find((obj) => obj.item_id === b.name) || { likes: 0 };
      const likesB = objB.likes;
      return likesA - likesB;
    });
  }
  const arrToDisplay = filteredCountriesArr.slice(from, from + limit);

  $('#countriesGrid').html('');
  const htmlCode = arrToDisplay.map((el) => codeForSingleCountry(el)).join('');
  // eslint-disable-next-line no-undef
  $('#countriesGrid').html(htmlCode);
  addCommentClicksListener();
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
    allParamsAndDisplay(filteredCountriesArr);
  });
};

const handleSort = () => {
  dropdownItems.forEach((di, i, w) => {
    di.addEventListener('click', (e) => {
      e.preventDefault();
      const text = di.getAttribute('data-text');
      w.forEach((ww) => {
        ww.classList.remove('selected');
      });
      dropdownItems[i].classList.add('selected');
      sortBtn.textContent = text;
      allParamsAndDisplay(filteredCountriesArr);
    });
  });
};

const handleNbChange = () => {
  nbPerPageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    allParamsAndDisplay(filteredCountriesArr);
  });
};

const handleDisplayAll = () => {
  allCountriesLink.addEventListener('click', (e) => {
    e.preventDefault();
    filteredCountriesArr = allCountriesArr;
    searchInput.value = '';
    searchFeedback.innerHTML = '';
    allParamsAndDisplay(filteredCountriesArr);
  });
};

(async () => {
  await getAllLikedCountries();
  const countriesData = await getStuff(countriesAndFlagsURL);
  if (countriesData.data) {
    allCountriesArr = countriesData.data;
    allCountriesNb = allCountriesArr.length;
    document.querySelector('#allCountriesLink').textContent = `All countries (${allCountriesNb})`;
    filteredCountriesArr = countriesData.data;
    displayArrayOfCountries(allCountriesArr, true);
    handleDisplayAll();
    allParamsAndDisplay(filteredCountriesArr);
    handleSearch();
    handleSort();
    handleNbChange();
    form.addEventListener('submit', async (e) => {
      formValidation(e);
      e.preventDefault();
      const countryname = form.getAttribute('data-country');
      await createNewComment(countryname, form.username.value, form.comment.value);
      form.username.value = '';
      form.comment.value = '';
      await displayComment(countryname);
      form.classList.remove('was-validated');
    });
  }
})();
