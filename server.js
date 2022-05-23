const json = require('body-parser/lib/types/json');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const querystring = require('querystring');
const baseURl = 'https://api.brightsky.dev/weather';
const app = express();

// [HTTP] GET 
// eg: party_plan?from=2020-10-01&to=2020-10-06&locations=esens&locations=berlin  

app.get('/party_plan', async (req, res) => {

    // getting query params
    const fromDate = req.query.from;
    const toDate = req.query.to;
    const locations = req.query.locations;

    // fetching geoLocations
    const cities = JSON.parse(fs.readFileSync('cities.json', 'utf8'))   
    // getting a list of dates from the date range 
    const datesToCheck = getDateList(new Date(fromDate), new Date(toDate)); 

    let PerfectCitiesForPicnic = [];   
    let cityGeolocations = findGeoLocations(locations, cities);   

    PerfectCitiesForPicnic = await GetPerfectDate(datesToCheck, cityGeolocations);

    //enable cors
    res.set('Access-Control-Allow-Origin', '*');

    setTimeout(() => {
        if(PerfectCitiesForPicnic.length > 1){           
            const result = PerfectCitiesForPicnic.sort((a,b) => {
                return b.weather.sunshine - a.weather.sunshine})
            res.send(result[0])            
        } else if
        (PerfectCitiesForPicnic.length == 0){
            res.send({NotDatesFound:"Due to bad weather no dates are available to go", PerfectCitiesForPicnic})
        }
        else {
            res.send(PerfectCitiesForPicnic)
        }

    }, 3000);
})

async function getWeather(lat, lon, date, city) {
    const URL = `${baseURl}?lat=${lat}&lon=${lon}&date=${date}`
    const data = await fetch(URL).then(res => res.json()).then(json => {
        return json;
    });  

    //filter the response by the given conditions
    if(data.weather[12].wind_speed < 30 && data.weather[12].temperature > 20 && data.weather[12].temperature < 30){
        let picnicDate = {
            city: city.name,
            date: date,
            weather: data.weather[12]
        };                     
        return  picnicDate;
    }  else {
        return null; 
    } 
}

async function GetPerfectDate(dates, geolocations) {
    let goodCities = [];
    dates.forEach(async date => {
        geolocations.forEach(async city=>{
           let climate = await getWeather(city.lat, city.lon, date.toISOString(), city);
           if (climate){
             goodCities.push(climate); 
           }
        })
    })    
    return goodCities; 
}

function getDateList(from, to) {
    const dateList = [];
    let startDate = from;
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate()+ days)
        return date;
    }
    while (startDate <= to) {
        dateList.push(startDate)
        startDate = addDays.call(startDate, 1)
    }
    return dateList;
}

function findGeoLocations(locations, cities) {
    let citylist = [];
    if (typeof locations == 'object') {
        for (let i = 0; i < locations.length; i++) {
            for (let Y = 0; Y < cities.length; Y++) {
                if(cities[Y].name.toLowerCase() == locations[i].toLowerCase()) {
                    citylist.push(cities[Y])
                    continue;
                }    
            }
        }
    } else {
        for (let Y = 0; Y < cities.length; Y++) {
            if(cities[Y].name.toLowerCase() == locations.toLowerCase()) {
                citylist.push(cities[Y])
                continue;
            }    
        }
    }
    return citylist;
}

const port = process.env.PORT || 3001;

app.listen(port)
