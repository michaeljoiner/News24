const weatherApiKey = 'f96b9a6d5d29a24f4461ce4dd905c4ec'; // Your API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const majorCities = ["New York", "London", "Tokyo", "Paris", "Berlin", "Moscow", "Sydney", "Beijing", "Rio de Janeiro", "Los Angeles"];
let currentCityIndex = 0;
let newsItems = [];
let fourBoxStreams = [
    'https://www.youtube.com/embed/103FjS8J5KA', // NBC News
    'https://www.youtube.com/embed/QKHDueT2oBs', // LiveNOW from Fox
    'https://www.youtube.com/embed/gN0PZCe-kwQ', // ABC News
    'https://www.youtube.com/embed/tkDUSYHoKxE', // France24 English
];

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
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(Date.now() - timezoneOffset).toISOString().slice(11, 16);
    const weatherWidget = document.getElementById('time-weather');
    weatherWidget.innerHTML = `${city}: ${data.main.temp.toFixed(0)}°F, ${data.weather[0].main} | ${localTime}`;
}

function rotateCityWeather() {
    fetchWeatherForCity(majorCities[currentCityIndex]);
    currentCityIndex = (currentCityIndex + 1) % majorCities.length;
}

// Add your RSS feeds URLs here
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
    // More RSS feeds...
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
    displayFeaturedNews();
    updateNewsTicker();
}

function displayFeaturedNews() {
    const mainNews = document.getElementById('featured-news');
    // Assuming your RSS feed items have a property "enclosure" with the image URL
    // This will cycle through the news items and display them one by one
    let newsIndex = 0;
    setInterval(() => {
        const item = newsItems[newsIndex % newsItems.length];
        mainNews.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p><img src="${item.enclosure.link}" alt="news image">`;
        newsIndex++;
    }, 10000); // Update every 10 seconds
}

function updateNewsTicker() {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = newsItems.map(item => `<span class="ticker-item">${item.title}</span>`).join('');
}

function display4Box() {
    const fourBoxContainer = document.getElementById('four-box');
    fourBoxContainer.innerHTML = fourBoxStreams.map(url => 
        `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`
    ).join('');
}

// Initialization
rotateCityWeather();
setInterval(rotateCityWeather, 60000); // Rotate city weather every minute
fetchNews();
