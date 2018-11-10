$(document).ready(function(){
     

    
    // connection to our firebase database
    var config = {
        apiKey: "AIzaSyDqFP7koygUVZ_6fKkTfW1NvjhhZNPye7s",
        authDomain: "coffee-finder-app.firebaseapp.com",
        databaseURL: "https://coffee-finder-app.firebaseio.com/", 
        storageBucket: "coffee-finder-app.appspot.com"
      };
  
    firebase.initializeApp(config);

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
$("#coffeeFetcher-button").on("click", function(event) {
    event.preventDefault();


// Grabs user input
inputCoffeeFetcher = $("#coffee-fetcher").val().trim();
inputDestination =$("#coffee-destination").val().trim();

// Creates local "temporary" object for holding Coffee Receiver data

  var CoffeeFetcherInputs = {

    CoffeeFetcher : inputCoffeeFetcher,
    Destination : inputDestination,

  };

  // Uploads New Input data to the database

database.ref().push(CoffeeFetcherInputs);
    console.log(CoffeeFetcherInputs.name);

$("coffee-fetcher").val("");
$("coffee-destination").val("");


});



// Button to add Coffee Receivers
$("#coffeeReceiver-button").on("click", function(event) {
    event.preventDefault();


// Grabs user input
inputCoffeeReceiver =$("#coffee-receiver").val().trim();
inputCoffeeOrder = $("#coffee-order").val().trim();


// Creates local "temporary" object for holding Coffee Receiver data

var CoffeeReceiverInputs = {

    CoffeeReceiver : inputCoffeeReceiver,
    CoffeeOrder : inputCoffeeOrder,

  };

  // Uploads New Input data to the database

database.ref().push(CoffeeReceiverInputs);
    console.log(CoffeeReceiverInputs.name);

$("coffee-fetcher").val("");
$("coffee-destination").val("");

});


// 3. Create Firebase event for adding Coffee Receiver and Fetcher Inputs to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
     inputCoffeeFetcher = childSnapshot.val().CoffeeFetcher;
     inputCoffeeReceiver = childSnapshot.val().CoffeeReceiver;
     inputDestination = childSnapshot.val().Destination;
     inputCoffeeOrder = childSnapshot.val().CoffeeOrder;


     var newRow = $("<tr>").append(
        $("<td>").text(inputCoffeeFetcher),
        $("<td>").text(inputCoffeeReceiver),
        $("<td>").text(inputCoffeeOrder),
        $("<td>").text(inputDestination),
    )

    $("#trainTable >tbody").append(newRow);


});

}); // end of docready function