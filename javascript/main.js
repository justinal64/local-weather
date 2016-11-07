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
        return User.addUser(apiKeys, newUser);
    }).then(function(addUserResponse) {

        return fbAuth.loginUser(user);
    }).then(function(loginResponse) {
        console.log("loginResponse", loginResponse);
        uid = loginResponse.uid;
        // createLogoutButton();
        // putTodoInDOM();
        $('#login-container').addClass("hide");
        $('#todo-container').removeClass("hide");
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

$(document).ready(function(){
    Credentials.credentials().then(function(keys){
        console.log("keys", keys);
        apiKeys = keys;
        firebase.initializeApp(apiKeys.firebase);
    });
});

// // eventListener on the submit button
// // Better way to do onEnter and onClick of a button/input????
// $oneDay.click(() => {
//     let $zipEntered = $zipCode.val();
//     let result = valZip($zipEntered);
//     if(result) {
//         weatherList($zipEntered);
//         // remove the hidden class for the output area
//         $output.removeClass( "hidden" );
//     } else {
//         // display tooltip that says why the user can't procede
//     }
// });

// // When the user hits enter in the input field.
// // this isn't very dry code.
// $zipCode.keypress(function (e) {
//     if (e.which == 13) {
//         let $zipEntered = $zipCode.val();
//         let result = valZip($zipEntered);
//         if(result) {
//             weatherList($zipEntered);
//             // remove the hidden class for the output area
//             $output.removeClass("hidden");
//         } else {
//             // display tooltip that says why the user can't proceed
//             // not working...
//             $('[data-toggle="tooltip"]').tooltip();
//         }
//     }
// });

// function displayData(data) {
//     // write each one to the dom
//     console.log("data", data);

//     $('#county-name').append(`<p>${data.name}</p>`);
//     $('#current-temp').append(`<p>${data.main.temp}</p>`);
//     $('#conditions').append(`<p>${data.weather[0].description}</p>`);
//     $('#pressure').append(`<p>${data.main.pressure}</p>`);
//     $('#wind-speed').append(`<p>${data.wind.speed}</p>`);
// }

// // validates the user input field
// function valZip(zip) {
//     // This checks for 5 chars and also checks if all characters are numeric
//     if(zip.length === 5 && $.isNumeric(zip)) {
//         return true;
//     } else {
//         return false;
//     }
// }


