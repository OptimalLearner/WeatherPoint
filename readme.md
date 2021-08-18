# WeatherPoint - A Weather App
**WeatherPoint** is a web application that provides the weather forecast information based on location. Weather is an integral part of our life from aviation, farming, tourism to sports. Weather apps are useful for providing the weather data to the users.

The user needs to select the location from the datalist and the app displays the current weather data, time of sunrise and sunset and air quality of the selected location. It also displays the hourly weather data up-to 4 hours and daily weather forecast up-to 4 days from present day. A map is integrated to show the exact position of the selected location. User also gets an option to compare time zones of different location.

I have used Leaflet JS to embed interactive map to the application. Moment JS was used to parse, validate and manipulate Date and Time in JS. Working with Dates in JavaScript is a little bit complex so I've used a library like Moment JS for working with Dates. As OpenWeatherMap API provides dates in Unix time format, Moment JS is useful for parsing those dates to UTC time format and even useful for converting time to different time zones. Bootstrap framework is used which makes the app completely responsive and works good with Desktops, Laptops, Tablets and Mobile Devices.

**Tech Stack Used:** HTML 5, CSS, JavaScript, Bootstrap 5, Leaflet.js, Moment.js  
**APIs Used:** OpenWeatherMap API ( for getting weather information ), ArcGIS REST API ( for reverse geocoding to determine the address of particular co-ordinates )  
**Vector illustrations** used in the project are taken from [undraw.co](https://undraw.co/)

## Steps to run the app locally
> Assuming you already have Git and NPM installed on your system and know how to use command prompt/terminal.
* Open command prompt (or terminal) and change the current working directory to location where you want to clone the repository.
* Then type: *git clone https://github.com/OptimalLearner/WeatherPoint.git*
* If the clone was successfully completed then a new sub directory may appear with the same name as the repository.
* Now change the currently directory to the new sub directory.
* Create a file named `config.js` in js sub directory and add your OpenWeatherMap API Key and ArcGIS Rest API Key.
* Install http server using this command: *npm install --global http-server* (This step can be skipped if you already have http-server installed)
* Then simply return to main directory and run the http-server using this command: *http-server -p 5500*
* Now you can access the app on http://localhost:5500/
