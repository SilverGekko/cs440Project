const http = require('http')
const fs = require('fs')

const express = require('express')
var app = express()

const syncmysql = require('sync-mysql')
const port = 57789
const path = require('path')
const bodyParser = require("body-parser")

const STEAM_KEY = "391768357C21EE63635C1EB192023782"
var api_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="
                + STEAM_KEY + "&steamids="// + "76561198027222452"
var request = require('request')
var rp = require('request-promise')
var sync = require('sync-request')
//const sleep = require('sleep')

//var pool = mysql.createPool({
var pool = new syncmysql({
	host: "classmysql.engr.oregonstate.edu",
	user: "cs440_pugliesn",
	password: "6575",
	database: "cs440_pugliesn"
});
//var syncSql = require('sync-sql');
//var options = {
//	host: "classmysql.engr.oregonstate.edu",
//	user: "cs440_pugliesn",
//	password: "6575",
//	database: "cs440_pugliesn",
//	port: '1433'
//}

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
    res.sendFile(path.join(__dirname + "/index.html"))
    // var result = sync('GET', api_url + "76561198027222452").body.toString()
    // console.log(result)
    // var result = sync('GET', api_url + "76561198127751744").body.toString()
    // console.log(result)
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
app.post('/populate', function (req, res) {

    var fn = req.body.filename;

    console.log(fn)

    //api_url + list_of_ids

    var filename_list = fs.readFileSync(__dirname + "/file_indexes/file_" + fn).toString().split("\n")

    console.log(filename_list)

    for (let file_idx = 0; file_idx < filename_list.length; file_idx++) {

        if (filename_list[file_idx] == '') {continue}

        var big_id_list = fs.readFileSync(__dirname + "/file_indexes/" + filename_list[file_idx]).toString().split("\n")
        
        for (let i = 0; i < big_id_list.length; i++) {
            //pool.query("INSERT IGNORE INTO SteamUserData (SteamID, LocCityID, LastLogOff) VALUES (\"" + json_obj[i].steamid + "\",\"" + json_obj[i].loccityid.toString() + "\",\"" + json_obj[i].lastlogoff.toString() + "\");", function (error, results, fields) {
            pool.query("INSERT IGNORE INTO SteamUserData (SteamID) VALUES (\"" + big_id_list[i] + "\");", function (error, results, fields) {
                if (error) throw error;
            });
            //global.gc();
        }
    }
    res.redirect('back');
});

app.post('/loc', function (req, res) {

    var top = req.body.top;
    var bottom = req.body.bottom;
    var fn = req.body.fn;

    console.log(top)
    console.log(bottom)

    var big_id_list = fs.readFileSync(__dirname + "/file_indexes/" + fn).toString().split("\n")

    console.log(big_id_list.length)
    
    for (let i = 0; i < big_id_list.length; i+=100) {
        var api_link = api_url
        for (let j = i; j < i+100; j++) {
            //console.log(big_id_list[j])
            api_link += big_id_list[j] + ','
        }
        //console.log(api_link)
        try {

        var result = JSON.parse(sync('GET', api_link).body.toString()).response.players
        }
        catch (e) {
            continue
        }
        //console.log("result", result)

        for (let j = 0; j < 100; j++) {
            console.log("iteration: ", j)
            console.log(result[j].steamid )
            console.log(result[j].loccityid )
            if (typeof result[j].loccityid !== 'undefined' && typeof result[j].steamid !== 'undefined') {
                var query = "INSERT INTO SteamUserData (SteamID, LocCityID, lastlogoff, PersonaState) VALUES (\"" + result[j].steamid + "\"," + result[j].loccityid + ", " + result[j].lastlogoff + ", " + result[j].personastate + ") ON DUPLICATE KEY UPDATE SteamID = SteamID;"
            //pool.query("INSERT IGNORE INTO SteamUserData (SteamID, LocCityID, LastLogOff) VALUES (\"" + json_obj[i].steamid + "\",\"" + json_obj[i].loccityid.toString() + "\",\"" + json_obj[i].lastlogoff.toString() + "\");", function (error, results, fields) {
                //console.log("before query")
                //console.log(typeof query)
                pool.query(query)
                // pool.query(query, function (error, results, fields) {
                        //console.log("query: \n", query)
                        //console.log(results);
                        //console.log(fields);
                        //if (error) throw error;
                //});
            }
        }
        
    }
    res.redirect('back');
});

app.listen(port)
