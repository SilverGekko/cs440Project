/**
 * Created by TrevorSpear on 2/19/19.
 */
const fs = require('fs');
let open_weather_data = require('./city.list.json');
let steam_data = require('./steam_countries.json');
let steam_weather_data = require('./json_folder/steam_open_weather.json');

//let word = open_weather_data[0];
//console.log(word);

let steamID_with_open_weather = {};
let open_weather_with_steamID = {};
let both_json = {};
let steam_json = {};
let open_weather_json = {};

function steamID_grab_information(steam_weather_data, steamID) {
    return steam_weather_data[0][steamID];
}

function weatherID_grab_information(steam_weather_data, weatherID) {
    return steam_weather_data[1][weatherID];
}

console.log(steamID_grab_information(steam_weather_data, 46984));
console.log(weatherID_grab_information(steam_weather_data, 4046332));

function steam_cities_formatting(steam_data, steam_json) {
    let i, j;
    let number_of_us_cities = 0;
    for (j in steam_data["US"]["states"][0]) {
        // console.log(j);
        // console.log(steam_data["US"]["states"][0][j].name);
        for (i in steam_data["US"]["states"][0][j]["cities"]) {
            steam_json[i] = steam_data["US"]["states"][0][j]["cities"][i];
            steam_json[i].steamID = i;
            steam_json[i].state = steam_data["US"]["states"][0][j].name;
            steam_json[i].city = steam_json[i].name;
            delete steam_json[i].name;
            number_of_us_cities++;
        }
    }
    console.log("Steam US cities = " + number_of_us_cities);
    return steam_json;
}


function open_weather_cities_formatting(open_weather_data, open_weather_json) {
    let i;
    let number_of_us_cities = 0;
    for (i = 0; i < open_weather_data.length; i++) {
        if (open_weather_data[i].country === "US") { //&& open_weather_json[open_weather_data[i].name] == undefined) {
            //console.log(open_weather_data[i]);
            open_weather_json[open_weather_data[i].id] = open_weather_data[i];
            open_weather_json[open_weather_data[i].id].openweatherID = open_weather_data[i].id;
            open_weather_json[open_weather_data[i].id].city = open_weather_data[i].name;
            delete open_weather_json[open_weather_data[i].id].country;
            delete open_weather_json[open_weather_data[i].id].name;
            delete open_weather_json[open_weather_data[i].id].id;
            number_of_us_cities++;
        }
    }
    console.log("Open Weather cities = " + number_of_us_cities);
    return open_weather_json;
}

function matching_cities(open_weather_data, open_weather_json) {
    //Steam matching open_weather
    //Go through each steam city and see
    let array_open_weather_id = [];
    let matching, lat_lon;
    let number_of_us_cities = 0;
    for (i in steam_json) {
        matching = [];
        //if there is a matching open weather city with the same name
        for (j in open_weather_json) {
            //console.log(open_weather_json[j]["coord"]);
            if (steam_json[i].city == open_weather_json[j].city) {
                // matching.push(j);
                // console.log(j);
                // console.log("UGG");
                lat_lon = steam_json[i].coordinates.split(',');
                if (parseInt(lat_lon[0]) == parseInt(open_weather_json[j]["coord"].lat)
                    && parseInt(lat_lon[1]) == parseInt(open_weather_json[j]["coord"].lon)) {

                    // steamID_with_open_weather[i] = steam_json[i];
                    // steamID_with_open_weather[i].openweatherID = open_weather_json[j].openweatherID;
                    // steamID_with_open_weather[i].coord = open_weather_json[j].coord;
                    //
                    // open_weather_with_steamID[j] = open_weather_json[j];
                    // open_weather_with_steamID[j] = steam_json[i];
                    array_open_weather_id.push(open_weather_json[j].openweatherID);
                    number_of_us_cities++;
                }
            }
        }
    }
    console.log("Total matching cities = " + number_of_us_cities);
    return array_open_weather_id;
}

steam_json = steam_cities_formatting(steam_data, steam_json);
open_weather_json = open_weather_cities_formatting(open_weather_data, open_weather_json);
let array_open_weather_id = matching_cities(open_weather_data, open_weather_json);

// //Open_weather matching steam
// steam_then_open_weather[0] = steam_json;
// steam_then_open_weather[1] = open_weather_json;
array_open_weather_id.sort(function(a, b){return a - b});

fs.writeFile('json_folder/array_openweatherids.json', JSON.stringify(array_open_weather_id, null, "\t"), { flag: 'w' }, function (err) {
    if (err)
        return console.log(err);
    console.log('Wrote all cities in a open weather file, just check it');
});


// fs.writeFile('./json_folder/1.json', JSON.stringify(both_json, null, "\t"), { flag: 'wx' }, function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a open weather file, just check it');
// });
//
// fs.writeFile('./json_folder/2.json', JSON.stringify(both_json, null, "\t"), { flag: 'wx' }, function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a steam file, just check it');
// });

