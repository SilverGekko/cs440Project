const http = require('http')
const fs = require('fs')

const express = require('express')
var app = express()

const syncmysql = require('sync-mysql')
const mysql = require('mysql')
const port = 57777
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

var pool2 = new syncmysql({
	host: "45.79.77.63",
	user: "cs440",
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

app.get('/loc/:hour', function (req, res) {

    var top = req.body.top;
    var bottom = req.body.bottom;
    var fn = req.body.fn;

    console.log(top)
    console.log(bottom)

    var big_id_list = fs.readFileSync(__dirname + "/StartRange.txt").toString().split("\n")

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

		try {
            if (typeof result[j].loccityid !== 'undefined' && typeof result[j].steamid !== 'undefined') {
            	console.log(result[j].steamid )
            	console.log(result[j].loccityid )
                var query = "INSERT INTO Hour" + req.params.hour + "_0 (SteamID, LocCityID, lastlogoff, PersonaState) VALUES (\"" + result[j].steamid + "\"," + result[j].loccityid + ", " + result[j].lastlogoff + ", " + result[j].personastate + ") ON DUPLICATE KEY UPDATE SteamID = SteamID;"
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

                //stop when we get to the place we stopped before
                //if (result[j].steamid == '76561198001555939'){
                //   process.exit(0)
                //}
            	}
			}
			catch (e) {
				continue
        	}
		}

    }
    res.redirect('back');
});

app.get('/results', function (req, res) {

    for (let i = 19; i < 22; i++) {

        top_range = 1552348800
        bot_range = 1552348800 - 10800

        if(i % 3 == 0 ) {
            bot_range += 10800
            top_range += 10800
        }

        var query = 
        `SELECT S.SteamID, S.LocCityID, WSJ.OpenWeatherCode, WDTS.Lat, WDTS.Lon, WDTS.WeatherID ` +
        `FROM Hour${i}_0 S ` + 
        `INNER JOIN Hour${i + 1}_0 E ON S.SteamID = E.SteamID ` +
        `INNER JOIN WeatherSteamJoin WSJ ON WSJ.SteamCode = S.LocCityID ` +
        `LEFT JOIN (SELECT * FROM WeatherDataByTimeStamp ` +
        `WHERE TimeStamp >= ${bot_range} ` +
        `AND TimeStamp <= ${top_range}) AS WDTS ON WDTS.CityCode = WSJ.OpenWeatherCode ` +
        `WHERE S.PersonaState IN (1,5,6)` +
        `AND E.PersonaState IN (0,2,3,4); `

        //console.log(query)
        console.log("Printing query:\n")
        console.log(query)
        result = pool.query(query)
        //console.log(result)

        // var file = fs.createWriteStream(`logon_good_${i}.txt`)
        //console.log(typeof result[0].toString())
        //console.log(JSON.stringify(result[0]))
        //file.on('error', function(err) { console.log(err) });

        var all_results = "[\n"
        for (let item = 0; item < result.length - 2; item++) {
            //console.log(JSON.stringify(result[item]))
            all_results = all_results + JSON.stringify(result[item]) + ',' + '\n'
        }
            all_results = all_results + JSON.stringify(result[result.length - 2]) + '\n' + "]"
        // fs.writeFile(`logon_good_${i}.txt`, result, (err) => {
        //     if (err) throw err;
        //     console.log("file written " + `logon_good_${i}.txt`)
        // });
        // file.write(JSON.stringify(all_results))
        // file.end()

        console.log("finished iteration" + String(i))

        fs.writeFileSync(`logon_good_${i}.txt`, all_results)
    }

    res.redirect('back');
});

app.post('/weather', function (req, res) {
    var json_data = fs.readFileSync(__dirname + "/mar11.json").toString().split("}{")

    for (let i = 1; i < json_data.length - 1; i++) {
        json_data[i] = '{' + json_data[i] + '}'
    }

    json_data[0] = json_data[0] + '}'

    json_data[json_data.length - 1] = '{' + json_data[json_data.length - 1]

    //console.log(json_data)

    counter = 0

    //for each item in json_data
    for (let i = 0; i < json_data.length; i++) {
        try {
        json_obj = JSON.parse(json_data[i])
        }
        catch (err) {
            console.log("error caught: "+ json_data[i])
        }
        let good_counter = 0
        // for each time stamp in the weather data list
        for (let j = 0; j < json_obj.list.length; j++) {
            // get the percentage of good weather vs bad weather

            //if the piece of weather data was before the time we starting recording steam logins, skip to the next one
            if (json_obj.list[j].dt < 1552341600 || json_obj.list[j].dt > 1552428000) {continue}

            //if the weather id starts with 8, its good weather
            if (String(json_obj.list[j].weather[0].id)[0] == '8') {
                good_counter++
            }
            //console.log("length: " + json_obj.list.length)
            good = good_counter / json_obj.list.length
            bad = 1 - good
            console.log(json_obj.city.id)
            console.log("percent good: " + good)
            console.log("percent bad: " + bad)
            console.log(++counter)
            lat = json_obj.city.coord.lat
            lon = json_obj.city.coord.lon

            var query = "INSERT INTO WeatherDataByTimeStamp (CityCode, WeatherID, Lat, Lon, TimeStamp) VALUES (" + json_obj.city.id + "," + json_obj.list[j].weather[0].id + "," + lat + "," + lon +"," + json_obj.list[j].dt + ") ON DUPLICATE KEY UPDATE CityCode = CityCode;"
            // var query = "INSERT INTO WeatherData (CityCode, PercentGood, Lat, Lon) VALUES (" + json_obj.city.id + "," + good + "," + lat + ","+ lon +") ON DUPLICATE KEY UPDATE CityCode = CityCode;"
            pool.query(query)
        }

    }
    res.redirect('back');
});

app.post('/translate', function (req, res) {
    var json_data = fs.readFileSync(__dirname + "/convert_city_codes/json_folder/" + "steam_open_weather.json").toString()

    var json_obj = JSON.parse(json_data)['0']

    //console.log(json_obj)

    var steam_city_codes = Object.keys(json_obj)

    console.log(steam_city_codes)

    //console.log(json_obj)

    //var open_weather_codes = []

    for (let i = 0; i < steam_city_codes.length; i++) {
        var query = "INSERT INTO WeatherSteamJoin (SteamCode, OpenWeatherCode) VALUES (" + steam_city_codes[i] + "," + json_obj[steam_city_codes[i]].openweatherID + ") ON DUPLICATE KEY UPDATE SteamCode = SteamCode;"
        pool.query(query)
        //console.log(i)
    }

    res.redirect('back');
});

app.listen(port)
