import {
  postData, getData, countriesAPIBaseURL, involvementCommentsEndPoint,
} from './apiRelated.js';

const badge = document.querySelector('.badge');
const userName = document.querySelector('.username');
const form = document.forms['comment-form'];
const comment = document.querySelector('.comment');
const commentBtn = document.querySelector('.comment-btn');
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;

const getDialcode = async (countryname) => {
  if (countryname === 'Tanzania') return '+255';
  if (countryname === 'Venezuela') return '+58';

  try {
    const response = await postData(dialcodeUrl, {
      country: countryname,
    });
    const dialcode = response.data.dial_code;

    return dialcode;
  } catch (err) {
    return 'N/A';
  }
};

const getCurrency = async (countryname) => {
  const response = await postData(currencyUrl, {
    country: countryname,
  });
  const { currency } = response.data;

  return currency;
};

const getFlag = (countryname) => {
  const divParent = document.querySelector(`div[data-country="${countryname}"]`);
  const flag = divParent.querySelector('img').src;
  return flag;
};

const getPopulation = async (countryname) => {
  const response = await postData(populationUrl, {
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
  const response = await postData(capitalUrl,
    {
      country: countryname,
    });
  const capitalData = response.data.capital;

  return capitalData;
};

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const countryInfo = async (countryname) => {
  const displayInfo = document.querySelector('.country-info');
  displayInfo.querySelector('.info-name').textContent = countryname;
  const flag = getFlag(countryname);
  displayInfo.querySelector('.info-flag').src = flag;
  displayInfo.querySelector('.info-capital').textContent = 'Loading...';
  displayInfo.querySelector('.info-currency').textContent = 'Loading...';
  displayInfo.querySelector('.info-dialcode').textContent = 'Loading...';
  displayInfo.querySelector('.info-population').textContent = 'Loading...';

  const capital = await getCapital(countryname);
  displayInfo.querySelector('.info-capital').textContent = capital;
  const currency = await getCurrency(countryname);
  displayInfo.querySelector('.info-currency').textContent = currency;
  const dialcode = await getDialcode(countryname);
  displayInfo.querySelector('.info-dialcode').textContent = dialcode;
  const population = await getPopulation(countryname);
  const latestPopulation = population[population.length - 1];
  displayInfo.querySelector('.info-population').textContent = `${numberWithCommas(latestPopulation.value)} (${latestPopulation.year})`;
};

const createNewComment = async (countryname, username, comment) => {
  await postData(involvementCommentsEndPoint, {
    item_id: countryname,
    username,
    comment,
  }, true);
};

const getComments = async (countryname) => {
  const url = `${involvementCommentsEndPoint}?item_id=${encodeURIComponent(countryname)}`;
  const response = await getData(url);
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
  comments.innerHTML = commentsData.map((comment) => `<div class="d-inline-flex">
              <p class="creation-date">${comment.creation_date}</p>
              <p class="comment-username">${comment.username}: </p>
              <p class="user-comment text-start">${comment.comment}</p>
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
