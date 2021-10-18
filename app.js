const express = require('express');
const {graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const nodeCron = require('node-cron');
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

//cronjob to get weather data
app.listen(3000, () => {
    nodeCron.schedule('*/20 * * * * *', () => {
        weathers.length = 0;
        cities.forEach(city => {
            weatherData(city, (error, {cityName, temperature, description}) => {
                if(error){ return res.send({error})}
                temperature = (temperature-273.15).toFixed(1);
                let newCity = {cityName, temperature, description};
                weathers.push(newCity);
                console.log(weathers.length)  
            });
        });
    },
    null,
    true,
    'Europe/Lisbon'
  )
})