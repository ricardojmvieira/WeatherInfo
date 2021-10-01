const express = require('express');
const weatherData = require('./weatherData');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const cities = ["2267056", "2267094", "2740636", "2735941", "2268337"];

    cities.forEach(city => {
        weatherData(city, (error, {cityName, temperature, description}) => {
        if(error){
            return res.send({
                error
            })
        }
        console.log(cityName)
        console.log(temperature)
        console.log(description)
        });
    });
})

app.listen(3000);