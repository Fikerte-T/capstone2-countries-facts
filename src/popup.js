// import './style.css';

import { postStuff, getStuff, countriesAPIBaseURL, involvementCommentsEndPoint, involvementLikesEndPoint } from "./api-stuff";
const userName = document.querySelectorAll('.username');
const comment = document.querySelectorAll('.comment');
let displayInfo = document.querySelector('.country-info');
let displayComments = document.querySelectorAll('.comments');
const commentBtn = document.querySelectorAll('.comment-btn');
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population/cities`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;
const flagUrl=  `${countriesAPIBaseURL}flag/images`;


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
}


const getDialcode = async (countryname) => {
    let response = await postStuff(dialcodeUrl, {
        "country": "bangladesh"
    });
    let dialcode = response.data.dial_code;
    console.log(dialcode)
    return dialcode;
}

const getCurrency = async(countryname) => {
    let response = await postStuff(currencyUrl, {
        "country": "bangladesh"
    });
    let currency = response.data.currency;
    console.log(currency);
    return currency;
}

const getFlag = async(countryname) => {
    let response =  await postStuff(flagUrl, {
        "country": "bangladesh"
    });
    console.log(response)
    let flag = response.data.flag;
    console.log(flag)
    return flag;
}

const getPopulation = async (capital) => {
    let response = await postStuff(populationUrl, {
        "city": capital
    })
    let population = response.data.populationCounts;
    console.log(population)
    return population;
}
const getCapital = async (countryname) => {
    let response = await postStuff(capitalUrl, 
        {
            "country": "bangladesh"
        });
    let capitalData = response.data.capital;
    console.log(capitalData);
    return capitalData;
}

//  create new comment and display comments
const displayComment = async(arr) => {
    arr.forEach(comment => {
        displayComments.innerHTML = `
        <div class="d-inline-flex justify-content-between">
            <p>${comment.creation_date}</p>
            <p>${comment.username}: </p>
            <p>${comment.comment}</p>
        </div>
        `
    })
}

const createNewComment = async (countryname) => {
    let response = await postStuff(involvementCommentsEndPoint, {
        "item_id": countryname,
        "username": userName.value,
        "comment": comment.value
    })
    getComments(countryname);
    userName.value = '';
    comment.value = '';
}

const getComments = async (countryname) => {
    let response = await getStuff(`${involvementCommentsEndPoint}?item_id=${countryname}`);
    let commentsArr = response.data;
    displayComment(commentsArr); 
}
export {countryInfo, getComments, createNewComment, commentBtn};
