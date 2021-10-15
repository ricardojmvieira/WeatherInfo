const axios = require('axios');
const constants = require("./config");

const weatherData = (city, callback) => {
    //api url
    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(city) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    //axios request
    axios.get(url)
        .then(response => {
            //return data
            callback(undefined, {
                cityName: response.data.city.name,
                temperature: response.data.list[0].main.temp,
                description: response.data.list[0].weather[0].main
            })
        })
        .catch(error => {
        console.log(error);
    });
}

module.exports = weatherData;