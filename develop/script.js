var button = document.querySelector(".btn");
var cityInput = document.querySelector("#input-city");
var currentWeatherEl = document.querySelector("#current-weather");
var cityNameEl = document.querySelector("#city-name");
var iconEl = document.querySelector("#current-icon");
var descriptionEl = document.querySelector("#description");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind-speed");
var fiveDayEl = document.querySelector("#fiveday-header");
var forecastEl = document.querySelector(".fiveday-forcast");
//OpenWeather api key
var apiKey = "755e0b14b164c0f68364b9b8b3215515";

//Function to get weather by city
function getWeather(cityName) {
	var apiUrl =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"&units=imperial&appid=" +
		apiKey;

	fetch(apiUrl).then(function (response) {
		if (response.ok) {
			console.log(response);
			response.json().then(function (data) {
				console.log(data);
				currentWeatherEl.classList.remove("d-none");
				displayWeather(data);
			});
			//display the current weather with city, icon, descr, temp, humid, wind
			var displayWeather = function (data) {
				var { name } = data;
				var { icon, description } = data.weather[0];
				var { temp, humidity } = data.main;
				var { speed } = data.wind;
				var currentDate = dayjs().format("dddd MM/DD/YY");
				var iconApi = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
				cityNameEl.innerHTML = name + " (" + currentDate + ")";
				iconEl.src = iconApi;
				descriptionEl.innerHTML = description;
				tempEl.innerHTML = "Temp: " + temp + "°F";
				humidityEl.innerHTML = "Humidity: " + humidity + "%";
				windEl.innerHTML = "Wind: " + speed + "MPH";

				//5 day forcast

				var apiSecondUrl =
					"https://api.openweathermap.org/data/2.5/forecast?q=" +
					cityName +
					"&units=imperial&appid=" +
					apiKey;
				fetch(apiSecondUrl).then(function (response) {
					if (response.ok) {
						console.log(response);
						response.json().then(function (data) {
							console.log(data.list);
							fiveDayEl.classList.remove("d-none");

							for (var i = 0; i < 5; i++) {
								var forecastIndex = i * 8 + 4;
								var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
								var forecastDate = dayjs(forecastDate).format("MM/DD");

								var forecastIcon = data.list[forecastIndex].weather[0].icon;
								var forecastTemp = data.list[forecastIndex].main.temp;
								var forecastHumidity = data.list[forecastIndex].main.humidity;
								var forecastWind = data.list[forecastIndex].wind.speed;

								var iconApi =
									"https://openweathermap.org/img/wn/" +
									forecastIcon +
									"@2x.png";

								var card = document.createElement("div");
								card.classList.add(
									"card",
									"card-body",
									"forecast-card",
									"col-md-1",
									"col-sm-1",
									"col-xs-1",
									"margin-5px",
									"bg-primary",
									"text-white",
									"rounded"
								);

								var cardBody = document.createElement("div");
								cardBody.innerHTML = forecastDate;
								card.appendChild(cardBody);

								var cardIcon = document.createElement("img");
								cardIcon.src = iconApi;
								card.appendChild(cardIcon);

								var cardTemp = document.createElement("p");
								cardTemp.classList.add("card-text");
								cardTemp.innerHTML = "Temp: " + forecastTemp + "°F";
								card.appendChild(cardTemp);

								var cardHumidity = document.createElement("p");
								cardHumidity.classList.add("card-text");
								cardHumidity.innerHTML = "Humidity: " + forecastHumidity + "%";
								card.appendChild(cardHumidity);

								var cardWind = document.createElement("p");
								cardWind.classList.add("card-text");
								cardWind.innerHTML = "Wind: " + forecastWind + "MPH";
								card.appendChild(cardWind);
								fiveDayEl.appendChild(card);
								console.log(card);
								console.log(cardBody);
							}
						});
					}
				});
			};
		}
	});
}

// eventlistener for search button
button.addEventListener("click", function () {
	var cityName = cityInput.value;
	getWeather(cityName);
});
