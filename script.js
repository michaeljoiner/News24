// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const weatherApiKey = 'f96b9a6d5d29a24f4461ce4dd905c4ec';
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${weatherApiKey}&units=metric`;

// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayWeather(data) {
    const weatherWidget = document.getElementById('weather-widget');
    weatherWidget.textContent = `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].main}`;
}

// RSS feed URLs
const rssFeeds = [
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
];

// Fetch news data
async function fetchNews(url) {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
        const data = await response.json();
        displayNews(data.items);
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
}

function displayNews(newsItems) {
    const newsContent = document.getElementById('news-content');
    newsItems.forEach(item => {
        const newsElement = document.createElement('div');
        newsElement.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p>`;
        newsContent.appendChild(newsElement);
    });
}

// Initialize functions
fetchWeather();
rssFeeds.forEach(feed => fetchNews(feed));
