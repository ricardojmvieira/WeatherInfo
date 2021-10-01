const request = require('request');
const constants = require("./config");

const weatherData = (city, callback) => {
    //api url
    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(city) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    //console.log(url);
    request({url, json:true}, (error, {body}) => {
        //console.log(body.list[0]);
        if(error){
            callback("Erro no pedido", undefined)
        }else{
            callback(undefined, {
                cityName: body.city.name,
                temperature: body.list[0].main.temp,
                description: body.list[0].weather[0].main
            })
        }
    })
}

module.exports = weatherData;