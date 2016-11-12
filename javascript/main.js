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
let id = 1;

console.log("fbAuth", fbAuth);
console.log("Credentials", Credentials);
console.log("todos", todos);
console.log("user", User);
console.log("Weather", Weather);

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
    // clear the dom
    $($output).html("");

    let $zipEntered = $zipCode.val();
    let result = valZip($zipEntered);
    let owCredentialds = Credentials.owCreds();
    if(result) {
        Weather.weatherOneDay(owCredentialds, $zipEntered).then((weatherOneDay) => {
        let weather = {
            "County": weatherOneDay.name,
            "Temp": weatherOneDay.main.temp,
            "Desc": weatherOneDay.weather[0].description,
            "Air_Pressure": weatherOneDay.main.pressure,
            "Wind_Speed": weatherOneDay.wind.speed,
            "uid": uid
        };

        // Display the response in the dom
        displayData(weather, "#output");
        id++;
        });
        // remove the hidden class for the output area
        $output.removeClass( "hidden" );
    } else {
        // display tooltip that says why the user can't procede
    }
});

// eventListener for save button
$(document).on('click', '.save-button', (e) => {
    let currentTarget = e.currentTarget;
    getWeather(currentTarget);
});

// eventListener for delete button
// event is firing to fast and not deleting from dom until 2nd click....
$(document).on('click', '#delete-button', (e) => {
    let idToDelete = e.currentTarget.getAttribute("data-id");
    todos.deleteTodo(firebaseCred, idToDelete).then(todos.getTodos(firebaseCred)
        .then((weatherReturned) => {
            $('#search-history').html("");
            $.each(weatherReturned, function(key, value) {
            displayData(value, "#search-history");
            console.log("test");
        });
        })
    );
});


// View saved search history
$('#saved-search').on('click', () => {
    todos.getTodos(firebaseCred).then((weatherReturned) => {
        console.log("weatherReturned", weatherReturned);
        $.each(weatherReturned, function(key, value) {
            displayData(value, "#search-history");
        });
    });

    // Show hidden search button
    $('.saved-search').removeClass("hidden");
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

// Gets data on the currently displayed forcast
function getWeather(currentTarget) {
    let weather = {
        "County": currentTarget.getAttribute("data-name"),
        "Temp": currentTarget.getAttribute("data-temp"),
        "Desc": currentTarget.getAttribute("data-desc"),
        "Air_Pressure": currentTarget.getAttribute("data-pressure"),
        "Wind_Speed": currentTarget.getAttribute("data-windspeed"),
        "uid": uid
    };
    // Add to the fb db
    todos.addTodo(firebaseCred, weather);
}

// Add data to the dom
function displayData(data, location) {
    console.log("data", data);
    let html = "<div class='row'>";
        html += `<div class="col-md-2" id="county"><strong>County Name:</strong><p>${data.County}</p></div>`;
        html += `<div class="col-md-2" id="temp"><strong>Temperature:</strong><p>${data.Temp}</p></div>`;
        html += `<div class="col-md-2" id="desc"><strong>Description:</strong><p>${data.Desc}</p></div>`;
        html += `<div class="col-md-2" id="pressure"><strong>Air Pressure:</strong><p>${data.Air_Pressure}</p></div>`;
        html += `<div class="col-md-2" id="speed"><strong>Wind Speed:</strong><p>${data.Wind_Speed}</p></div>`;
        if(location === "#output") {
            html += `<div><button class="btn btn-lg btn-success col-md-1 save-button" data-name="${data.County}" data-temp="${data.Temp}" data-desc="${data.Desc}" data-pressure="${data.Air_Pressure}" data-windspeed="${data.Wind_Speed}">Save</button></div>`;
        } else {
            html += `<div><button class="btn btn-lg btn-danger col-md-1" id="delete-button" data-id="${data.id}">Delete</button></div>`;
        }
    html += "</div>";
    $(location).append(html);
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


