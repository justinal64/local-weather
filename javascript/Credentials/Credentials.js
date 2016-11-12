'use strict';
let firebaseCred = {};
let openweatherCred = {};


function credentials() {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'GET',
            url: `../../apiKeys.json`
        }).then((response)=>{
            console.log("response", response);
            firebaseCred = response.firebase;
            openweatherCred = response.openweather;
            console.log("firebaseCred", firebaseCred);
            console.log("openweatherCred", openweatherCred);
            resolve(response);
        }, (error)=>{
            reject(error);
        });
    });
}

function fbCreds() {
    return firebaseCred;
}

function owCreds() {
    return openweatherCred;
}

let Credentials = {
  credentials, fbCreds, owCreds
};

module.exports = Credentials;