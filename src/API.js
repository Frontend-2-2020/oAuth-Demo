import axios from "axios";

// Ik heb er voor gekozen om enkele dingen apart te trekken, omdat je die wel op verschillende plekken zou kunnen nodig
// hebben, bijvoorbeeld de naam onder welke key we de token opslaan in localstorage, en uiteindelijk onze token.
export const LOCALSTORAGE_KEY = "DEMO_LOGIN_OAUTHTOKEN";
export const TOKEN = window.localStorage.getItem(LOCALSTORAGE_KEY);

// Hier maken we onze eigen versie/instance van axios. Voordeel hiervan is dat we bijvoorbeeld de baseURL kunnen instellen
export const API = axios.create({
    baseURL: 'https://eindwerk.jnnck.be/',
});

if(TOKEN){
    // Als we op pageload een token gevonden hebben in localstorage, dan gaan we die onmiddellijk gaan instellen op onze
    // eigen axios instance
    API.defaults.headers.common['Authorization'] = 'Bearer ' + TOKEN;
}