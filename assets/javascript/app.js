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
    var myOrder;


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

        console.log(coffeeFetcherInputs.name);

        $("#coffee-fetcher").val("");
        $("#coffee-destination").val("");

        $("form :input").attr("disabled", true);
    });

    //     coffeeFetcherInputs = {
    //     coffeeFetcher : inputCoffeeFetcher,
    //     destination : inputDestination,
    //   };
    // const ref = firebase.database().ref("");
    // return ref.orderByChild('coffeeFetcher').equalTo(coffeeFetcherInputs).once("value").then(function(emptySnapshot) {
    //   // get the key of the respective coffeeInputs
    //   const key = Object.keys(emptySnapshot.val())[0];
    //   // coffee Fetcher variable node from firebase
    //   ref.child(key).remove();
    // console.log("working");

    // });
    
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

        myOrder = database.ref("receivers").push(coffeeReceiverInputs);
        console.log(coffeeReceiverInputs.name);

        $("coffee-fetcher").val("");
        $("coffee-destination").val("");

        $("form :input").attr("disabled", true);

        timer();
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

        var count = 10; // 70
        var counter = setInterval(countdown, 1000);

        function countdown() {
            count--;
            if (count < 0) {
                clearInterval(counter);
                // remove fetcher from DB once time is up
                myOrder.remove();
                $(".timer").text('times up! order removed!');
            } else {
                $(".timer").html(formatTime(count));
            }
        };
        countdown();
    };

    // 3. Create Firebase event for adding Coffee Receiver and Fetcher Inputs to the database and a row in the html when a user adds an entry

    database.ref("fetchers").on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        inputCoffeeFetcher = childSnapshot.val().coffeeFetcher;
        inputDestination = childSnapshot.val().destination;

        var newRow = $("<tr>").append(
            $("<td>").text(inputCoffeeFetcher),
            $("<td>").text(inputCoffeeReceiver),
            $("<td>").text(inputDestination),
            $("<td>").text(inputCoffeeOrder),
        )

        $(".table.fetchers > tbody").append(newRow);


    });

    database.ref("receivers").on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        inputCoffeeReceiver = childSnapshot.val().coffeeReceiver;
        inputCoffeeOrder = childSnapshot.val().coffeeOrder;

        var newRow = $("<tr>").append(
            $("<td>").text(inputCoffeeReceiver),
            $("<td>").text(inputCoffeeOrder),
        )

        $(".table.receivers > tbody").append(newRow);
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
        //console.log(roundedTemp);

        //display the icon
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        
        $(".location").html(response.name);
        $(".temperature").html(roundedTemp + "&#8451;");
        $(".weather").html(response.weather[0].description);
        $(".display").attr("src" , iconurl);

      });    
    
});
