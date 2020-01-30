async function getWeather(city='hello', units='metric') {
	// Kelvin: default
	// Fahrenheit: units=imperial
	// Celsius: units=metric
	const url =
		`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=79c64f2a8381f12713b0371b2995d5ea`
	const response = await fetch(url, {mode: 'cors'});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	const temp = data.main.temp;
	const humidity = data.main.humidity;
	const description = data.weather[0].description;
	return {city, units, temp, humidity, description};
}

const city = document.querySelector('input[name="city"]');
const units = document.querySelectorAll('input[name="units"');
const button = document.querySelector('button');

const getInput = function () {
	const cityInput = city.value.trim().split(/\s+/).join(' ');
	const unitsInput = units[0].checked? units[0].value : units[1].value;

	if (!cityInput) {
		return;
	}

	return { city: cityInput, units: unitsInput, };
}

const clearDisplay = function () {
	const weather = document.querySelector('#weather');
	const message = document.querySelector('#message');

	if (weather) {
		document.body.removeChild(weather);
	}

	if (message) {
		document.body.removeChild(message);
	}

	return document.body;
}

const displayWeather = function (data) {
	const weather = document.createElement('div');

	const city = document.createElement('h2');
	const temp = document.createElement('p');
	const humidity = document.createElement('p');
	const description = document.createElement('p');
	const units = String.fromCharCode(data.units == 'metric' ? 8451 : 8457);

	city.textContent = data.city;
	temp.textContent = `${data.temp}${units}`;
	humidity.textContent = `${data.humidity}%`;
	description.textContent = data.description;

	weather.id = 'weather';
	weather.appendChild(city);
	weather.appendChild(temp);
	weather.appendChild(humidity);
	weather.appendChild(description);

	return weather;
}

const displayMessage = function (mesg) {
	const message = document.createElement('div');

	message.id = 'message';
	message.textContent = mesg;

	return message;
}

button.addEventListener('click', () => {
	const inputs = getInput();

	clearDisplay();
	if (!inputs) {
		document.body.appendChild(
			displayMessage('Please enter city\'s name')
		);
		return;
	}

	getWeather(inputs.city, inputs.units)
		.then((data) => {
			document.body.appendChild(displayWeather(data));
		})
		.catch((error) => {
			document.body.appendChild(displayMessage(error.message));
		});
});

