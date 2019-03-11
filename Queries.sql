/*Select All from both ranges*/

SELECT S.SteamID, S.lastlogoff as "RangeStart",E.lastlogoff as "RangeEnd", (E.lastlogoff - S.lastlogoff) as "Interval",S.LocCityID
FROM StartRange S
INNER JOIN EndRange E
ON S.SteamID = E.SteamID
WHERE S.lastlogoff != E.lastlogoff
GROUP BY (E.lastlogoff - S.lastlogoff) DESC

/* Everyone who was loged in while we collected the forecast data */
/* data only valid from 3pm-5pm on 3/10 */

SELECT S.SteamID, S.lastlogoff as "RangeStart",E.lastlogoff as "RangeEnd", (E.lastlogoff - S.lastlogoff) as "Interval",S.LocCityID as "City"
FROM StartRange S
INNER JOIN EndRange E
ON S.SteamID = E.SteamID
WHERE S.lastlogoff != E.lastlogoff
AND S.lastlogoff > 1552172400
AND S.PersonaState in (1,5,6)
ORDER BY `Interval` DESC