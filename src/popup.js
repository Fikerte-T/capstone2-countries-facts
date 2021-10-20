// import './style.css';

import { postStuff, getStuff, countriesAPIBaseURL } from "./api-stuff";

let displayInfo = document.querySelector('.country-info')
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population/cities`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;
const flagUrl=  `${countriesAPIBaseURL}flag/images`


const countryInfo = async (countryname) => {
    const flag = await getFlag(countryname);
    const capital = await getCapital(countryname);
    const currency = await getCurrency(countryname);
    const dialcode = await getDialcode(countryname);
    const population = await getPopulation(capital);
    displayInfo.innerHTML = `
    <img class="flag img-fluid rounded mx-auto d-block" src="${flag}" alt="country flag">
    <h3 class="country-name">${countryname.name}</h3>
    <div class="d-inline-flex justify-content-between">
        <div class ="m-3">
            <p class="capital">Capital: ${capital}</p>
            <p class="population">Population: ${population[0].value} in year ${population[0].year}</p>
        </div >
        <div class ="m-3">
            <p class="currency">Currency: ${currency}</p>
            <p class="dial-code">Dial-Code: ${dialcode}</p>
        </div>
    </div>
    `;   
}

// let countryname = 
//         {
//         name: "Bangladesh",
//         flag: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg"
//         }
//     ;
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

// countryInfo(countryname);


export {countryInfo};
