/**
 * Created by TrevorSpear on 2/19/19.
 */
const fs = require('fs');
let data = require('./city.list.json');
let steam_data = require('./steam_countries.json');
let steam_weather_data = require('./json_folder/steam_open_weather.json');

//let word = data[0];
//console.log(word);

let steamID_with_open_weather = {};
let open_weather_with_steamID = {};
let both_json = {};
let steam_json = {};

function steamID_grab_information(steam_weather_data, steamID) {
    return steam_weather_data[0][steamID];
}

function weatherID_grab_information(steam_weather_data, weatherID) {
    return steam_weather_data[1][weatherID];
}

console.log(steamID_grab_information(steam_weather_data, 46984));
console.log(weatherID_grab_information(steam_weather_data, 4046332));


// let i, j;
// let number_of_us_cities = 0;
// for (j in steam_data["US"]["states"][0]) {
//     console.log(j);
//     console.log(steam_data["US"]["states"][0][j].name);
//     for (i in steam_data["US"]["states"][0][j]["cities"]) {
//         steam_json[i] = steam_data["US"]["states"][0][j]["cities"][i];
//         steam_json[i].steamID = i;
//         steam_json[i].state = steam_data["US"]["states"][0][j].name;
//         steam_json[i].city = steam_json[i].name;
//         delete steam_json[i].name;
//         number_of_us_cities++;
//     }
// }
// console.log("Steam US cities = " + number_of_us_cities);
//
//
// let open_weather_json = {};
// number_of_us_cities = 0;
// for (i = 0; i < data.length; i++) {
//     if (data[i].country === "US"){ //&& open_weather_json[data[i].name] == undefined) {
//         //console.log(data[i]);
//         open_weather_json[data[i].id] = data[i];
//         open_weather_json[data[i].id].openweatherID = data[i].id;
//         open_weather_json[data[i].id].city = data[i].name;
//         delete open_weather_json[data[i].id].country;
//         delete open_weather_json[data[i].id].name;
//         delete open_weather_json[data[i].id].id;
//         number_of_us_cities++;
//     }
// }
// console.log("Open Weather cities = " + number_of_us_cities);
//
// //Steam matching open_weather
// //Go through each steam city and see
// let matching, lat_lon;
// for (i in steam_json){
//     matching = [];
//     //if there is a matching open weather city with the same name
//     for (j in open_weather_json){
//         //console.log(open_weather_json[j]["coord"]);
//         if (steam_json[i].city == open_weather_json[j].city) {
//             // matching.push(j);
//             // console.log(j);
//             // console.log("UGG");
//             lat_lon = steam_json[i].coordinates.split(',');
//             if (parseInt(lat_lon[0]) == parseInt(open_weather_json[j]["coord"].lat)
//                 && parseInt(lat_lon[1]) == parseInt(open_weather_json[j]["coord"].lon)) {
//
//                 steamID_with_open_weather[i] = steam_json[i];
//                 steamID_with_open_weather[i].openweatherID = open_weather_json[j].openweatherID;
//                 steamID_with_open_weather[i].coord = open_weather_json[j].coord;
//
//                 open_weather_with_steamID[j] = open_weather_json[j];
//                 open_weather_with_steamID[j] = steam_json[i];
//             }
//         }
//     }
//
//     // console.log(steamID_with_open_weather);
//     // console.log(open_weather_with_steamID);
//
//
//     both_json[0] = steamID_with_open_weather;
//     both_json[1] = open_weather_with_steamID;
//
//     // lat_lon = steam_json[i].coordinates.split(',');
//     // // console.log(parseInt(lat_lon[0]));
//     // // console.log(parseInt(lat_lon[1]));
//     // //console.log((open_weather_json[0]["coord"].lat));
//     // let num;
//     // for (num in matching) {
//     //     console.log(num);
//     //     console.log(open_weather_json["" + num]);
//     //     // if (parseInt(lat_lon[0]) == parseInt(open_weather_json[num]["coord"].lat)
//     //     //     && parseInt(lat_lon[1]) == parseInt(open_weather_json[num]["coord"].lon)) {
//     //     //     console.log("MATCH");
//     //     //     console.log(steam_json[i]);
//     //     //     console.log(open_weather_json[num]);
//     //     // }
//     // }
//     //console.log(matching)
// }
//
// //"coordinates": "31.223231,-85.390489"
// //"lon": -85.390488,"lat": 31.22323
//
//
// // //Open_weather matching steam
// //
// //
// // steam_then_open_weather[0] = steam_json;
// // steam_then_open_weather[1] = open_weather_json;
// //
// fs.writeFile('./json_folder/steam_open_weather.json', JSON.stringify(both_json, null, "\t"), function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a open weather file, just check it');
// });
//
//
// fs.writeFile('./json_folder/1.json', JSON.stringify(both_json, null, "\t"), function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a open weather file, just check it');
// });
//
// fs.writeFile('./json_folder/2.json', JSON.stringify(both_json, null, "\t"), function (err) {
//     if (err)
//         return console.log(err);
//     console.log('Wrote all cities in a steam file, just check it');
// });

