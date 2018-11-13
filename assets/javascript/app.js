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


    //google maps ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    var map;

    function initialize() {
        var center = new google.maps.LatLng(43.660781, -79.396785);
        map = new google.maps.Map(document.getElementById('coffee-map'), {
            center: center,
            zoom: 15
        });

        var request = { // request-format & fields that the google API needs for a successful query

            location: center, //references our "center" var
            radius: 1000, //in meters
            types: ['cafe'] //google API understands this string
        };

        var service = new google.maps.places.PlacesService(map); // 'Places' is google's service with all the data(names, addresses, etc) on.... places
    
        service.nearbySearch(request, callback); //nearbySearch is a method in the places library, which accepts our 'request' var as an argument here
    }

     function callback(results, status) {
         if(status == google.maps.places.PlacesServiceStatus.OK){
             for (var m = 0; m < results.length; m++){
                 createMarker(results[m]);
             }
         }
     }

     function createMarker(place) {
         var placeLoc = place.geometry.location;
         var marker = new google.maps.Marker({
             map: map,
             position: place.geometry.location
         })
     }

    initialize();
    
}); //end of docready function
