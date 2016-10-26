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

I don't know how to do this yet....
An affordance to view the forecast for the current day, the next three days, or the next 7 days

*/

let $zipCode = $('#zip-code');
let $submit = $('#submit');

$submit.click(() => {
    console.log("zipCode.length = ", $zipCode.val().length);
    let result = valZip($zipCode.val());
    if(result) {
        // Execute promise and return results

    } else {
        // display tooltip that says why the user can't procede

    }
});

function valZip(zip) {
    if(zip.length === 5 && $.isNumeric(zip)) {
        console.log("$zipCode is 5 chars and is numeric");
        return true;
    } else {
        console.log("not valid");
        return false;
    }
}

