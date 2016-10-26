"use strict";
/*given a user has entered in some text into the zip code field
when the user presses the enter key
or the user clicks the submit button
then the value should be validated as a zip code (5 digit number)*/

/*given the user has entered a valid zip code
when the user presses the enter key
or clicks the submit button
then the current weather for the provided zip code should be displayed, which includes

1. Temperature Done
2. Conditions Done
3. Air pressure
4. Wind speed

I don't know how to do this yet....
An affordance to view the forecast for the current day, the next three days, or the next 7 days

*/

let $zipCode = $('#zip-code');
let $submit = $('#submit');

let dataArray = {};
let apiKeys = {};

let weatherList = (searchText) => {
  return new Promise ((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: 'apiKeys.json'
    }).then((response) => {
      apiKeys = response;
      // console.log("apiKeys", apiKeys);
      let authKey = apiKeys.Key;
      // console.log("authKey", authKey);
      $.ajax({
        method: 'GET',
        // headers:{
        //   'Authorization': authHeader
        // },
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${searchText}&units=imperial&APPID=${authKey}`
      }).then((response2)=>{
        // console.log("response2", response2.list);
        dataArray = response2;
        displayData(dataArray);
        resolve(response2);
      }, (errorResponse2) => {
        reject(errorResponse2);
      });
    }, (errorResponse) =>{
      reject(errorResponse);
    });
  });
};


// eventListener on the submit button
// Better way to do on Enter and on Click of a button????
$submit.click(() => {
    let $zipEntered = $zipCode.val();
    let result = valZip($zipEntered);
    if(result) {
        weatherList($zipEntered);
        // Execute promise and return results

    } else {
        // display tooltip that says why the user can't procede
    }
});

// When the user hits enter in the input field.
// this isn't very dry code.
$zipCode.keypress(function (e) {
    if (e.which == 13) {
        let $zipEntered = $zipCode.val();
        let result = valZip($zipEntered);
        if(result) {
            weatherList($zipEntered);
            // Execute promise and return results

        } else {
            // display tooltip that says why the user can't procede

        }
    }
});

function displayData(data) {
    // write each one to the dom
    console.log("data", data);
    // console.log("data.city.name", data.city.name);
    $('#output').append(`<p><strong>County Name:</strong> ${data.name}</p>`);
    $('#output').append(`<p><strong>Current Temperature:</strong> ${data.main.temp}</p>`);
    $('#output').append(`<p><strong>Conditions:</strong> ${data.weather[0].description}</p>`);
    $('#output').append(`<p><strong>Pressure:</strong> ${data.main.pressure}</p>`);
    $('#output').append(`<p><strong>Wind Speed:</strong> ${data.wind.speed}</p>`);
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


