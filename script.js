const weatherApiKey = 'f96b9a6d5d29a24f4461ce4dd905c4ec'; // Replace with your API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const majorCities = ["New York", "London", "Tokyo", "Paris", "Berlin", "Moscow", "Sydney", "Beijing", "Rio de Janeiro", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"];
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
    weatherWidget.innerHTML = `${city}: ${data.main.temp.toFixed(0)}°F, ${data.weather[0].main}`;
}

function rotateCityWeather() {
    fetchWeatherForCity(majorCities[currentCityIndex]);
    currentCityIndex = (currentCityIndex + 1) % majorCities.length;
}

const rssFeeds = [
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
];

async function fetchNews(url) {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
        const data = await response.json();
        newsItems = newsItems.concat(data.items);
        if (newsItems.length > 20) newsItems = newsItems.slice(0, 20); // Limit number of news items
        displayNews(newsItems[0]);
        updateNewsTicker(newsItems);
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
}

function displayNews(item) {
    const mainNews = document.getElementById('main-news');
    mainNews.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.description}</p>
    `;
}

function updateNewsTicker(items) {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = items.map(item => `<span class="ticker-item">${item.title}</span>`).join('');
}

function rotateFeaturedNews() {
    let newsIndex = 0;
    setInterval(() => {
        if (newsItems.length > 0) {
            displayNews(newsItems[newsIndex]);
            newsIndex = (newsIndex + 1) % newsItems.length;
        }
    }, 10000); // Change news every 10 seconds
}

rotateCityWeather();
setInterval(rotateCityWeather, 60000); // Rotate weather every minute
rssFeeds.forEach(feed => fetchNews(feed));
rotateFeaturedNews();
