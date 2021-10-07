const express = require('express');
const {graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const cronJob = require('node-cron')
const {GraphQLSchema, GraphQLObjectType,GraphQLString, GraphQLList, GraphQLFloat, GraphQLNonNull} = require('graphql');
const weatherData = require('./weatherData');

const app = express();
const cities = ["2267056", "2267094", "2740636", "2735941", "2268337"];
const weathers = [];

//define weather data types
const WeatherType = new GraphQLObjectType({
    name: 'weather',
    description: 'This represents weather',
    fields: () => ({
        cityName: { type: GraphQLNonNull(GraphQLString) },
        temperature: { type: GraphQLNonNull(GraphQLFloat) },
        description: { type: GraphQLNonNull(GraphQLString) },
    })
})

//resolve weather data
const RootQueryType = new GraphQLObjectType({
    name:'Query',
    description: 'Root Query',
    fields: () => ({
        weathers:{
            type:new GraphQLList(WeatherType),
            description:'Lista dos climas das cidades',
            resolve: () => weathers
        }
    })
})

//create a shema
const schema = new GraphQLSchema({
    query: RootQueryType,
})

app.use(express.json());
app.use(cors());

//graphiql
app.use('/graphql', graphqlHTTP ({
    schema: schema,
    graphiql:true
}))

//route to get weather data
app.get('/weather', (req, res) => {
    cities.forEach(city => {
        weatherData(city, (error, {cityName, temperature, description}) => {
        if(error){
            return res.send({error})
        }
        temperature = (temperature-273.15).toFixed(1);
        let newCity = {cityName, temperature, description};
        weathers.push(newCity);
        });
    });
    setTimeout(function (){
        res.send(weathers)
        console.log(weathers)
    }, 3000);
    
})

//cronjob to get weather data
app.listen(3000, () => {
  cronJob.schedule('*/30 * * * *',
	function() {
    weathers = [];
		cities.forEach(city => {
      weatherData(city, (error, {cityName, temperature, description}) => {
        if(error){
          return res.send({error})
        }
        temperature = (temperature-273.15).toFixed(1);
        let newCity = {cityName, temperature, description};
        weathers.push(newCity);
      });
    });
	},
	null,
	true,
	'Europe/Lisbon'
  )
})
//app.listen(3000);