// var for elements
var searchButton = document.querySelector(".search-button");
var clearButton = document.querySelector(".clear-button");
var cityInput = document.querySelector("#input-city");
var currentWeatherEl = document.querySelector("#current-weather");
var cityNameEl = document.querySelector("#city-name");
var iconEl = document.querySelector("#current-icon");
var descriptionEl = document.querySelector("#description");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind-speed");
var fiveDayEl = document.querySelector("#fiveDay");
var recentSearch = document.querySelector("#search-histroy");

//OpenWeather api key
var apiKey = "755e0b14b164c0f68364b9b8b3215515";

//Function to get weather by city
function getWeather(cityName) {
	var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

	//fetch request
	fetch(apiUrl).then(function (response) {
		//if response is not ok then throw error message
		if (!response.ok) {
			//empty currentWeatherEl and hide 5 forecast
			fiveDayEl.classList.add("d-none");
			currentWeatherEl.classList.remove("d-none");
			iconEl.src = "";
			descriptionEl.innerHTML = "";
			tempEl.innerHTML = "";
			humidityEl.innerHTML = "";
			windEl.innerHTML = "";
			cityNameEl.textContent = "Error: Please Enter City Again";
		} else {
			//clear input field once it has been submitted
			cityInput.value = "";
			response.json().then(function (data) {
				currentWeatherEl.classList.remove("d-none");
				addInfo(cityName);
				displayWeather(data, cityName);
			});
		}
	});
}

//display function for current weather
var displayWeather = function (data, cityName) {
	//variable to store the current weather data
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
			response.json().then(function (data) {
				fiveDayEl.classList.remove("d-none");
				$(".fiveForecast").empty();

				// for loop to display 5 day forecast cards
				for (var i = 0; i < 5; i++) {
					// variable to store the 5 day forecast
					var forecastInfo = {
						icon: data.list[i].weather[0].icon,
						temp: data.list[i].main.temp,
						humidity: data.list[i].main.humidity,
						wind: data.list[i].wind.speed,
					};

					// setting the date for each card
					var forecastIndex = i * 8 + 4;
					var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
					var forecastSetDate = dayjs(forecastDate).format("MM/DD");

					var iconApi = `<img src="https://openweathermap.org/img/wn/${forecastInfo.icon}@2x.png"/>`;

					// add elements to the card
					var futureForecastEl = $(`
									<div class="card five-card-body col-sm-2 col-md-2 bg-primary text-white rounded">
										<div class="card-body">
											<p class="fs-3">${forecastSetDate}</p>
											<p>${iconApi}</p>
											<p class="fs-4">Temp: ${forecastInfo.temp}°F</p>
											<p class="fs-5">Humidity: ${forecastInfo.humidity}%</p>
											<p class="fs-5">Wind: ${forecastInfo.wind} MPH</p>
						   			</div>
									</div>
							
									`);
					// append the futureForecastEl card to the fiveForecast div
					$(".fiveForecast").append(futureForecastEl);
				}
			});
		}
	});
};

// eventlistener for search button
searchButton.addEventListener("click", function (event) {
	event.preventDefault();
	var cityName = $("#input-city").val().trim();
	getWeather(cityName);
});

//eventlistener for clear button
clearButton.addEventListener("click", function (event) {
	event.preventDefault();
	localStorage.removeItem("city");
	$(".list-group-item").remove();
	currentWeatherEl.classList.add("d-none");
	fiveDayEl.classList.add("d-none");
});

// eventlistener for using the enter key
$("#input-city").on("keyup", function (e) {
	if (e.keyCode == 13) {
		var cityName = $("#input-city").val().trim();
		getWeather(cityName);
	}
});

//Search history button on click searches the weather
$("#search-history").on("click", function (event) {
	event.preventDefault();
	// target the id of the city that was clicked to find the weather
	cityInput.value = event.target.id;

	getWeather(cityInput.value);
});
//update local storage if the city name is already in the local storage
// then it will return else it will add the city name to the local storage
function updateLocalStorage(cityName) {
	if (searchHistory.includes(cityName)) {
		return;
	} else {
		searchHistory.push(cityName);
		localStorage.setItem("city", JSON.stringify(searchHistory));
	}
}

// add the searched city name to local storage and check if local storage already has the name
//if it doesn't then it will display the search history
function addInfo(cityName) {
	searchHistory = getLocalStorage();
	var displayHistory = $(`
			<li id="${cityName}" <a href="#" class="list-group-item list-group-item-action list-group-item-primary">${cityName}</li>`);
	if (searchHistory.includes(cityName) === false) {
		$("#search-history").append(displayHistory);
	}
	updateLocalStorage(cityName);
}

//get local storage
function getLocalStorage() {
	var searchHistory = localStorage.getItem("city");
	if (searchHistory !== null) {
		newList = JSON.parse(searchHistory);
		return newList;
	}
}
// render search history of user searches on page load if search history exists
function renderHistory() {
	$(".list-group-item").remove();
	searchHistory = getLocalStorage();
	if (!searchHistory.includes("cityName")) {
		for (var i = 0; i < searchHistory.length; i++) {
			inputCity = searchHistory[i];
			var displayHistory = $(
				`<li id="${inputCity}"<a href="#" class="list-group-item list-group-item-action list-group-item-primary">${inputCity}</li>`
			);
			$("#search-history").append(displayHistory);
		}
	}
}

renderHistory();
