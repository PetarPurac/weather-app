const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
wIcon = document.querySelector('.weather-part img'),
backIcon = document.querySelector('header i');

const hourForecastBtn = document.querySelector('.weather-hourly__btn');
const appList = document.querySelector('.app__list');
const appListImg = document.querySelector('.app__list-img');
const weatherList = document.querySelector('.weather-list');
const weatherPart = document.querySelector('.weather-part');
const weatherHourly = document.querySelector('.weather-hourly')

let api;

const apikey = `7eea794b849b17a024139e73ab9c04d5`;

inputField.addEventListener("keyup", (e) => {
    if(e.key == "Enter" && inputField.value != "" ){
        hourForecastBtn.style.display = 'block'
        requestApi(inputField.value);
    }
});

locationBtn?.addEventListener('click', () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        hourForecastBtn.style.display = 'none'
    }else {
        alert("your browser doesn not support geolocation api")
    }
});

function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`
    fetchData();
}

function onError(error)  {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error")
}

function requestApi(city) {
     api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`
    fetchData()
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending")

    fetch(api).then(response => response.json()).then(result => weatherDetails(result))
}

function checkWeatherId(id, icon) {
    if(id == 800) {
        document.body.style.backgroundImage = "url(icons/clear.svg)"
        icon.src = "icons/clear.svg";
    }else if(id >= 200 && id <= 233) {
        document.body.style.backgroundImage = "url(icons/storm.svg)"
        icon.src = "icons/storm.svg";
    }else if(id >= 600 && id <= 622) {
        document.body.style.backgroundImage = "url(icons/snow.svg)"
        icon.src = "icons/snow.svg";
    }else if(id >= 701 && id <= 781) {
        document.body.style.backgroundImage = "url(icons/haze.svg)"
        icon.src = "icons/haze.svg";
    }else if(id >= 801 && id <= 804) {
        document.body.style.backgroundImage = "url(icons/storm.svg)"
        icon.src = "icons/storm.svg";
    }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        document.body.style.backgroundImage = "url(icons/rain.svg)"
        icon.src = "icons/rain.svg";
    }

}

function weatherDetails(info, error) {
    if(info.cod == '404'){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
        infoTxt.classList.replace("pending","error")
    }else {
        // getting property values;
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        //according icons from api id
        checkWeatherId(id, wIcon)

        // pass these values
        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

    
        infoTxt.classList.remove("pending","error")
        wrapper.classList.add('active')
        weatherPart.classList.add('weather-part--active');
        inputPart.classList.add('input-part--hidden')
        weatherHourly.classList.add('weather-hourly--active')
        console.log(info)
    }
}

function goBackToSearch() {
    backIcon?.addEventListener('click', () => {
        wrapper.classList.remove('active');
        inputPart.classList.remove('input-part--hidden')
        weatherPart.classList.remove('weather-part--active');
        weatherHourly.classList.remove('weather-hourly--active')
        weatherList.classList.remove('weather-list--active');
        hourForecastBtn.innerText = 'See Hourly Forecast'
        document.body.style.backgroundImage = ""
        inputField.value = '';
    })
}
goBackToSearch();


function seeHourlyForecast() {
    hourForecastBtn?.addEventListener('click', () => {
        const listItems = document.querySelectorAll('.app__list-item');

        if(!hourForecastBtn.classList.contains('btnActive')){

            requestApi2(inputField.value)

            hourForecastBtn.classList.add('btnActive');
            listItems.forEach(item => {
                appList.removeChild(item)
            })
            weatherList.classList.add('weather-list--active');
            weatherPart.classList.remove('weather-part--active');
            hourForecastBtn.innerText = 'Go back to current forecast'
        }else {
            weatherList.classList.remove('weather-list--active');
            weatherPart.classList.add('weather-part--active');
            hourForecastBtn.innerText = 'See Hourly Forecast'
            hourForecastBtn.classList.remove('btnActive');
        }
    })
}


async function requestApi2(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=10&appid=${apikey}`);
        const data = await res.json();

        handleData(data.list)
    }
    catch(error) {
        console.log(`error: ${error.message}`);
    }
}

function handleData (datalist) {
    datalist.forEach((dat) => {
        const li = document.createElement('li');
        li.classList.add('app__list-item');
        const img = document.createElement('img');
        const spanHumid = document.createElement('span');
        const spanTemp = document.createElement('span');
        const spanDate = document.createElement('span');
        spanHumid.classList.add('bxs-droplet-half', 'bx');
        spanTemp.classList.add('bxs-thermometer', 'bx');
        spanDate.classList.add('span__date');

        const temperature = Math.floor(dat.main.temp)
        const humidity = dat.main.humidity;
        const date = dat.dt_txt;
        const {description, id} = dat.weather[0];

        checkWeatherId(id,img)
   

        spanHumid.innerText= `${humidity}`;
        spanTemp.innerText= `${temperature}°`
        spanDate.innerText = `${date.substring(11,19)}`

        li.appendChild(spanDate);
        li.appendChild(spanTemp);
        li.appendChild(spanHumid);
        li.appendChild(img)
        appList.appendChild(li)
    });
    
    // const weatherHour =  datalist.map((item, index) => {
    //     const img = document.createElement('img');

    //     return `<div class=content>
    //                 <span class='span__date'>${item.dt_txt.substring(11,19)}</span>
    //                 <span class='bx bxs-thermometer'>${Math.floor(item.main.temp)}</span>
    //                 <span class='bx bxs-droplet-half'>${item.main.humidity}</span>
    //             </div>`
    //             });

    // appList.innerHTML = weatherHour.join('');
  
}

seeHourlyForecast();