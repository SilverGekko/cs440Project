/**
 * Created by TrevorSpear on 2/19/19.
 */
const fs = require('fs');
let data = require('./city.list.json');
let steam_data = require('./steam_countries.json');
//let word = data[0];
//console.log(word);

let steam_then_open_weather = {};

let steam_json = {};

let i, j;
let number_of_us_cities = 0;
for (j in steam_data["US"]["states"][0]) {
    console.log(j);
    console.log(steam_data["US"]["states"][0][j].name);
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


let open_weather_json = {};
number_of_us_cities = 0;
for (i = 0; i < data.length; i++) {
    if (data[i].country === "US"){ //&& open_weather_json[data[i].name] == undefined) {
        //console.log(data[i]);
        open_weather_json[data[i].id] = data[i];
        open_weather_json[data[i].id].openweatherID = data[i].id;
        open_weather_json[data[i].id].city = data[i].name;
        delete open_weather_json[data[i].id].country;
        delete open_weather_json[data[i].id].name;
        delete open_weather_json[data[i].id].id;
        number_of_us_cities++;
    }
}
console.log("Open Weather cities = " + number_of_us_cities);

// //Steam matching open_weather
// for (i in steam_json){
//     steam_json[i]
// }
//
// //Open_weather matching steam
//
//
// steam_then_open_weather[0] = steam_json;
// steam_then_open_weather[1] = open_weather_json;
//
// fs.writeFile('json_folder/steam_then_open_weather.json', JSON.stringify(steam_then_open_weather, null, "\t"), function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a open weather file, just check it');
// });


fs.writeFile('json_folder/open_weather_cities.json', JSON.stringify(open_weather_json, null, "\t"), function (err) {
    if (err)
        return console.log(err);
    console.log('Wrote all cities in a open weather file, just check it');
});

fs.writeFile('json_folder/steam_cities.json', JSON.stringify(steam_json, null, "\t"), function (err) {
    if (err)
        return console.log(err);
    console.log('Wrote all cities in a steam file, just check it');
});

