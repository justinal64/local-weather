'use strict';

function addTodo(apiKeys, newItem){
    return new Promise((resolve, reject) => {
        $.ajax({
            method:  'POST',
            url:`${apiKeys.databaseURL}/items.json`,
            data: JSON.stringify(newItem),
            dataType: 'json'
          }).then((response) => {
            resolve(response);
          }, (error) => {
            reject(error);
        });
    });
}

function deleteTodo(apiKeys, id){
    return new Promise((resolve, reject) => {
        $.ajax({
            method:  'DELETE',
            url:`${apiKeys.databaseURL}/items/${id}.json`
            }).then((response) => {
            resolve(response);
            }, (error) => {
            reject(error);
        });
    });
}

function editTodo(apiKeys, itemId, editedItem){
    return new Promise((resolve, reject) => {
    $.ajax({
        method:  'PUT',
        url:`${apiKeys.databaseURL}/items/${itemId}.json`,
        data: JSON.stringify(editedItem),
        dataType: 'json'
        }).then((response) => {
        resolve(response);
        }, (error) => {
            reject(error);
        });
    });
}

function getTodos(apiKeys){
    return new Promise((resolve, reject) => {
        $.ajax({
            method:  'GET',
            url:`${apiKeys.databaseURL}/items.json`
        }).then((response) => {
            let items = [];
            Object.keys(response).forEach(function(key){
            response[key].id = key;
            items.push(response[key]);
            });
            resolve(items);
        }, (error) => {
            reject(error);
        });
    });
}

let todo = {
  addTodo, deleteTodo, editTodo, getTodos
};

module.exports = todo;