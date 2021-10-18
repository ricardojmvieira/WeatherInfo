require('dotenv').config();
const axios = require('axios');
const Redis = require('ioredis');
const apiKey = process.env.API_KEY;
const redis = new Redis({
        'port': 6379,
        'host': '127.0.0.1'
    })

const weatherData = async (city, callback) => {
    //api url
    const url = 'http://api.openweathermap.org/data/2.5/forecast?id=' + encodeURIComponent(city) + '&appid=' + apiKey;
    
    //get cached value
    const cacheValue = await redis.get(`weather:${city}`);
    if(cacheValue){
        const cacheData = JSON.parse(cacheValue)
        callback(undefined, {
            cityName: cacheData.city.name,
            temperature: cacheData.list[0].main.temp,
            description: cacheData.list[0].weather[0].main
        })
    }else{
        //redis.del(`weather:${city}`);
        //axios request
        await axios.get(url)
            .then(response => {     
                //save api data in cache
                redis.set(`weather:${city}`, JSON.stringify(response.data))
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
}

module.exports = weatherData;