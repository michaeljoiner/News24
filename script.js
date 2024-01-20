

const weatherApiKey = 'f96b9a6d5d29a24f4461ce4dd905c4ec'; // Your API key
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
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://www.npr.org/rss/rss.php?id=1001',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://www.cnn.com/services/rss/',
    'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://www.reutersagency.com/feed/?taxonomy=category&post_type=best',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://feeds.skynews.com/feeds/rss/world.xml',
    'https://abcnews.go.com/abcnews/topstories',    
    // Add more RSS feed URLs
];

async function fetchNews() {
    for (const feed of rssFeeds) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`);
            const data = await response.json();
            newsItems.push(...data.items);
            updateNewsTicker();
            rotateFeaturedNews();
        } catch (error) {
            console.error("Error fetching news data:", error);
        }
    }
}

function updateNewsTicker() {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = newsItems.map(item => `<span class="ticker-item">${item.title}</span>`).join('');
}

function rotateFeaturedNews() {
    let newsIndex = 0;
    setInterval(() => {
        if (newsItems.length > 0) {
            displayFeaturedNews(newsItems[newsIndex % newsItems.length]);
            newsIndex++;
        }
    }, 8000); // Rotate featured news every 8 seconds
}

function displayFeaturedNews(item) {
    const mainNews = document.getElementById('featured-news');
    mainNews.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.description}</p>
    `;
}

// Initialization
rotateCityWeather();
setInterval(rotateCityWeather, 60000); // Rotate weather every minute
fetchNews();
