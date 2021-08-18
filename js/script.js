// Variables accessible in all scopes
let refresh = 1000;
let latitude, longitude;
let mymap;
let marker;
// DOM Selectors
let loaderPage = document.querySelector(".loader-content");
let contentPage = document.querySelector(".main-content");
let navbarCollapse = document.querySelector(".navbar-collapse");
let feedbackName = document.querySelector("#name");
let feedbackEmail = document.querySelector("#email");
let feedbackMessage = document.querySelector("#message");
let feedbackButton = document.querySelector(".feedback-btn");
let enteredLocation = document.querySelector("#entered-location");
let locationOptionList = document.querySelector("#locationOption");
let temperature = document.querySelector(".temp");
let temperatureIcon = document.querySelector(".current-weather-icon");
let temperatureTime = document.querySelector(".temp-time");
let temperatureCity = document.querySelector(".temp-city");
let temperatureText = document.querySelector(".temp-desc");
let humidity = document.querySelector(".humidity");
let windSpeed = document.querySelector(".wind-speed");
let pressure = document.querySelector(".pressure");
let visibility = document.querySelector(".visibility");
let feelsLike = document.querySelector(".feels-like");
let windGust = document.querySelector(".wind-gust");
let AQIValue = document.querySelector(".aqi-value");
let AQIText = document.querySelector(".aqi-text");
let AQIDesc = document.querySelector(".aqi-description");
let sunRiseTime = document.querySelector(".sun-rise-time");
let sunSetTime = document.querySelector(".sun-set-time");
let dayTimeField = document.querySelector(".day-time");
let nightTimeField = document.querySelector(".night-time");
let locationTextBox1 = document.querySelector("#location1");
let timeField1 = document.querySelector("#time1");
let dateField1 = document.querySelector("#date1");
let timeZoneField1 = document.querySelector("#timezone1");
let locationTextBox2 = document.querySelector("#location2");
let timeField2 = document.querySelector("#time2");
let dateField2 = document.querySelector("#date2");
let timeZoneField2 = document.querySelector("#timezone2");
let timeZoneOptionList1 = document.querySelector("#timeZoneOptions1");
let timeZoneOptionList2 = document.querySelector("#timeZoneOptions2");
let hourlyForecastTime = document.querySelectorAll(".hourly-forecast .hourly-forecast-time");
let hourlyForecastDate = document.querySelectorAll(".hourly-forecast .hourly-forecast-date");
let hourlyForecastDesc = document.querySelectorAll(".hourly-forecast .hourly-forecast-desc");
let hourlyForecastTemp = document.querySelectorAll(".hourly-forecast .hourly-forecast-temp");
let hourlyForecastIcon = document.querySelectorAll(".hourly-weather-icon");
let hourlyForecastPrecipitation = document.querySelectorAll(".hourly-forecast .hourly-forecast-precipitation");
let hourlyForecastHumidity = document.querySelectorAll(".hourly-forecast .hourly-forecast-humidity");
let hourlyForecastFeelsLike = document.querySelectorAll(".hourly-forecast .hourly-forecast-felt-like");
let dailyForecastDate = document.querySelectorAll(".daily-forecast .daily-forecast-date");
let dailyForecastDay = document.querySelectorAll(".daily-forecast .daily-forecast-day");
let dailyForecastIcon = document.querySelectorAll(".daily-weather-icon");
let dailyForecastDesc = document.querySelectorAll(".daily-forecast .daily-forecast-desc");
let dailyForecastMax = document.querySelectorAll(".daily-forecast .daily-forecast-max");
let dailyForecastMin = document.querySelectorAll(".daily-forecast .daily-forecast-min");
let dailyForecastPrecipitation = document.querySelectorAll(".daily-forecast .daily-forecast-precipitation");
let addLocationForClock = document.querySelector("#clock-add-location");
let addLocationForClockList = document.querySelector("#add-clock-location-list");
let addLocationCard = document.querySelector(".add-new-location-card");
let addClockBtn = document.querySelector(".btn-add-clock");
let cancelClockBtn = document.querySelector(".btn-cancel-clock");
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let worldClock = ["Asia/Kolkata", "Europe/Paris", "America/New_York"];
let worldClockTime = [];
let AQIType = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
let AQIDescription = ["Air quality is considered satisfactory, and air pollution poses little or no risk", "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.", "Members of sensitive groups may experience health effects. The general public is not likely to be affected.", "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects", "Health warnings of emergency conditions. The entire population is more likely to be affected."];

// New Geocoding service created
let geocodeService = L.esri.Geocoding.geocodeService({
    apikey: ArcGIS.API_KEY
});
// Remove loader and add main page onload
window.onload = function() {
    defaultClocks(worldClock);
    addDataListOptions();
    setInterval(function() {
        loaderPage.style.cssText = "display: none !important;";
        contentPage.style.cssText = "display: block;";
    } ,5000);
}
// Close collapsible navbar 
function toggleNav() {
    if(navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.toggle("show");
    }
}
// Clear feedback form fields
feedbackButton.addEventListener("click", function(e) {
    e.preventDefault();
    alert("Sorry for the inconvenience, but currently our application is not connected to any backend module, so your feedback cannot be stored!");
    feedbackName.value = "";
    feedbackEmail.value = "";
    feedbackMessage.value = "";
});
// Show weather status of deafult location if users selectes not to share their actual location
navigator.permissions && navigator.permissions.query({name: 'geolocation'}).then(function(PermissionStatus) {
    if (PermissionStatus.state == 'granted') {
        navigator.geolocation.getCurrentPosition(function(pos) {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            addMap(latitude, longitude);
        });
    } else {
        latitude = 22.5726;
        longitude = 88.3639;
        enteredLocation.value = "Asia/Kolkata";
        addMap(latitude, longitude);
    }
});
// Add map to the web app
function addMap(latitude, longitude) {
    mymap = L.map('mapid').setView([latitude, longitude], 8);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 30,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    setInterval(function () {
        mymap.invalidateSize();
    }, 100);
    // Create new marker
    marker = new L.Marker([latitude, longitude]);
    mymap.addLayer(marker);
    geocodeService.reverse().latlng([latitude, longitude]).run(function (error, result) {
        if (error) {
            return;
        }
        marker.bindPopup(result.address.Match_addr).openPopup();
    });

    const weatherurl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OpenWeather.API_KEY}&units=metric`;
    fetch(weatherurl)
    .then(response => response.json())
    .then(data => {
        let location = enteredLocation.value;
        let city = location.split("/");
        location = city[1];
        if(location.includes("_")) {
            location = location.replaceAll("_", " ");
        }
        let currentTime = moment.unix(data.dt).tz(enteredLocation.value).format();

        temperature.innerHTML = data.main.temp;
        temperatureIcon.setAttribute('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        temperatureTime.innerHTML = formatTime(currentTime)
        temperatureText.innerHTML = data.weather[0].main;
        temperatureCity.innerHTML = location.toUpperCase();
        windSpeed.innerHTML = data.wind.speed;
        humidity.innerHTML = data.main.humidity;
        pressure.innerHTML = data.main.pressure;
        visibility.innerHTML = data.visibility;
        feelsLike.innerHTML = data.main.feels_like;
        windGust.innerHTML = (data.wind.gust) ? data.wind.gust : 0;
       
        let sunriseRes = moment.unix(data.sys.sunrise).tz(enteredLocation.value).format();
        let sunsetRes = moment.unix(data.sys.sunset).tz(enteredLocation.value).format();

        res1 = formatTime(sunriseRes);
        sunRiseTime.innerHTML = res1;
        res2 = formatTime(sunsetRes);
        sunSetTime.innerHTML = res2;
        
        let dayTime = Math.round((parseInt(data.sys.sunset) - parseInt(data.sys.sunrise))/(60*60));
        dayTimeField.innerHTML = dayTime;
        nightTimeField.innerHTML = (24-dayTime);

        const AQIurl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OpenWeather.API_KEY}&units=metric`;
        fetch(AQIurl)
        .then(resp1 => resp1.json())
        .then(AQIdata => { 
            AQIValue.innerHTML = Math.floor(AQIdata.list[0].main.aqi);
            AQIText.innerHTML = AQIType[parseInt(AQIdata.list[0].main.aqi)-1];
            AQIDesc.innerHTML = AQIDescription[parseInt(AQIdata.list[0].main.aqi)-1];
        })
        .catch((error) => {
            alert("AQI API Hit Error: "+error);
        })

        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,daily&appid=${OpenWeather.API_KEY}&units=metric`;
        fetch(url)
        .then(hourlyResp => hourlyResp.json())
        .then(hourly => {
            for(let i=0;i<4;i++) {
                let hourlyResult = moment.unix(hourly.hourly[i].dt).tz(enteredLocation.value).format();
                // Formatting Date
                let date = hourlyResult.substring(0,10);
                let temp_date = date.split("-");
                date = temp_date[2] + " " + months[Number(temp_date[1] - 1)];
                    
                hourlyForecastTime[i].innerHTML = hourlyResult.substring(11,16);
                hourlyForecastDate[i].innerHTML = date;
                hourlyForecastIcon[i].setAttribute('src', `http://openweathermap.org/img/w/${hourly.hourly[i].weather[0].icon}.png`);
                hourlyForecastDesc[i].innerHTML = hourly.hourly[i].weather[0].main;
                hourlyForecastTemp[i].innerHTML = hourly.hourly[i].temp;
                hourlyForecastPrecipitation[i].innerHTML = parseFloat(hourly.hourly[i].pop)*100;
                hourlyForecastHumidity[i].innerHTML = hourly.hourly[i].humidity;
                hourlyForecastFeelsLike[i].innerHTML = hourly.hourly[i].feels_like;
            }
        })

        const dailyUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&appid=${OpenWeather.API_KEY}&units=metric`;
            fetch(dailyUrl)
            .then(dailyResp => dailyResp.json())
            .then(daily => {
                for(let i=0;i<4;i++) {
                    let dailyResult = moment.unix(daily.daily[i].dt).tz(enteredLocation.value).format();
                    let date = dailyResult.substring(0,10);
                    let demoDate = date;
                    let temp_date = date.split("-");
                    date = temp_date[2] + "/" + temp_date[1];
                    let myDate = moment(demoDate, 'YYYY-MM-DD').toDate();

                    dailyForecastDate[i].innerHTML = date;
                    dailyForecastDay[i].innerHTML = weekDays[myDate.getDay()];
                    dailyForecastIcon[i].setAttribute('src', `http://openweathermap.org/img/w/${daily.daily[i].weather[0].icon}.png`);
                    dailyForecastDesc[i].innerHTML = daily.daily[i].weather[0].main;
                    dailyForecastMax[i].innerHTML = daily.daily[i].temp.max;
                    dailyForecastMin[i].innerHTML = daily.daily[i].temp.min;
                    dailyForecastPrecipitation[i].innerHTML = parseFloat(daily.daily[i].pop)*100;
                }
            })
    })
    // Change marker location on map and get name of the location using coordinates
    mymap.on('click', function(e) {
        if(marker!==undefined) {
            mymap.removeLayer(marker)
        }
        marker = new L.Marker(e.latlng);
        mymap.addLayer(marker);
        geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
            if (error) {
              return;
            }
            marker.bindPopup(result.address.Match_addr).openPopup();
        });
        mymap.flyTo(e.latlng, 8);
    });
}
// Add location name to datalist
function addDataListOptions() {
    // Get all zones names supported by moment.js
    let list = moment.tz.names();
    // Add all zone names to datalist options
    list.forEach(function(item, i) {
        let option = document.createElement("option");
        locationOptionList.appendChild(option).setAttribute("value",item);
        option = document.createElement("option");
        timeZoneOptionList1.appendChild(option).setAttribute("value",item);
        option = document.createElement("option");
        timeZoneOptionList2.appendChild(option).setAttribute("value",item);
        option = document.createElement("option");
        addLocationForClockList.appendChild(option).setAttribute("value",item);
    });
}
// Onchange event listeners to first location field
locationTextBox1.addEventListener("change", function(e) {
    let location = locationTextBox1.value;
    let result = getDate_Time_Timezone(location);
    dateField1.value = result.date;
    timeField1.value = result.time;
    timeZoneField1.value = result.timezone;
});
// Onchange event listeners to second location field
locationTextBox2.addEventListener("change", function(e) {
    let location = locationTextBox2.value;
    let result = getDate_Time_Timezone(location);
    dateField2.value = result.date;
    timeField2.value = result.time;
    timeZoneField2.value = result.timezone;
});
// Get Formatted Date and Time in Proper Format
function getDate_Time_Timezone(location) {
    // Convert to another time zone
    let result = moment().tz(location).format();
    // Formatting Date
    let date = result.substring(0,10);
    let temp_date = date.split("-");
    date = temp_date[2] + " " + months[Number(temp_date[1] - 1)] + " " + temp_date[0];
    // Formatting Time
    let time = result.substring(11,16);
    let hours = time.substring(0,2);
    let temp_hours = hours%12 || 12;
    let end = (hours<12 || hours==24) ? "AM" : "PM";
    time = temp_hours + ":" + result.substring(14,16) + " " + end;
    // Formatting Time Zone
    let timezone = result.substring(19,result.length);
    let resultObject = {
        "date": date,
        "time": time,
        "timezone": timezone
    };
    return resultObject;
}
// Find weather information when location field changed
enteredLocation.addEventListener("change", function(e) {
    let location = enteredLocation.value;
    let city = location.split("/");
    if(location.includes("/")) {
        location = city[1];
        if(location.includes("_")) {
            location = location.replaceAll("_", " ");
        }
    }
    const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OpenWeather.API_KEY}&units=metric`;
    fetch(weatherurl)
    .then(response => response.json())
    .then(data => {
        let currentTime = moment.unix(data.dt).tz(enteredLocation.value).format();
        
        temperature.innerHTML = data.main.temp;
        temperatureIcon.setAttribute('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        temperatureTime.innerHTML = formatTime(currentTime);
        temperatureText.innerHTML = data.weather[0].main;
        temperatureCity.innerHTML = location.toUpperCase();
        windSpeed.innerHTML = data.wind.speed;
        humidity.innerHTML = data.main.humidity;
        pressure.innerHTML = data.main.pressure;
        visibility.innerHTML = data.visibility;
        feelsLike.innerHTML = data.main.feels_like;
        windGust.innerHTML = (data.wind.gust) ? data.wind.gust : 0;
        
        let sunriseRes = moment.unix(data.sys.sunrise).tz(enteredLocation.value).format();        
        let sunsetRes = moment.unix(data.sys.sunset).tz(enteredLocation.value).format();

        res1 = formatTime(sunriseRes);
        sunRiseTime.innerHTML = res1;
        res2 = formatTime(sunsetRes);
        sunSetTime.innerHTML = res2;
        
        let dayTime = Math.round((parseInt(data.sys.sunset) - parseInt(data.sys.sunrise))/(60*60));
        dayTimeField.innerHTML = dayTime;
        nightTimeField.innerHTML = (24-dayTime);
        
        const coordinatesURL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OpenWeather.API_KEY}&units=metric`;
        fetch(coordinatesURL)
        .then(resp => resp.json())
        .then(coordinates => {
            let lat = coordinates[0].lat;
            let lon = coordinates[0].lon;

            const AQIurl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OpenWeather.API_KEY}&units=metric`;
            fetch(AQIurl)
            .then(resp1 => resp1.json())
            .then(AQIdata => { 
                AQIValue.innerHTML = Math.floor(AQIdata.list[0].main.aqi);
                AQIText.innerHTML = AQIType[parseInt(AQIdata.list[0].main.aqi)-1];
                AQIDesc.innerHTML = AQIDescription[parseInt(AQIdata.list[0].main.aqi)-1];
            })
            .catch((error) => {
                alert("AQI API Hit Error: "+error);
            })

            const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily&appid=${OpenWeather.API_KEY}&units=metric`;
            fetch(url)
            .then(hourlyResp => hourlyResp.json())
            .then(hourly => {
                for(let i=0;i<4;i++) {
                    let hourlyResult = moment.unix(hourly.hourly[i].dt).tz(enteredLocation.value).format();
                    // Formatting Date
                    let date = hourlyResult.substring(0,10);
                    let temp_date = date.split("-");
                    date = temp_date[2] + " " + months[Number(temp_date[1] - 1)];
                    
                    hourlyForecastTime[i].innerHTML = hourlyResult.substring(11,16);
                    hourlyForecastIcon[i].setAttribute('src', `http://openweathermap.org/img/w/${hourly.hourly[i].weather[0].icon}.png`);
                    hourlyForecastDate[i].innerHTML = date;
                    hourlyForecastDesc[i].innerHTML = hourly.hourly[i].weather[0].main;
                    hourlyForecastTemp[i].innerHTML = hourly.hourly[i].temp;
                    hourlyForecastPrecipitation[i].innerHTML = parseFloat(hourly.hourly[i].pop)*100;
                    hourlyForecastHumidity[i].innerHTML = hourly.hourly[i].humidity;
                    hourlyForecastFeelsLike[i].innerHTML = hourly.hourly[i].feels_like;
                }
            })

            const dailyUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${OpenWeather.API_KEY}&units=metric`;
            fetch(dailyUrl)
            .then(dailyResp => dailyResp.json())
            .then(daily => {
                for(let i=0;i<4;i++) {
                    let dailyResult = moment.unix(daily.daily[i].dt).tz(enteredLocation.value).format();
                    let date = dailyResult.substring(0,10);
                    let demoDate = date;
                    let temp_date = date.split("-");
                    date = temp_date[2] + "/" + temp_date[1];
                    let myDate = moment(demoDate, 'YYYY-MM-DD').toDate();

                    dailyForecastDate[i].innerHTML = date;
                    dailyForecastDay[i].innerHTML = weekDays[myDate.getDay()];
                    dailyForecastIcon[i].setAttribute('src', `http://openweathermap.org/img/w/${daily.daily[i].weather[0].icon}.png`);
                    dailyForecastDesc[i].innerHTML = daily.daily[i].weather[0].main;
                    dailyForecastMax[i].innerHTML = daily.daily[i].temp.max;
                    dailyForecastMin[i].innerHTML = daily.daily[i].temp.min;
                    dailyForecastPrecipitation[i].innerHTML = parseFloat(daily.daily[i].pop)*100;
                }
            })
            // Remove previous markers
            if(marker!==undefined) {
                mymap.removeLayer(marker)
            }
            // Add marker to new location
            marker = new L.Marker([lat,lon]);
            mymap.addLayer(marker);
            // Point to new location in leaflet map
            geocodeService.reverse().latlng([lat,lon]).run(function (error, result) {
                if (error) {
                  return;
                }
                marker.bindPopup(result.address.Match_addr).openPopup();
            });
            // Fly to new location
            mymap.flyTo([lat,lon], 8);
 
        })
        .catch((error) => {
            alert("Geocoding API Hit Error: "+error);
        })
    })
    .catch((error) => {
        alert("Weather API Hit Error: "+error);
    });
});
// Format time
function formatTime(result) {
    let time = result.substring(11,16);
    let hours = time.substring(0,2);
    let temp_hours = hours%12 || 12;
    let end = (hours<12 || hours==24) ? "AM" : "PM";
    time = temp_hours + ":" + result.substring(14,16) + " " + end;
    return time;
}
// Add three default clocks to World Clock Tabs
function defaultClocks(worldClock) {
    let worldClockContainer = document.querySelector(".world-clock-list");
    worldClock.forEach(function(location, index) {
        let temp_location = location;
        let city = location.split("/");

        location = city[1];
        if(location.includes("_")) {
            location = location.replaceAll("_", " ");
        }
    
        let date, time, temp;
        const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OpenWeather.API_KEY}&units=metric`;
        fetch(weatherurl)
        .then(response => response.json())
        .then(data => {
            temp = data.main.temp;
            date = data.dt;
            let x = getDate_Time_Timezone(temp_location);
        
            let blockOfCode = document.createElement("div");
            blockOfCode.setAttribute("class","col-12 col-md-4");
            blockOfCode.innerHTML = `<div class="card mx-3 mx-sm-5 mx-md-3 my-3 mb-5 mb-md-5">
                <div class="card-img-top d-flex justify-content-center align-items-center bg-dark py-5"> 
                    <div class="clock">
                        <div class="clock-container">
                            <div class="hours"></div>
                            <div class="minutes"></div>
                            <div class="seconds"></div>
                            <div class="connect"></div>
                        </div>
                    </div>
                </div>
                <h4 class="card-title text-center pt-1"> <i class="material-icons world-clock-icons"> place </i> ${location} </h4>
                <div class="card-body text-center pb-3"> 
                    <div class="row">
                        <div class="col-6 text-center text-md-start"> <i class="material-icons world-clock-icons"> today </i> ${x.date} </div>
                        <div class="col-6 text-center text-md-end mb-2 mb-md-3"> <i class="material-icons world-clock-icons"> schedule </i> ${x.time} </div>
                        <div class="col-6 text-center text-md-start"> <i class="material-icons world-clock-icons"> thermostat </i> ${temp} C </div>
                        <div class="col-6 text-center text-md-end"> <button class="btn more-info-btn btn-block w-100" id="${temp_location}" tabindex="-1" aria-disabled="true"> More <i class="material-icons world-clock-icons"> east </i> </button> </div>
                    </div>
                </div>
            </div>`;
            document.querySelector("#clock-container").insertBefore(blockOfCode, addLocationCard);
            let result = moment().tz(temp_location).format();
            let t = result.substring(11,19);
            let splitTime = t.split(":");
            let timeObject = {
                hour: ((parseInt(splitTime[0]) + 11) % 12 + 1),
                minute: parseInt(splitTime[1]),
                second: parseInt(splitTime[2])
            }
            worldClockTime.push(timeObject);
            setInterval(startClock, refresh);
        })
    });
}
// Add clock for new entered location
addClockBtn.addEventListener("click", function() {
    let location = addLocationForClock.value;
    let temp_location = addLocationForClock.value;
    let city = location.split("/");

    location = city[1];
    if(location.includes("_")) {
        location = location.replaceAll("_", " ");
    }
    let date, temp;
    const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OpenWeather.API_KEY}&units=metric`;
    fetch(weatherurl)
    .then(response => response.json())
    .then(data => {
        temp = data.main.temp;
        date = data.dt;
        let x = getDate_Time_Timezone(temp_location);
        let blockOfCode = document.createElement("div");
        blockOfCode.setAttribute("class","col-12 col-md-4");
        blockOfCode.innerHTML = `<div class="card mx-3 mx-sm-5 mx-md-3 my-3 mb-5 mb-md-5">
            <div class="card-img-top d-flex justify-content-center align-items-center bg-dark py-5"> 
                <div class="clock">
                    <div class="clock-container">
                        <div class="hours"></div>
                        <div class="minutes"></div>
                        <div class="seconds"></div>
                        <div class="connect"></div>
                    </div>
                </div>
            </div>
            <h4 class="card-title text-center pt-1"> <i class="material-icons world-clock-icons"> place </i> ${location} </h4>
            <div class="card-body text-center pb-3"> 
                <div class="row">
                    <div class="col-6 text-center text-md-start"> <i class="material-icons world-clock-icons"> today </i> ${x.date} </div>
                    <div class="col-6 text-center text-md-end mb-2 mb-md-3"> <i class="material-icons world-clock-icons"> schedule </i> ${x.time} </div>
                    <div class="col-6 text-center text-md-start"> <i class="material-icons world-clock-icons"> thermostat </i> ${temp} C </div>
                    <div class="col-6 text-center text-md-end"> <button class="btn more-info-btn btn-block w-100" id="${temp_location}" tabindex="-1" aria-disabled="true"> More <i class="material-icons world-clock-icons"> east </i> </button> </div>
                </div>
            </div>
        </div>`;
        document.querySelector("#clock-container").insertBefore(blockOfCode, addLocationCard);
        cancelClockBtn.click();
        addLocationForClock.value = "";
        let result = moment().tz(temp_location).format();
        let t = result.substring(11,19);
        let splitTime = t.split(":");
        let timeObject = {
            hour: ((parseInt(splitTime[0]) + 11) % 12 + 1),
            minute: parseInt(splitTime[1]),
            second: parseInt(splitTime[2])
        }
        worldClockTime.push(timeObject);
    });
});
// Event delegation for dynamically added component
document.body.addEventListener("click", function(e) {
    if(e.target && e.target.classList.contains("more-info-btn")) {
        enteredLocation.value = e.target.id;
        let event = new Event("change");
        enteredLocation.dispatchEvent(event);
        document.querySelector("#weather-tab").click();
    }
});
// Kepp the clocks functioning every second
function startClock() {
    for(let i=0;i<worldClockTime.length;i++) {
        let hours = worldClockTime[i].hour * 30;
        let minutes = worldClockTime[i].minute * 6;
        let seconds = worldClockTime[i].second;

        if(worldClockTime[i].hour>12) {
            worldClockTime[i].hour%=12;
        }
        if(worldClockTime[i].second>360) {
            worldClockTime[i].second = 0;
            worldClockTime[i].minute++;
        } else {
            worldClockTime[i].second++;
        }
        if(worldClockTime[i].minute>60) {
            worldClockTime[i].minute = 0;
            worldClockTime[i].hour++;
        }
        document.querySelectorAll(".hours")[i].style.transform = `rotate(${hours}deg)`;
        document.querySelectorAll(".minutes")[i].style.transform = `rotate(${minutes}deg)`;
        document.querySelectorAll(".seconds")[i].style.transform = `rotate(${seconds}deg)`;
    }
}