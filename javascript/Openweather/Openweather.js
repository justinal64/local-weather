"use strict";

let dataArray = {};

function weatherOneDay(apiKeys, searchText) {
  return new Promise ((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${searchText}&units=imperial&APPID=${apiKeys.Key}`
      }).then((response2)=>{
        resolve(response2);
      }, (errorResponse2) => {
        reject(errorResponse2);
      });
    });
}

let weather = {
  weatherOneDay
};

module.exports = weather;



