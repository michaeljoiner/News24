const weatherApiKey = 'f96b9a6d5d29a24f4461ce4dd905c4ec'; // Replace with your API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const majorCities = ["New York", "London", "Tokyo", /* more cities */];
let currentCityIndex = 0;
let newsItems = [];

async function fetchWeatherForCity(city) {
    try {
        const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${weatherApiKey}&units=imperial`);
        const data = await response.json();
        displayWeather(data, city);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayWeather(data, city) {
    const weatherWidget = document.getElementById('time-weather');
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    weatherWidget.innerHTML = `${currentTime} - ${city}: ${data.main.temp.toFixed(0)}°F, ${data.weather[0].main}`;
}

function rotateCityWeather() {
    fetchWeatherForCity(majorCities[currentCityIndex]);
    currentCityIndex = (currentCityIndex + 1) % majorCities.length;
}

const rssFeeds = [
    // Replace these with actual RSS feed URLs
    'https://example.com/feed1.rss',
    'https://example.com/feed2.rss'
];

async function fetchNews() {
    for (const feed of rssFeeds) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`);
            const data = await response.json();
            newsItems.push(...data.items);
        } catch (error) {
            console.error("Error fetching news data:", error);
        }
    }
    updateNewsTicker();
    rotateFeaturedNews();
}

function updateNewsTicker() {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = newsItems.map(item => `<span class="ticker-item">${item.title}</span>`).join('');
}

function rotateFeaturedNews() {
    let newsIndex = 0;
    const featuredNews = document.getElementById('featured-news');
    setInterval(() => {
        if (newsItems.length > 0) {
            const item = newsItems[newsIndex % newsItems.length];
            featuredNews.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p>`;
            newsIndex++;
        }
    }, 8000); // Rotate featured news every 8 seconds
}

// Initialization
rotateCityWeather();
setInterval(rotateCityWeather, 60000); // Rotate city weather every 60 seconds
fetchNews();
