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
    
    // Initial Values
    var inputCoffeeFetcher;
    var inputCoffeeReceiver;
    var inputCoffeeOrder;
    var inputDestination;


// Button to add Coffee Fetchers
$(".fetcher-button").on("click", function(event) {
    event.preventDefault();


// Grabs user input
inputCoffeeFetcher = $("#coffee-fetcher").val().trim();
inputDestination =$("#coffee-destination").val().trim();

// Creates local "temporary" object for holding Coffee Receiver data

  var coffeeFetcherInputs = {

    coffeeFetcher : inputCoffeeFetcher,
    destination : inputDestination,

  };

  // Uploads New Input data to the database

database.ref().push(coffeeFetcherInputs);
    console.log(coffeeFetcherInputs.name);

$("#coffee-fetcher").val("");
$("#coffee-destination").val("");


});



// Button to add Coffee Receivers
$(".receiver-button").on("click", function(event) {
    event.preventDefault();


// Grabs user input
inputCoffeeReceiver =$("#coffee-receiver").val().trim();
inputCoffeeOrder = $("#coffee-order").val().trim();


// Creates local "temporary" object for holding Coffee Receiver data

var coffeeReceiverInputs = {

    coffeeReceiver : inputCoffeeReceiver,
    coffeeOrder : inputCoffeeOrder,

  };

  // Uploads New Input data to the database

database.ref().push(coffeeReceiverInputs);
    console.log(coffeeReceiverInputs.name);

$("coffee-fetcher").val("");
$("coffee-destination").val("");

});


// 3. Create Firebase event for adding Coffee Receiver and Fetcher Inputs to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
     inputCoffeeFetcher = childSnapshot.val().coffeeFetcher;
     inputCoffeeReceiver = childSnapshot.val().coffeeReceiver;
     inputDestination = childSnapshot.val().destination;
     inputCoffeeOrder = childSnapshot.val().coffeeOrder;


     var newRow = $("<tr>").append(
        $("<td>").text(inputCoffeeFetcher),
        $("<td>").text(inputCoffeeReceiver),
        $("<td>").text(inputCoffeeOrder),
        $("<td>").text(inputDestination),
    )

    $(".table >tbody").append(newRow);


});

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Toronto,Canada&units=metric&appid=" + APIKey;

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
        

        // Log the resulting object
        console.log(response);

        
        //rounds temperature to interger
        var temp = response.main.temp;
        var roundedTemp = Math.round(temp);
        console.log(roundedTemp);

        //display the icon
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        
        $(".location").html(response.name);
        $(".temperature").html(roundedTemp + "&#8451;");
        $(".weather").html(response.weather[0].description);
        $(".display").attr("src" , iconurl);

      });    




}); // end of docready function