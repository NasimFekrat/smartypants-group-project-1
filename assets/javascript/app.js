function initMap() {
    var myhalCoords = {lat:43.660781, lng: -79.396785}; //coordinates of the myhal building
     
    //map options
    var options = {
        zoom: 17,
        center: myhalCoords
    } 
    
    //map object
    var coffeeMap = new google.maps.Map(document.getElementById('coffee-map'), options);
 
    var myhalMarker = new google.maps.Marker({ //this one will appear by default
        
     });
    

   //new, dynamic add marker function DEFINITION
   function addMarker(props) {
         var marker = new google.maps.Marker({
             position: props.coords,
             map: coffeeMap,
             content: props.content
         });
         
         //as recommended by docs, check for a custom icon using an if statement so we don't get a potential 'undefined' by having it in the main marker definition
         if(props.iconImage){
             //set icon image
             marker.setIcon(props.iconImage);
         }
         
         //check for content
         if(props.content){
             var contentBubble = new google.maps.InfoWindow({ //a bubble with content inside
                 content: props.content
             });

             marker.addListener('click', function(){ //a click function on the "marker" var in the coffeeMap object, which opens the "contentBubble" var
                 contentBubble.open(coffeeMap, marker);
             });

             console.log(props.content);
         }

         console.log(props.content);
    }
    
 }
  

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


      //GOOGLE MAPS implementation - - - - - - - -
      console.log("Hello, Jerry");

      //example calls:
   addMarker({
    coords:{lat:43.660781, lng: -79.397985},
    content: '<h3>Nearby Building</h3>' 
});


addMarker({
      coords: myhalCoords,
      iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      content: '<h3>Myhal Building</h3>'
});
      
}); // end of docready function