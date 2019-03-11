import json
import os
import pprint
# import MySQLdb as my

# db = my.connect(
#     host = 'classmysql.engr.oregonstate.edu',
#     user = 'cs440_pugliesn',
#     passwd = '6575',
#     db = 'cs440_pugliesn')

from math import log

def first_digit(num):
    return num // 10 ** (int(log(num, 10)) - 2)

with open("weather_data.json") as json_file:
    json_data = json_file.read().split('}{')

    #print(json_data)

    #print(json_data[1])

    # hax
    for index,item in enumerate(json_data[1:-1]):
        json_data[index+1] = '{' + item + '}'

    # fix the split issue
    json_data[0] = json_data[0] + '}'

    json_data[len(json_data) - 1] = '{' + json_data[len(json_data) - 1]

    counter = 0
    for item in json_data:
        json_obj = json.loads(item)
        good_counter = 0
        for date in json_obj['list']:
            #if date['dt'] > 1552172400:
            print(date['weather'])
            # if the time of the forcast is before we started collecting data for steam users
            if date['dt'] < 1552255200:
                continue

            # open weather map weather ID 8XX all stand for good weather
            if first_digit(date['weather'][0]['id']) == 8:
                good_counter += 1
        
        # calculate percentages
        good = good_counter/len(json_obj['list'])
        bad = 1 - good
        print(json_obj['city']['id'])
        print("percent good: ", good)
        print("percent bad: ", bad)

        print("----------------------------------------------------------------------------------")
        counter += 1