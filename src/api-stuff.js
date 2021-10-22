const appId = 'SlzrDKhtjDK5aun3x3Ta';
// const appId = 'Wx8jWGhciZxE4RrbP6Be';

const involvementBaseURL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/';
const involvementLikesEndPoint = `${involvementBaseURL}apps/${appId}/likes`;
const involvementCommentsEndPoint = `${involvementBaseURL}apps/${appId}/comments`;

const countriesAPIBaseURL = 'https://countriesnow.space/api/v0.1/countries/';
const countriesAndFlagsURL = `${countriesAPIBaseURL}info?returns=flag`;

const postStuff = async (url, data, isText = false) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (isText) return res.text();
  return res.json();
};

const getStuff = async (url) => {
  const res = await fetch(url);
  return res.json();
};

export {
  postStuff,
  countriesAndFlagsURL,
  getStuff,
  involvementLikesEndPoint,
  involvementCommentsEndPoint,
  countriesAPIBaseURL,
};
