var button = document.querySelector(".btn");
var cityInput = document.querySelector("#input-city");
var currentWeatherEl = document.querySelector("#current-weather");
var cityNameEl = document.querySelector("#city-name");
var iconEl = document.querySelector("#current-icon");
var descriptionEl = document.querySelector("#description");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind-speed");
var fiveDayEl = document.querySelector("#fiveDay");
var searchHistory = [];

//OpenWeather api key
var apiKey = "755e0b14b164c0f68364b9b8b3215515";

//Function to get weather by city
function getWeather(cityName) {
	var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

	//fetch request
	fetch(apiUrl).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				{
					currentWeatherEl.classList.remove("d-none");
					displayWeather(data, cityName);
				}
			});
		} else {
			alert("Please enter a valid city name");
		}
	});
}

//display the current weather with city, icon, descr, temp, humid, wind
var displayWeather = function (data, cityName) {
	var currentInfo = {
		city: data.name,
		icon: data.weather[0].icon,
		description: data.weather[0].description,
		temp: data.main.temp,
		humidity: data.main.humidity,
		wind: data.wind.speed,
	};

	var iconApi =
		"https://openweathermap.org/img/wn/" + currentInfo.icon + "@2x.png";

	//display the current weather with city, icon, descr, temp, humid, wind
	cityNameEl.innerHTML = currentInfo.city;
	iconEl.src = iconApi;
	descriptionEl.innerHTML = currentInfo.description;
	tempEl.innerHTML = "Temp: " + currentInfo.temp + "°F";
	humidityEl.innerHTML = "Humidity: " + currentInfo.humidity + "%";
	windEl.innerHTML = "Wind Speed: " + currentInfo.wind + " MPH";
	displayFiveForecast(cityName);
};

//5 day forcast
var displayFiveForecast = function (cityName) {
	var apiSecondUrl =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		cityName +
		"&units=imperial&appid=" +
		apiKey;
	//fetch request for 5 day forecast
	fetch(apiSecondUrl).then(function (response) {
		if (response.ok) {
			console.log(response);
			response.json().then(function (data) {
				fiveDayEl.classList.remove("d-none");
				console.log(data);
				$(".fiveForecast").empty();
				// display 5 card forcast
				for (var i = 0; i < 5; i++) {
					var forecastInfo = {
						icon: data.list[i].weather[0].icon,
						temp: data.list[i].main.temp,
						humidity: data.list[i].main.humidity,
						wind: data.list[i].wind.speed,
					};
					// set the date for each card
					var forecastIndex = i * 8 + 4;
					var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
					var forecastSetDate = dayjs(forecastDate).format("MM/DD");
					console.log(forecastDate);

					var iconApi = `<img src="https://openweathermap.org/img/wn/${forecastInfo.icon}@2x.png"/>`;
					// add elements to the card
					var futureForecastEl = $(`
									<div class="card card-body col-md-2 bg-primary text-white rounded">
										<div class="card-body">
											<p class="fs-3">${forecastSetDate}</p>
											<p>${iconApi}</p>
											<p class="fs-4">Temp: ${forecastInfo.temp}°F</p>
											<p class="fs-5">Humidity: ${forecastInfo.humidity}%</p>
											<p class="fs-5">Wind: ${forecastInfo.wind} MPH</p>
						   			</div>
									</div>
							
									`);
					// append the card to the card-body
					$(".fiveForecast").append(futureForecastEl);
				}
			});
		}
	});
};

// eventlistener for search button
button.addEventListener("click", function (event) {
	event.preventDefault();
	var cityName = $("#input-city").val().trim();

	getWeather(cityName);
	//display search history and update weather
	if (!searchHistory.includes(cityName)) {
		searchHistory.push(cityName);
		var displayHistory = $(`
		<li class="list-group-item">${cityName}</li>`);
		$("#search-histroy").append(displayHistory);
	}

	localStorage.setItem("cityName", JSON.stringify(cityName));
});

//Search history button on click searches the weather
$("#search-histroy").on("click", "li", function () {
	var cityHistroy = $(this).text();
	getWeather(cityHistroy);
});

// render history on page load if search history exists
function renderHistory() {
	var searchCity = JSON.parse(localStorage.getItem("cityName"));

	getWeather(searchCity);
}
renderHistory();
