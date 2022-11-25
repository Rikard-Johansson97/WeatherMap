document.cookie = "Set-Cookie: promo_shown=1; SameSite=Lax";

// Key: 0388acbbb468f9fe47a5ad8e4a8bc184
// API: https://api.openweathermap.org/data/2.5/weather?q=varberg&appid=0388acbbb468f9fe47a5ad8e4a8bc184

const currentCity = document.getElementById("current-city");
const currentTemp = document.getElementById("current-temp");
const cardContainer = document.getElementById("card-container");
const displayTime = document.getElementById("current-time");
const displayImg = document.getElementById("card-img");
const displayWeatherIcon = document.getElementById("weather-icon");
const displayInfo = document.getElementById("info");
// Searchbox declarations
const searchInput = document.getElementById("search-input");
const listWrapper = document.getElementById("list-container");
// interval stop
let interval;
// result box
let results = [];
// TODO | Functions here
const showErrorMessage = () => {
    searchInput.placeholder = "Cannot find city location";
};

const getTimeFromTimeZone = (timezone) => {
    let time = new Date(new Date().getTime() + 1 * timezone * 1000);
    let hours = time.getUTCHours();
    let minutes = time.getMinutes();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    cardContainer.classList.add(`sky-gradient-${hours}`);
    displayTime.innerHTML = `${hours}:${minutes}`;
};
//! Fetch weather data
const getWeather = async (cityName) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0388acbbb468f9fe47a5ad8e4a8bc184&units=metric`
    );
    if (response.status !== 200) throw new Error("ERROR");
    const data = await response.json();
    console.log(data);
    currentCity.innerHTML = data.name;
    currentTemp.innerHTML = Math.floor(data.main.temp) + "°c";
    // displayar väder iconen
    displayWeatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    // displays info
    cardContainer.className = "card-container";
    displayInfo.innerHTML = data.weather[0].description;
    // kollar värmen
    if (data.main.temp > 20) displayImg.src = "/img/hot.png";
    else if (data.main.temp < 5) displayImg.src = "/img/cold.png";
    else displayImg.src = "/img/normal.png";

    // Hämtar tidszon
    getTimeFromTimeZone(data.timezone);
    interval = setInterval(() => {
        getTimeFromTimeZone(data.timezone);
        console.log("count");
    }, 1000);

    //
};

const getCityList = async (search) => {
    fetch("city.list.json")
        .then((response) => response.json())
        .then((json) => {
            listWrapper.innerHTML = "";
            for (let i = 0; i < json.length; i++) {
                if (results.length > 10) break;
                if (json[i].name.toLowerCase().indexOf(search) !== -1)
                    results.push(json[i].name);
            }
            console.log(results);
            results.forEach((result) => {
                let li = document.createElement("li");
                li.innerHTML = result;
                listWrapper.appendChild(li);
            });
            results = [];
        });
};

// TODO | EVENTLISTNERS
searchInput.addEventListener("keyup", () => {
    let search = searchInput.value.toLowerCase();
    getCityList(search);
});
listWrapper.addEventListener("click", (e) => {
    getWeather(e.target.innerHTML);
    clearInterval(interval);
    searchInput.value = "";
    listWrapper.innerHTML = "";
});

// getWeather(currentCity);
getCityList();
