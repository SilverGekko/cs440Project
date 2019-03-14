# cs440 Project
## Nicholas Pugliese Alea Weeks, Max Moulds, Trevor Spear
Database username: cs440_pugliesn

Database password: 6575

Data files are in the appropriately named folders for login and logoff for good and bad weather.

## Database schema information:

We collected information about Steam users logging in to play games during a 40 hour period from March 11th at 4pm to March 12th and 2pm. There is a gap in the data at 23:00 on March 11th because the database website was too slow to process the query at that time.

The login information is stored in our database as a series of tables named "HourNUMBER_0" where NUMBER is a number between 0-23, representing hours of 00:00 to 23:00, respectively. Tables Hour14_0 to Hour23_0 are from March 11th, and the rest are from March 12th.

The attributes in these Hour tables are:

- SteamID: the unique ID number per steam account
- LocCityID: the location's city ID that the steam account is present in
- LastLogOff: the unix timestamp of the last time that user went off line. This field is currently not used in the calculation.
- PersonaState: the current state of the steam profile. 0 - Offline, 1 - Online, 2 - Busy, 3 - Away, 4 - Snooze, 5 - looking to trade, 6 - looking to play.

Ideally, we would have stored this all of this information in multiple columns in the same table, but by the time we realized this it was too late to change everything.

The other interesting table is "WeatherDataByTimeStamp":

- CityCode: the OpenWeatherMap city code. This is different than the Steam location code, and will be joined on a intermediate translation table to make the proper connections.
- WeatherID: the ID code for the current weather at that time in that city. 800+ is clear skies, and everythign else is considered "bad weather" for our purposes.
- Lat: the lattitude of the location. This is used to map the data with ArcGIS.
- Lon: the longitude of the location. This is used to map the data with ArcGIS.
- TimeStamp: the unix time of the forcasted weather event.

The table "SteamWeatherJoin" contains the translation information that links steam city codes to open waether map codes.

Please refer to the project report for an example of a query we ran to generate the result files. Result files can be seen in the folders:

logon_good

login_bad

logoff_good

logoff_bad

We neglected to store the unix time stamp for each of the hourly ranges, so that is why we have to manually input the unix time stamps for the weather data in the main query. We automated this with the nodeJS server to allow us to hit one button to start pulling data for a specific range of unix time stamps.
