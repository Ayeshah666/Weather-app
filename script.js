// API configuration
const API_KEY = 'YOUR-API-KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Cute weather descriptions
const CUTE_DESCRIPTIONS = {
    clear: "It's a perfect day for carrot picking!",
    clouds: "Fluffy clouds are having a party!",
    rain: "Raindrops keep falling on my... carrots!",
    snow: "Snow bunnies are hopping around!",
    thunderstorm: "Oh dear! Better stay in the burrow!",
    mist: "Everything looks so soft and fuzzy!"
};

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const toggleUnitBtn = document.getElementById('toggle-unit');
const weatherIcon = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const locationElement = document.getElementById('location');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');

// State
let isCelsius = true;

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Tokyo');
});

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

toggleUnitBtn.addEventListener('click', toggleTemperatureUnit);

// Fetch weather data
async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === 200) {
            updateWeatherUI(data);
        } else {
            showBunnyError();
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showBunnyError();
    }
}

function showBunnyError() {
    weatherDescription.textContent = "Oh hops! Couldn't find that place!";
    weatherDescription.style.color = "#ff8fab";
    setTimeout(() => {
        weatherDescription.style.color = "#a58fb4";
    }, 2000);
}

// Update UI with weather data
function updateWeatherUI(data) {
    const tempC = Math.round(data.main.temp);
    const tempF = Math.round((tempC * 9/5) + 32);
    
    // Update temperature display based on current unit
    temperatureElement.textContent = isCelsius ? `${tempC}°C` : `${tempF}°F`;
    
    // Get cute description
    const weatherCondition = data.weather[0].main.toLowerCase();
    const cuteDesc = CUTE_DESCRIPTIONS[weatherCondition] || 
                    `It's ${data.weather[0].description} today!`;
    
    weatherDescription.textContent = cuteDesc;
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    humidityElement.textContent = data.main.humidity;
    windSpeedElement.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    
    // Update weather icon
    updateWeatherIcon(weatherCondition);
}

// Update weather icon
function updateWeatherIcon(weatherCondition) {
    // Clear all classes
    weatherIcon.className = 'weather-icon';
    
    // Add condition-specific class
    weatherIcon.classList.add(weatherCondition);
}

// Toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    toggleUnitBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
    
    // Get current temperature value
    const currentTempText = temperatureElement.textContent;
    const currentTemp = parseInt(currentTempText);
    
    // Convert and update
    if (isCelsius) {
        // Convert from F to C
        const tempC = Math.round((currentTemp - 32) * 5/9);
        temperatureElement.textContent = `${tempC}°C`;
    } else {
        // Convert from C to F
        const tempF = Math.round((currentTemp * 9/5) + 32);
        temperatureElement.textContent = `${tempF}°F`;
    }
}
