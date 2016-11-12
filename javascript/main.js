"use strict";
/*given a user has entered in some text into the zip code field
when the user presses the enter key
or the user clicks the submit button
then the value should be validated as a zip code (5 digit number)*/

/*given the user has entered a valid zip code
when the user presses the enter key
or clicks the submit button
then the current weather for the provided zip code should be displayed, which includes

1. Temperature
2. Conditions
3. Air pressure
4. Wind speed


An affordance to view the forecast for the current day, the next three days, or the next 7 days

*/

let fbAuth = require("./Auth/FirebaseAuth");
let Credentials = require("./Credentials/Credentials");
let todos = require("./Todo/Todo");
let User = require("./FBUser/User");
let Weather = require("./Openweather/Openweather");

let openweather = {};
let $zipCode = $('#zip-code');
let $oneDay = $('#oneday');
let $output = $('#output');
let dataArray = {};
let apiKeys = {};
let firebaseCred = {};
let openweatherCred = {};
let uid = "";

console.log("fbAuth", fbAuth);
console.log("Credentials", Credentials);
console.log("todos", todos);
console.log("user", User);
console.log("Weather", Weather);




// let credentials = () => {
//   return new Promise ((resolve, reject) => {
//     $.ajax({
//       method: 'GET',
//       url: 'apiKeys.json'
//     }).then((response) => {
//         firebaseCred = response.firebase;
//         openweatherCred = response.openweather;
//         console.log("firebaseCred", firebaseCred);
//         console.log("openweatherCred", openweatherCred);
//       apiKeys = response; // Do I need this???
//       resolve(response);
//       // $.ajax({
//       //   method: 'GET',
//       //   // headers:{
//       //   //   'Authorization': authHeader
//       //   // },
//       //   url: `http://api.openweathermap.org/data/2.5/weather?zip=${searchText}&units=imperial&APPID=${openweatherCred.Key}`
//       // }).then((response2)=>{
//       //   // console.log("response2", response2.list);
//       //   dataArray = response2;
//       //   displayData(dataArray);
//       //   resolve(response2);
//       // }, (errorResponse2) => {
//       //   reject(errorResponse2);
//       // });
//     }, (errorResponse) =>{
//       reject(errorResponse);
//     });
//   });
// };

// Get credentials on page load
// credentials();

// eventListeners for Login/Register Buttons
$('#loginButton').on("click", function() {
    let user = {
        "email": $('#inputEmail').val(),
        "password": $('#inputPassword').val()
    };
    fbAuth.loginUser(user).then(function(loginResponse) {
        console.log("loginResponse", loginResponse);
        uid = loginResponse.uid;
        createLogoutButton();
        $('#login-container').addClass("hide");
        $('.zip').removeClass("hidden");
    });
});

// Register User
$('#registerButton').on("click", function() {
    let username = $('#inputUsername').val();
    let user = {
        "email": $('#inputEmail').val(),
        "password": $('#inputPassword').val()
    };

    fbAuth.registerUser(user).then(function(registerResponse) {
        console.log("register response", registerResponse);
        let uid = registerResponse;
        let newUser = {
            "username": username,
            "uid": registerResponse.uid
        };
        return User.addUser(Credentials.fbCreds(), newUser);
    }).then(function(addUserResponse) {

        return fbAuth.loginUser(user);
    }).then(function(loginResponse) {
        console.log("loginResponse", loginResponse);
        uid = loginResponse.uid;
        // createLogoutButton();
        // putTodoInDOM();
        $('#login-container').addClass("hide");
        $('.zip').removeClass("hidden");
    });
});

function createLogoutButton() {
    User.getUser(Credentials.fbCreds(), uid).then(function(userResponse) {
        $('#logout-container').html("");
        let currentUsername = userResponse.username;
        let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
        $('#logout-container').append(logoutButton);
    });
}
// Get firebase and openweather keys
$(document).ready(function(){
    Credentials.credentials().then(function(keys){
        apiKeys = keys;
        openweatherCred = keys.openweather;
        firebaseCred = keys.firebase;
        firebase.initializeApp(firebaseCred);
    });
});

// eventListener on the submit button
// Better way to do onEnter and onClick of a button/input????
$oneDay.click(() => {
    let $zipEntered = $zipCode.val();
    let result = valZip($zipEntered);
    let owCredentialds = Credentials.owCreds();
    if(result) {
        // weatherList($zipEntered);
        // FbAPI.getMovie(apiKeys, itemId).then((movie) => {
        Weather.weatherOneDay(owCredentialds, $zipEntered).then((weatherOneDay) => {
            console.log("weatherOneDay", weatherOneDay);
            // Display the response in the dom
            displayData(weatherOneDay);
        });
        // remove the hidden class for the output area
        $output.removeClass( "hidden" );
    } else {
        // display tooltip that says why the user can't procede
    }
});

// eventListener for save button
$(document).on('click', '.save-button', (e) => {
    // trying to get the data from all the field to store in db
    // THIS IS WHAT I AM CURRENTLY WORKING ON
    let gatherData = e.target.parentElement.parentElement;
    let test = $(gatherData, "#country");
    console.log("test", test);
    // weather = {
    //     "name": response.Title,
    //     "year": response.Year,
    //     "actors": Actors,
    //     "rating": Math.round(parseFloat(response.imdbRating) / 2),
    //     "imdbID": response.imdbID
    // };

    // console.log("e", e.target.parentElement.parentElement);
});

// When the user hits enter in the input field.
// this isn't very dry code.
$zipCode.keypress(function (e) {
    if (e.which === 13) {
        let $zipEntered = $zipCode.val();
        let result = valZip($zipEntered);
        if(result) {
            // weatherList($zipEntered);
            Weather.weatherOneDay(openweatherCred, $zipEntered);
            // remove the hidden class for the output area
            $output.removeClass("hidden");
        } else {
            // display tooltip that says why the user can't proceed
            // not working...
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
});

// Add data to the dom
// I will probably need to convert this to a foreach loop.
function displayData(data) {
    let html = "<div class='row'>";
        html += `<div class="col-md-2" id="county" data-name="${data.name}"><strong>County Name:</strong><p>${data.name}</p></div>`;
        html += `<div class="col-md-2" id="temp" data-temp="${data.main.temp}"><strong>Temperature:</strong><p>${data.main.temp}</p></div>`;
        html += `<div class="col-md-2" id="desc" data-desc="${data.weather[0].description}"><strong>Description:</strong><p>${data.weather[0].description}</p></div>`;
        html += `<div class="col-md-2" id="pressure" data-pressure="${data.main.pressure}"><strong>Air Pressure:</strong><p>${data.main.pressure}</p></div>`;
        html += `<div class="col-md-2" id="speed" data-speed="${data.wind.speed}"><strong>Wind Speed:</strong><p>${data.wind.speed}</p></div>`;
        html += `<div><button class="btn btn-lg btn-success col-md-1 save-button">Save</button></div>`;
    html += "</div>";
    $('#output').append(html);
    // $('#county-name').append(`<p>${data.name}</p>`);
    // $('#current-temp').append(`<p>${data.main.temp}</p>`);
    // $('#conditions').append(`<p>${data.weather[0].description}</p>`);
    // $('#pressure').append(`<p>${data.main.pressure}</p>`);
    // $('#wind-speed').append(`<p>${data.wind.speed}</p>`);
    // $('.save-button').append(`<div><button class="btn btn-lg btn-success col-xs-6" id="loginButton">Save</button></div>`);
}

// validates the user input field
function valZip(zip) {
    // This checks for 5 chars and also checks if all characters are numeric
    if(zip.length === 5 && $.isNumeric(zip)) {
        return true;
    } else {
        return false;
    }
}


