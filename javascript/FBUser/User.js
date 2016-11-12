'use strict';

function addUser(apiKeys, newUser) {
    return new Promise((resolve, reject) => {
        console.log("apiKeys", apiKeys);
        $.ajax({
            method:  'POST',
            url:`${apiKeys.databaseURL}/users.json`,
            data: JSON.stringify(newUser),
            dataType: 'json'
        }).then((response) => {
            console.log("response from POST", response);
            resolve(response);
        }, (error) => {
            reject(error);
        });
    });
}

function getUser(apiKeys, uid) {
    return new Promise((resolve, reject) => {
        $.ajax({
        method:  'GET',
        url:`${apiKeys.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`
        }).then((response) => {
            let users = [];
            Object.keys(response).forEach(function(key){
                response[key].id = key;
                users.push(response[key]);
        });
            resolve(users[0]);
        }, (error) => {
            reject(error);
        });
    });
}

let user = {
  addUser, getUser
};

module.exports = user;