const API_KEY = "c8638ef8f4353b8775ae0b0cb1d979a3";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

const hourly = document.getElementById("hourly");
const forecast = document.getElementById("forecast");
const ai = document.getElementById("ai");

const loader = document.getElementById("loader");


searchBtn.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", e=>{
if(e.key==="Enter") searchWeather();
});


async function searchWeather(){

const city = cityInput.value.trim();

if(!city) return;

loader.classList.remove("hidden");

try{

const encodedCity = encodeURIComponent(city);

const weatherURL =
`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`;

const res = await fetch(weatherURL);
const data = await res.json();

if(res.status !== 200){
alert("City not found");
loader.classList.add("hidden");
return;
}

displayCurrent(data);
generateAI(data);

await loadForecast(encodedCity);

}
catch(err){
console.error(err);
alert("Weather loading failed");
}

loader.classList.add("hidden");

}


function displayCurrent(data){

cityName.textContent = data.name;

temp.textContent = Math.round(data.main.temp) + "°C";

condition.textContent = data.weather[0].description;

humidity.textContent = data.main.humidity + "%";

wind.textContent = data.wind.speed + " km/h";

icon.src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


const feelsLikeEl = document.getElementById("feelsLike");
const visibilityEl = document.getElementById("visibility");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

if(feelsLikeEl){
feelsLikeEl.innerText = Math.round(data.main.feels_like) + "°C";
}

if(visibilityEl){
visibilityEl.innerText = (data.visibility / 1000) + " km";
}

const sunriseTime = new Date(data.sys.sunrise * 1000);
const sunsetTime = new Date(data.sys.sunset * 1000);

if(sunriseEl){
sunriseEl.innerText =
sunriseTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

if(sunsetEl){
sunsetEl.innerText =
sunsetTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

}

async function loadForecast(city){

const url =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

const res = await fetch(url);
const data = await res.json();

renderHourly(data.list);
renderDays(data.list);

}


function renderHourly(list){

hourly.innerHTML="";

list.slice(0,6).forEach(item=>{

const hour = new Date(item.dt*1000).getHours();

const el=document.createElement("div");

el.className="hour";

el.innerHTML=`
<p>${hour}:00</p>
<p>${Math.round(item.main.temp)}°</p>
`;

hourly.appendChild(el);

});

}


function renderDays(list){

forecast.innerHTML="";

for(let i=0;i<list.length;i+=8){

const item=list[i];

const date=new Date(item.dt*1000);

const el=document.createElement("div");

el.className="day";

el.innerHTML=`
<p>${date.toLocaleDateString("en",{weekday:"short"})}</p>
<p>${Math.round(item.main.temp)}°</p>
`;

forecast.appendChild(el);

}

}


function generateAI(data){

const weather = data.weather[0].main;
const t = data.main.temp;

let text="";

if(weather==="Clear")
text="Clear skies. Great weather for outdoor activities.";

else if(weather==="Clouds")
text="Cloudy weather expected today.";

else if(weather==="Rain")
text="Rain likely today. Consider carrying an umbrella.";

else if(weather==="Snow")
text="Snowfall conditions detected.";

else
text="Moderate weather conditions.";

text += ` Temperature is ${Math.round(t)}°C.`;

ai.textContent = text;

}const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const centerX=rect.width/2;

const centerY=rect.height/2;

const rotateX=(y-centerY)/15;

const rotateY=(centerX-x)/15;

card.style.transform=`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="rotateX(0) rotateY(0)";

});

});
const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("click",()=>{

document.body.classList.toggle("light-mode");

if(document.body.classList.contains("light-mode")){
modeToggle.innerText="☀️";
}else{
modeToggle.innerText="🌙";
}

});