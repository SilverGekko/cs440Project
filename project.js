const http = require('http');
const fs = require('fs');

const express = require('express');
var app = express();

const mysql = require('mysql');
const port = 3000;
const path = require('path');
const bodyParser = require("body-parser");
const steam_weather_data = require('./steam_open_weather.json');

function steamID_grab_information(steam_weather_data, steamID) {
    return steam_weather_data[0][steamID];
}

function weatherID_grab_information(steam_weather_data, weatherID) {
    return steam_weather_data[1][weatherID];
}

console.log(steamID_grab_information(steam_weather_data, 46984));
console.log(weatherID_grab_information(steam_weather_data, 4046332));

const STEAM_KEY = "391768357C21EE63635C1EB192023782";
var api_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="
                + STEAM_KEY + "&steamids=";// + "76561198027222452"
var request = require('request');

var pool = mysql.createPool({
	host: "classmysql.engr.oregonstate.edu",
	user: "cs440_pugliesn",
	password: "6575",
	database: "cs440_pugliesn"
});

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// GET METHODS
// the first argument is the name of the action for the form method get
// EXAMPLE:
// <!-- HTML -->
// <form method="get" action="/name_of_action">
// </form>
// JS
// app.get('/name_of_action', function (req, res)
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// POST ACTIONS
// EXAMPLE:
// <!-- HTML -->
// <form method="post" action="/name_of_action">
// </form>
// JS
// app.post('/name_of_action', function (req, res)
// probably
// pool.query(SQL QUERY HERE)
app.post('/addSteamData', function (req, res) {

    var steamID = req.body.steamID;
    var location = req.body.location;

    //api_url + list_of_ids

    var big_id_list = fs.readFileSync("pages1-57.txt").toString().split("\n");

    //console.log(big_id_list.length)

    //http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=391768357C21EE63635C1EB192023782&steamids=76561198027222452,76561197960435530,76561198127751744"

    //api_url += big_id_list.slice(101, 200)
    //console.log(api_url)

    //console.log(api_url)

    for (let i = 0; i < big_id_list.length; i++) {
        //pool.query("INSERT IGNORE INTO SteamUserData (SteamID, LocCityID, LastLogOff) VALUES (\"" + json_obj[i].steamid + "\",\"" + json_obj[i].loccityid.toString() + "\",\"" + json_obj[i].lastlogoff.toString() + "\");", function (error, results, fields) {
        pool.query("INSERT IGNORE INTO SteamUserData (SteamID) VALUES (\"" + big_id_list[i] + "\");", function (error, results, fields) {
            if (error) throw error;
        });
    }

    // request.get(api_url, function(error, steamHttpResponse, steamHttpBody) {

    //     json_obj = JSON.parse(steamHttpBody).response.players
    //     for (let i = 0; i < json_obj.length; i++) {

    //         if (typeof json_obj[i].steamid !== 'undefined' &&
    //             typeof json_obj[i].lastlogoff !== 'undefined' &&
    //             typeof json_obj[i].loccityid !== 'undefined') {
    //             try {

    //                 //console.log("INSERT INTO SteamUserData (SteamID, LocCityID, LastLogOff) VALUES (\"" + json_obj[i].steamid + "\",\"" + json_obj[i].loccityid.toString() + "\",\"" + json_obj[i].lastlogoff.toString() + "\");")

    //                 pool.query("INSERT IGNORE INTO SteamUserData (SteamID, LocCityID, LastLogOff) VALUES (\"" + json_obj[i].steamid + "\",\"" + json_obj[i].loccityid.toString() + "\",\"" + json_obj[i].lastlogoff.toString() + "\");", function (error, results, fields) {
    //                     if (error) throw error;
    //                     });
    //             }
    //             catch (error) {}
                
    //         }

    //         // if (typeof json_obj[i].personaname !== 'undefined') {
    //         //     //console.log(json_obj[i].personaname)
    //         //     console.log("UPDATE SteamUserData" +
    //         //     " SET RealName = \"" + json_obj[i].personaname.toString() + "\"" + 
    //         //     " WHERE SteamID = \"" + json_obj[i].steamid.toString() + "\"")
    //         //     pool.query("UPDATE SteamUserData" +
    //         //                 " SET RealName = \"" + json_obj[i].personaname.toString() + "\"" + 
    //         //                 " WHERE SteamID = \"" + json_obj[i].steamid.toString() + "\"", function (error, results, fields) {
    //         //         if (error) throw error;
    //         //     });
    //         // }
    //     }
    // });
    res.redirect('back');
});

app.listen(port);