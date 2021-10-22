import {
  postStuff, getStuff, countriesAPIBaseURL, involvementCommentsEndPoint,
} from './api-stuff.js';
import { mf } from './missingFlags.js';

const badge = document.querySelector('.badge');
const userName = document.querySelector('.username');
const form = document.forms['comment-form'];
const comment = document.querySelector('.comment');
const commentBtn = document.querySelector('.comment-btn');
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;
const flagUrl = `${countriesAPIBaseURL}flag/images`;

const getDialcode = async (countryname) => {
  if (countryname === 'Tanzania') return '+255';
  if (countryname === 'Venezuela') return '+58';

  try {
    const response = await postStuff(dialcodeUrl, {
      country: countryname,
    });
    const dialcode = response.data.dial_code;

    return dialcode;
  } catch (err) {
    return 'N/A';
  }
};

const getCurrency = async (countryname) => {
  const response = await postStuff(currencyUrl, {
    country: countryname,
  });
  const { currency } = response.data;

  return currency;
};

const getFlag = async (countryname) => {
  if (mf[countryname]) {
    return mf[countryname];
  }

  const response = await postStuff(flagUrl, {
    country: countryname,
  });

  if (response.data) {
    const { flag } = response.data;
    return flag;
  }

  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/338px-No_flag.svg.png';
};

const getPopulation = async (countryname) => {
  const response = await postStuff(populationUrl, {
    country: countryname,
  });
  let population;
  try {
    population = response.data.populationCounts;
  } catch (err) {
    population = [{ value: 'N/A', year: 2018 }];
  }
  return population;
};
const getCapital = async (countryname) => {
  const response = await postStuff(capitalUrl,
    {
      country: countryname,
    });
  const capitalData = response.data.capital;

  return capitalData;
};

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const countryInfo = async (countryname) => {
  const displayInfo = document.querySelector('.country-info');
  const flag = await getFlag(countryname);
  const capital = await getCapital(countryname);
  const currency = await getCurrency(countryname);
  const dialcode = await getDialcode(countryname);
  const population = await getPopulation(countryname);
  const latestPopulation = population[population.length - 1];
  displayInfo.innerHTML = `
      <img class="img-fluid rounded mx-auto d-block" src="${flag}" alt="country flag">
      <h3>${countryname}</h3>
      <div class="d-inline-flex justify-content-between">
          <div class ="m-3">
              <p><b>Capital:</b> ${capital}</p>
              <p><b>Population:</b> ${numberWithCommas(latestPopulation.value)} (${latestPopulation.year})</p>
          </div >
          <div class ="m-3">
              <p><b>Currency:</b> ${currency}</p>
              <p><b>Dial-Code:</b> ${dialcode}</p>
          </div>
      </div>
      `;
};

const createNewComment = async (countryname, username, comment) => {
  await postStuff(involvementCommentsEndPoint, {
    item_id: countryname,
    username,
    comment,
  }, true);
};

const getComments = async (countryname) => {
  const url = `${involvementCommentsEndPoint}?item_id=${encodeURIComponent(countryname)}`;
  const response = await getStuff(url);
  if (response.error) return [];
  return response;
};

const commentCounter = (commentsArr) => {
  const count = commentsArr.length;
  return count;
};

const displayComment = async (countryname) => {
  const comments = document.querySelector('.comments');
  const commentsData = await getComments(countryname);
  comments.innerHTML = '';
  comments.innerHTML = commentsData.map((comment) => `<div class="d-inline-flex">
              <p class="me-3">${comment.creation_date}</p>
              <p class="me-2">${comment.username}: </p>
              <p>${comment.comment}</p>
          </div>`).join('');
  badge.innerHTML = commentCounter(commentsData);
};

const formValidation = (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add('was-validated');
};

export {
  countryInfo,
  getComments,
  createNewComment,
  commentBtn,
  userName,
  comment,
  form,
  displayComment,
  formValidation,
};
