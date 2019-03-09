import datetime
import json
import urllib.request
import sys, os

def time_converter(time):
    converted_time = datetime.datetime.fromtimestamp(
        int(time)
    ).strftime('%I:%M %p')
    return converted_time

def bulk_weather_url_builder(city_id):
    user_api = 'a8f12376e359829fba302f631819a54f'
    # http://history.openweathermap.org/data/2.5/history/city?id={id}&type=hour&start={start}&end={end}
    # https://samples.openweathermap.org/data/2.5/history/city?id=2885679&type=hour&appid=b1b15e88fa797225412429c1c50c122a1
    start_time = '1520294400' #march 6th at 12:00:00 am
    end_time = '1520380800' #March 7th at 12:00:00 am
    unit = 'metric'  # For Fahrenheit use imperial, for Celsius use metric, and the default is Kelvin.
    api = 'http://history.openweathermap.org/data/2.5/history/city?id='     # Search for your city ID here: http://bulk.openweathermap.org/sample/city.list.json.gz
    full_api_url = api + str(city_id) + '&mode=json&units=' + unit + '&appid=' + user_api + '&type=hour' + '&start=' + start_time + '&end=' + end_time
    print(full_api_url)
    return full_api_url

def forecast_url_builder(city_id):
    # api.openweathermap.org/data/2.5/forecast?id={city ID}
    user_api = 'a8f12376e359829fba302f631819a54f'  # Obtain yours form: http://openweathermap.org/
    unit = 'metric'  # For Fahrenheit use imperial, for Celsius use metric, and the default is Kelvin.
    api = 'http://api.openweathermap.org/data/2.5/forecast?id='    # Search for your city ID here: http://bulk.openweathermap.org/sample/city.list.json.gz
    full_api_url = api + str(city_id) + '&mode=json&units=' + unit + '&APPID=' + user_api
    return full_api_url

def url_builder(city_id):
    user_api = 'a8f12376e359829fba302f631819a54f'  # Obtain yours form: http://openweathermap.org/
    unit = 'metric'  # For Fahrenheit use imperial, for Celsius use metric, and the default is Kelvin.
    api = 'http://api.openweathermap.org/data/2.5/weather?id='     # Search for your city ID here: http://bulk.openweathermap.org/sample/city.list.json.gz
    full_api_url = api + str(city_id) + '&mode=json&units=' + unit + '&APPID=' + user_api
    return full_api_url

def data_fetch(full_api_url):
    url = urllib.request.urlopen(full_api_url)
    output = url.read().decode('utf-8')
    raw_api_dict = json.loads(output)
    print(raw_api_dict)
    url.close()
    with open('weather_data.json', 'a') as fp:
        json.dump(raw_api_dict, fp, sort_keys=True)
    return raw_api_dict

def data_organizer(raw_api_dict):
    data = dict(
        city=raw_api_dict.get('name'),
        country=raw_api_dict.get('sys').get('country'),
        temp=raw_api_dict.get('main').get('temp'),
        temp_max=raw_api_dict.get('main').get('temp_max'),
        temp_min=raw_api_dict.get('main').get('temp_min'),
        humidity=raw_api_dict.get('main').get('humidity'),
        pressure=raw_api_dict.get('main').get('pressure'),
        sky=raw_api_dict['weather'][0]['main'],
        sunrise=time_converter(raw_api_dict.get('sys').get('sunrise')),
        sunset=time_converter(raw_api_dict.get('sys').get('sunset')),
        wind=raw_api_dict.get('wind').get('speed'),
        wind_deg=raw_api_dict.get('deg'),
        dt=time_converter(raw_api_dict.get('dt')),
        cloudiness=raw_api_dict.get('clouds').get('all')
    )
    return data

def data_output(data):
    m_symbol = '\xb0' + 'C'
    print('---------------------------------------')
    print('Current weather in: {}:'.format(data['city']))
    print(data['temp'], m_symbol, data['sky'])
    print('Max: {}, Min: {}'.format(data['temp_max'], data['temp_min']))
    print('')
    print('Wind Speed: {}, Degree: {}'.format(data['wind'], data['wind_deg']))
    print('Humidity: {}'.format(data['humidity']))
    print('Cloud: {}'.format(data['cloudiness']))
    print('Pressure: {}'.format(data['pressure']))
    print('Sunrise at: {}'.format(data['sunrise']))
    print('Sunset at: {}'.format(data['sunset']))
    print('')
    print('Last update from the server: {}'.format(data['dt']))
    print('---------------------------------------')

if __name__ == '__main__':
    city_id_file = open("array_openweatherids.txt", "r")
    city_ids = city_id_file.read().split(',')
    for index, id in enumerate(city_ids):
        city_ids[index] = id.strip('\n\t')
        data_fetch(forecast_url_builder(city_ids[index]))
            # print(city_ids[index])
            # data_output(data_organizer(data_fetch(forecast_url_builder(city_ids[index]))))
