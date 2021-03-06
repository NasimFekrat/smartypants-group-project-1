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

            coffeeFetcher: inputCoffeeFetcher,
            destination: inputDestination,

        };

        // Uploads New Input data to the database


        database.ref("fetchers").push(coffeeFetcherInputs);


        $("#coffee-fetcher").val("");
        $("#coffee-destination").val("");

        //$(".fetchers").prop("disabled", true); 

        timer();
    });
    
    // Button to add Coffee Receivers
    $(".receiver-button").on("click", function(event) {
        event.preventDefault();


        // Grabs user input
        inputCoffeeReceiver =$("#coffee-receiver").val().trim();
        inputCoffeeOrder = $("#coffee-order").val().trim();


        // Creates local "temporary" object for holding Coffee Receiver data
        var coffeeReceiverInputs = {

            coffeeReceiver: inputCoffeeReceiver,
            coffeeOrder: inputCoffeeOrder,

        };

        // Uploads New Input data to the database


        database.ref("receivers").push(coffeeReceiverInputs);

        $("#coffee-receiver").val("");
        $("#coffee-order").val("");

    });

    // 3. Create Firebase event for adding Coffee Receiver and Fetcher Inputs to the database and a row in the html when a user adds an entry

    database.ref("fetchers").on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        inputCoffeeFetcher = childSnapshot.val().coffeeFetcher;
        inputDestination = childSnapshot.val().destination;

        var newRow = $("<tr>").append(
            $("<td>").text(inputCoffeeFetcher),
            $("<td>").text(inputDestination)
        )

        $(".fetchers > tbody").append(newRow);

    });

    database.ref("receivers").on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        inputCoffeeReceiver = childSnapshot.val().coffeeReceiver;
        inputCoffeeOrder = childSnapshot.val().coffeeOrder;


        var newRow = $("<tr>").append(
            $("<td>").text(inputCoffeeReceiver),
            $("<td>").text(inputCoffeeOrder),
        )

        $(".receivers > tbody").append(newRow);
    });

    function timer(){
        //order submission countdown
        function formatTime(seconds) {
            var m = Math.floor(seconds / 60) % 60;
            var s = seconds % 60;
            if (m < 10) m = "0" + m;
            if (s < 10) s = "0" + s;
            return m + ":" + s;
        }

        var count = 300; // 70
        var counter = setInterval(countdown, 1000);

        function countdown() {
            count--;
            if (count < 0) {
                clearInterval(counter);
                // remove fetcher from DB once time is up
                var rootRefReceivers = firebase.database().ref().child("receivers");
                rootRefReceivers.remove();
                var rootRefFetchers = firebase.database().ref().child("fetchers");
                rootRefFetchers.remove();
                $(".timer").text('times up! Please do not order anymore!');                

                
            } else {
                $(".timer").html("You have " + formatTime(count) + " to request your order!");
            }
        };
        countdown();
    };


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


    //Google Maps API interactions ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    var map; // the actual map object
    var infoBubble; //the bubbles that will pop up when markers are clicked

    var request;
    var service;
    var markers = []; //array to be filled with marker objects created by the createMarker function

    function initialize() {
        var center = new google.maps.LatLng(43.660781, -79.396785);
        map = new google.maps.Map(document.getElementById('coffee-map'), {
            center: center,
            zoom: 15
        });

        request = { //request object with key-values formatted as needed for a successful query to the google api
            location: center, //references our "center" var
            radius: 1000, //meter-radius in which we want it to retrieve data on places 
            types: ['cafe'] //string the api needs to look for coffee shops
        };

        infoBubble = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map); // 'Places' is google's service with all the data(names, addresses, etc) on.... places
    
        service.nearbySearch(request, callback); //nearbySearch is a method in the places library, which accepts our 'request' var as an argument here
    
        google.maps.event.addListener(map, 'rightclick', function(event) {
            map.setCenter(event.latLng)
            clearResults(markers);
            var newMarker = new google.maps.Marker({ //set a new flag icon wherever the center is moved to
                position: event.latLng,
                map: map,
                icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            });

            var request = { 
                location: event.latLng, //instead of the default center, location will be the lat && lng coords returns on the rightclick event
                radius: 1000, 
                types: ['cafe']
            };
            service.nearbySearch(request, callback);
        })

    }

     function callback(results, status) {
         if(status == google.maps.places.PlacesServiceStatus.OK){ 
             for (var m = 0; m < results.length; m++){
                 markers.push(createMarker(results[m])); // fill the markers array with objects from createMarker, if the status of the results is OK
             }   
         }
     }


    function createMarker(place) { 
         var marker = new google.maps.Marker({ //creates the actual markers for placement on the map 
             map: map,
             position: place.geometry.location
         });

         google.maps.event.addListener(marker, 'click', function(){ //add a listener to each marker on creation so clicking on it will open an info bubble

            var isOpen; // a string set by this if-else based on google's "open_now" boolean in the "opening hours" key of the place object
                if (place.opening_hours.open_now == true) 
                {
                    isOpen = "Open now." // the message that will go in the info-bubble if the place is open
                }
                else 
                {
                    isOpen = "Closed now." // ditto, if closed
                }
            
            $("#coffee-destination").val(place.name + " (" + place.vicinity + ")"); //when the marker for a shop is clicked, the destination form input automatically fills with the name of the shop
            console.log(place.name + " selected.");

            var placeData = [place.name + ", </br>", place.vicinity + "</br>", isOpen]; // short array of data we want to show the user about the cafe when it's clicked
            infoBubble.setContent(placeData[0] + placeData[1] + placeData[2]); //set the bubble to show the cafe's name, address and open/closed status
            infoBubble.open(map, this);
            console.log(place);
            
         });
         return marker;
    }

    function createMyhalMarker(){ //function to set a unique marker for the myhal building at center of map

        var myhalMarker = new google.maps.Marker({
            position:{lat:43.660781,lng:-79.396785},
            map: map,
            icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' //a flag, instead of the standard marker icon
        });

        google.maps.event.addListener(myhalMarker, 'click', function(){ //add a listener to this marker on creation so clicking on it will open an info bubble

            infoBubble.setContent("Myhal Centre For Engineering</br> Innovation & Entrepreneruship, </br> 55 St. George St, Toronto ON"); //bubble hard-coded with name && address
            infoBubble.open(map, this);
        });
    }
   

    function clearResults(markers) { //clears the markers array for re-populating with new markers when a new center is set
         for (var m in markers) {
             markers[m].setMap(null)
         }
         markers = [];
     }


    initialize(); //function called on page load
    createMyhalMarker();
    
}); //end of docready function

