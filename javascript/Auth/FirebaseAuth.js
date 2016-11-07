'use strict';

function loginUser(credentials){
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then((authData) =>{
          resolve(authData);
        })
        .catch((error)=>{
          reject(error);
        });
    });
}

function credentialsCurrentUser(){
    return firebase.auth().currentUser;
}

function logoutUser(){
    firebase.auth().signOut();
}

function registerUser(credentials){
    console.log("credentials", credentials);
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then((authData) =>{
          resolve(authData);
        })
        .catch((error)=>{
          reject(error);
        });
    });
}

let fbAuth = {
  registerUser, loginUser, logoutUser, credentialsCurrentUser
};

module.exports = fbAuth;
