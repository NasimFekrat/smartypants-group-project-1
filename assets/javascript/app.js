$(document).ready(function(){

    // connection to our firebase database
    var config = {
        apiKey: "AIzaSyDqFP7koygUVZ_6fKkTfW1NvjhhZNPye7s",
        authDomain: "coffee-finder-app.firebaseapp.com",
        databaseURL: "https://coffee-finder-app.firebaseio.com/", 
        storageBucket: "coffee-finder-app.appspot.com"
    };

    firebase.initializeApp(config);

    //test our js file is loading:
    console.log("Hello, Newman");

    var database = firebase.database();

    //api key for openweathernetwork
    var APIKey = "2aacadc69f5b8add90497de8f4f7fc24";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Toronto,Canada&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

    // Log the queryURL
    console.log(queryURL);

    // Log the resulting object
    console.log(response);
    });
        
}); // end of docready function