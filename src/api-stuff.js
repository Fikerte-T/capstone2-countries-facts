const appId = 'Wx8jWGhciZxE4RrbP6Be';

const involvementBaseURL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/';
const involvementLikesEndPoint = `${involvementBaseURL}apps/${appId}/likes`;
const involvementCommentsEndPoint = `${involvementBaseURL}apps/${appId}/comments`;

const countriesAPIBaseURL = 'https://countriesnow.space/api/v0.1/countries/';
const countriesAndFlagsURL = `${countriesAPIBaseURL}info?returns=flag`;
// add currency, flag, dialcode, url

const postStuff = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

const getStuff = async (url) => {
  const res = await fetch(url);
  // const data = await res.json();
  // console.log(data)
  // return data;
  return res.json();
};

export { postStuff, countriesAndFlagsURL, countriesAPIBaseURL, getStuff };
