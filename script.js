// Replace with your actual OpenWeatherMap API key
const weatherApiKey = 'YOUR_API_KEY';
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${weatherApiKey}&units=metric`;

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

const rssFeeds = [
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
];

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
    newsContent.innerHTML = '';
    newsItems.forEach(item => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <h2>${item.title}</h2>
            <img src="${extractImageUrl(item.description)}" alt="News Image">
            <p>${item.description}</p>
        `;
        newsContent.appendChild(newsElement);
    });
    updateNewsTicker(newsItems);
}

function extractImageUrl(htmlContent) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const image = div.querySelector('img');
    return image ? image.src : '';
}

function updateNewsTicker(newsItems) {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = newsItems.map(item => 
        `<span class="ticker-item">${item.title}</span>`
    ).join('');
}

fetchWeather();
rssFeeds.forEach(feed => fetchNews(feed));
