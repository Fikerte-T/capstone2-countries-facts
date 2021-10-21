import {
  postStuff, getStuff, countriesAPIBaseURL, involvementCommentsEndPoint,
} from './api-stuff.js';

const userName = document.querySelector('.username');
const comment = document.querySelector('.comment');
const form = document.forms['comment-form'];
const displayInfo = document.querySelector('.country-info');
const comments = document.querySelector('.comments');
const commentBtn = document.querySelector('.comment-btn');
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population/cities`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;
const flagUrl = `${countriesAPIBaseURL}flag/images`;

const getDialcode = async (countryname) => {
  const response = await postStuff(dialcodeUrl, {
    country: countryname,
  });
  const dialcode = response.data.dial_code;

  return dialcode;
};

const getCurrency = async (countryname) => {
  const response = await postStuff(currencyUrl, {
    country: countryname,
  });
  const { currency } = response.data;

  return currency;
};

const getFlag = async (countryname) => {
  const response = await postStuff(flagUrl, {
    country: countryname,
  });

  const { flag } = response.data;

  return flag;
};

const getPopulation = async (capital) => {
  const response = await postStuff(populationUrl, {
    city: capital,
  });
  const population = response.data.populationCounts;

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

const countryInfo = async (countryname) => {
  const flag = await getFlag(countryname);
  const capital = await getCapital(countryname);
  const currency = await getCurrency(countryname);
  const dialcode = await getDialcode(countryname);
  const population = await getPopulation(capital);
  displayInfo.innerHTML = `
      <img class="img-fluid rounded mx-auto d-block" src="${flag}" alt="country flag">
      <h3>${countryname}</h3>
      <div class="d-inline-flex justify-content-between">
          <div class ="m-3">
              <p>Capital: ${capital}</p>
              <p>Population: ${population[0].value} in year ${population[0].year}</p>
          </div >
          <div class ="m-3">
              <p>Currency: ${currency}</p>
              <p>Dial-Code: ${dialcode}</p>
          </div>
      </div>
      `;
};
//  create new comment and display comments

const createNewComment = async (countryname, username, comment) => {
  await postStuff(involvementCommentsEndPoint, {
    item_id: countryname,
    username,
    comment,
  }, true);
};

const getComments = async (countryname) => {
  const response = await getStuff(`${involvementCommentsEndPoint}?item_id=${countryname}`);
  return response;
};

const displayComment = async (countryname = 'Bangladesh') => {
  const commentsData = await getComments(countryname);

  commentsData.forEach((comment) => {
    comments.innerHTML += `
          <div class="d-inline-flex">
              <p class="me-3">${comment.creation_date}</p>
              <p class="me-2">${comment.username}: </p>
              <p>${comment.comment}</p>
          </div>
          `;
  });
};

form.addEventListener('submit', async (e, countryname = 'Bangladesh') => {
  e.preventDefault();
  await createNewComment(countryname, form.username.value, form.comment.value);
  form.username.value = '';
  form.comment.value = '';
  await displayComment();
});
displayComment();

export {
  countryInfo, getComments, createNewComment, commentBtn, userName, comment,
};
