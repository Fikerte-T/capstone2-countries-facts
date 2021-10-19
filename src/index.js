import './style.css';

import { postStuff, getStuff, countriesAndFlagsURL, countriesAPIBaseURL } from "./api-stuff";
const flag = document.querySelector('.flag')
const countryName = document.querySelector('.country-name')
const population = document.querySelector('.population')
const capital = document.querySelector('.capital')
const currency = document.querySelector('.currency')
const dialCode = document.querySelector('.dial-code')
let displayInfo = document.querySelector('.country-info')
const countryFlagCurrencyDialcode = `${countriesAPIBaseURL}info?returns=currency,flag,unicodeFlag,dialCode`;
const capitalUrl = 'https://countriesnow.space/api/v0.1/countries/capital';
const populationUrl = 'https://countriesnow.space/api/v0.1/countries/population/cities';

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
const countryInfo = async (arr) => {
    
            displayInfo.innerHTML = `
            <img class="flag img-fluid rounded mx-auto d-block" src="${arr.flag}" alt="country flag">
            <h3 class="country-name">${arr.name}</h3>
            <div class="d-inline-flex justify-content-between">
                <div class ="m-3">
                    <p class="capital">Capital: ${capitalData}</p>
                    <p class="population">Population: ${arr.currency} in year ${arr.currency}</p>
                </div >
                <div class ="m-3">
                    <p class="currency">Currency: ${arr.currency}</p>
                    <p class="dial-code">Dial-Code: ${arr.dialCode}</p>
                </div>
            </div>
            `;
            
    
}

let cname = 
    
        {
        name: "Bangladesh",
        flag: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg"
        }
    ;

const getFlagCurrencyDialcode = async (cname) => {
    let response = await getStuff(countryFlagCurrencyDialcode);
    let data = response.data;
    console.log(data);
    console.log(data[0])
    console.log(cname)
    data.forEach(async cdata => {
        if(cname.name === cdata.name){
            getCapital(cname);
        }
    })
}

const getCapital = async (cname) => {
    let response = await postStuff(capitalUrl, 
        {
            "country": 'bangladesh'
        });
    let capitalData = response.data.capital;
    console.log(data);
    console.log(data.capital);
    await countryInfo(capitalData);
    getPopulation(capitalData);
}

const getPopulation = async (capital) => {
    let response = await postStuff(populationUrl, {
        "city": capital
    })
    let population = response.data.populationCounts[0];
    console.log(population)
    
}
getFlagCurrencyDialcode(cname);

getCapital();
