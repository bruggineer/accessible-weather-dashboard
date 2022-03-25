

$(document).ready(function () {
    //declare global variables
    // OpenWeather API key
    var APIKey = "7321de3bce923134cdfb94c3f0188e62";

    // define ascii degrees symbol
    var deg = String.fromCharCode(176);

    //gets and renders current weather
    function getCurrentWeather(subCity) {
        //declare and define date variables
        var longDate = new Date();
        var dd = longDate.getDate();
        var mm = longDate.getMonth() + 1;
        var yyyy = longDate.getFullYear();

        // add leading zero for dates 1-9 and then assign and construct current date for rendering
        if (dd < 10) {
            dd = '0' + dd;
        }
        var today = mm + '/' + dd + '/' + yyyy;

        // OpenWeather query for current weather with user imput and api key
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + subCity + "&units=imperial&appid=" + APIKey

        // Call to OpenWeather server for current weather data, render city, today's date, weather icon
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // Store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Declare lattitude and longitude for passing to UV Index function
                var lat = response.coord.lat;
                var lon = response.coord.lon;

                //Retrieve the weather icon
                var icon = ("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>");

                //create elements and render current weather
                $(".city-current").append(
                    $('<div/>')
                        .attr("id", "current")
                        .addClass("current-box")
                        .append("<h2>" + response.name + " (" + today + ") " + icon + "</h2>")
                        .append("<p>" + "Temperature: " + response.main.temp + " " + deg + "F" + "</p>")
                        .append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>")
                        .append("<p>" + "Wind Speed: " + + response.wind.speed + " mph" + "</p>")
                );

                //call the UV index function,passing it latitude and longitude of subCity 
                getCurrentUV(lat, lon);
            });
    };

    // makes call to weather api for UV Index value and renders it
    function getCurrentUV(lat, lon) {

        // Call to OpenWeather server for current weather data, render city, today's date, weather icon
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=7321de3bce923134cdfb94c3f0188e62&lat=" + lat + "&lon=" + lon,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the resulting object for reference
                var uv = response.value;

                // create paragraph for UV data and append for rendering
                $("#current").append(
                    $('<p/>')
                        .attr("id", "uvIndex")
                );
                $("#uvIndex").append(
                    $('<span/>')
                        .attr("id", "uvTitle")
                        .append("UV Index: ")
                );
                $("#uvTitle").append(
                    $("<span/>")
                        .attr("id", "uvVal")
                        .append(uv)
                );

                //assign class for color to the background of response.value */
                if (response.value <= 2) {
                    $("#uvVal").addClass("low");
                }
                else if (response.value > 2 && response.value <= 7) {
                    $("#uvVal").addClass("mod");
                }
                else {
                    $("#uvVal").addClass("high");
                }
            });
    };


    // gets and displays the five-day forecast
    function getForecast(subCity) {
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
        $("#forecastTitle").empty();

        $.ajax({
            url: forecastUrl, //API Call
            type: "GET",
            data: {
                q: subCity,
                appid: APIKey,
                units: "imperial",
            },
            success: function (response) {
                $("#forecastTitle").append(
                    $('<h4/>').text("5-Day Forecast:")
                        .attr("id", "foreTitle")
                );
                for (var i = 0; i < 5; i++) {
                    var placeHolder = response.list[i].main;

                    //declare and define date variables
                    const today = new Date();
                    const nextDay = new Date(today);
                    nextDay.setDate(nextDay.getDate() + (i + 1));
                    var dd = nextDay.getDate();
                    var mm = nextDay.getMonth() + 1;
                    var yyyy = nextDay.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    var forecastDate = mm + '/' + dd + '/' + yyyy;

                    //define local variables, create element and render
                    var high = placeHolder.temp_max;
                    var humidity = placeHolder.humidity;
                    var icon = "<img src='https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png'>"
                    $("#forecast").append(
                        $('<div/>')
                            .attr("id", "eachForecast")
                            .addClass("col")
                            .append("<h4>" + forecastDate + "</h4>")
                            .append("<p>" + icon + "</p>")
                            .append("<p>" + "Temp: " + high + " " + deg + "F" + "</p>")   //add degress symbol
                            .append("<p>" + "Humidity: " + humidity + "%" + "</p>")
                    );
                }
            }
        })
    }

    //displays the search and searched for cities list in sidebar
    function displaySidebar(subCity) {
        var cities = [];
        cities.push(subCity);
        for (var i = 0; i < cities.length; i++) {
            var cityList = $("<div>");
            $("#citSearch").append(cityList);
            var cityButton = $("<button>").addClass("city-button col-12");
            cityButton.text(cities[i]);
            cityList.addClass("city-list");
            cityList.append(cityButton);
            $(cityButton).attr("id", cities[i]);
            localStorage.setItem("citiesArray", JSON.stringify(cities[i]));
        }
    }

    //Event listeners- one on the Submit Button and one on the City Button
    // event listener on the Search icon
    $("#submitted-city").on("click", function (event) {

        // Preventing the button from trying to submit the form
        event.preventDefault();

        //initialize the page
        $(".city-current").empty();
        $("#forecast").empty();

        // Storing the submitted city name
        var subCity = $("#city-input").val().trim();

        //call functions for current weather and the five-day forecast, clear the input box for new entry
        displaySidebar(subCity);
        getCurrentWeather(subCity);
        getForecast(subCity);
        $("#city-input").val('');
    });

    $("#citSearch").on("click", function (event) {

        // Preventing the button from trying to submit the form
        event.preventDefault();

        //initialize the page
        $(".city-current").empty();
        $("#forecast").empty();

        // Storing the clicked city name
        var subCity = event.target.id;

        //call functions for current weather and the five-day forecast
        getCurrentWeather(subCity);
        getForecast(subCity);
    });
});