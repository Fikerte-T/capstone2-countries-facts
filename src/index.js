import './style.css';

import { postStuff, getStuff, countriesAndFlagsURL, countriesAPIBaseURL } from "./api-stuff";
const flag = document.querySelector('.flag')
const countryName = document.querySelector('.country-name')
const population = document.querySelector('.population')
const capital = document.querySelector('.capital')
const currency = document.querySelector('.currency')
const dialCode = document.querySelector('.dial-code')
let displayInfo = document.querySelector('.country-info')
// const countryFlagCurrencyDialcode = `${countriesAPIBaseURL}info?returns=currency,flag,unicodeFlag,dialCode`;
const capitalUrl = `${countriesAPIBaseURL}capital`;
const populationUrl = `${countriesAPIBaseURL}population/cities`;
const dialcodeUrl = `${countriesAPIBaseURL}codes`;
const currencyUrl = `${countriesAPIBaseURL}currency`;
const flagUrl= `${countriesAPIBaseURL}flag/images}`;

// const countryInfo = async (country) => {
//     let response = await getStuff(countryFlagCurrencyDialcode);
//     let data = response.data;
//     console.log(data)
//     data.forEach(cdata => {
//         if(country.name === cdata.name){
//             displayInfo.innerHTML = `<a class="close-modal"><i class="fas fa-times" aria-hidden="true"></i></a>
//             <img class="flag" src="${cdata.flag}" alt="country flag">
//             <h3 class="country-name">${cdata.name}</h3>
//             <p class="capital">capital</p>
//             <p class="population">population</p>
//             <p class="currency">Currency: ${cdata.currency}</p>
//             <p class="dial-code">Dial-Code: ${cdata.dialCode}</p>`;
//         }
//     }); 
// }
const countryInfo = async (countryname) => {
    const flag = await getFlag(countryname);
    // const capital = await getCapital(countryname);
    const currency = await getCurrency(countryname);
    const dialcode = await getDialcode(countryname);
    // const population = await getPopulation(capital);
    displayInfo.innerHTML = `
    <img class="flag img-fluid rounded mx-auto d-block" src="${flag}" alt="country flag">
    <h3 class="country-name">${countryname}</h3>
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

let countryname = 
        {
        name: "Bangladesh",
        flag: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg"
        }
    ;
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
    // let flag = response.data.flag;
    // console.log(flag)
    // return flag;
}
// const getFlagCurrencyDialcode = async (countryname) => {
//     let response = await getStuff(countryFlagCurrencyDialcode);
//     let data = response.data;
//     console.log(data);
//     console.log(data[0])
//     console.log(countryname)
//     data.forEach(async cdata => {
//         if(countryname.name === cdata.name){
//             getCapital(countryname);
//         }
//     })
// }
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
    await getPopulation(capitalData);
    return capital;
}


countryInfo(countryname);
// getDialcode();
// getCapital();
// getCurrency();
// getFlag();
// getPopulation();
