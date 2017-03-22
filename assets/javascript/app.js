/* 
data to store:
	trip name
	origin station
	destination station

	database url


*/


// Initialize Firebase
var config = {
	apiKey: "AIzaSyCNU5CN43KJZiTfFgMCIpWPMLBIiVUQ8Fo",
	authDomain: "bart-on-time.firebaseapp.com",
	databaseURL: "https://bart-on-time.firebaseio.com",
	storageBucket: "bart-on-time.appspot.com",
	messagingSenderId: "258285045447"
};

firebase.initializeApp(config);
var database = firebase.database();


//// vars ////
var phase1 = $("#phase1");
var phase2 = $("#phase2");
var phase3a = $("#phase3a");
var phase3b = $("#phase3b");

var tripName;
var origin;
var destination;
var departStart;
var departEnd;
var travelMode;

//// phase 1: save button; stores user inputs in firebase////
function showSection(section) {
	phase1.css({'display': 'none'});
	phase2.css({'display': 'none'});
	phase3a.css({'display': 'none'});
	phase3b.css({'display': 'none'});

	if (section) {
		section.css({'display' : 'block'})
	}
}
/////////////////////////////////

//// phase 2: new trip ////
$("#new").on("click", function() {
	showSection(phase2);
});
/////////////////////////////////

//// phase 3: new trip ////
$("#save").on("click", function(event) {
	event.preventDefault();

	// Grabbed values from text boxes
	tripName = $("#tripName-input").val().trim();
	console.log(tripName);
	originCoordinates = $(".origin-selection").val().trim();
	originName = $(".origin-selection").html().trim();
	console.log(origin);
	destination = $(".destination-selection").val().trim();
	departStart = $("#departStart-input").val().trim();
	departEnd = $("#departEnd-input").val().trim();
	travelMode = $(".travelMode-selection").val().trim();
	//dayOfWeek = $("#myselect").val();

	// save to firebase
	database.ref().push({
		tripName: tripName,
		originCoordinates: originCoordinates,
		originName: originName,
		destination: destination,
		departStart: departStart,
		departEnd: departEnd,
		travelMode: travelMode
	});
});
/////////////////////////////////

// Fires when trip selected.
function addTripClickListener() {
	$(".clickable-row").on("click", function() {
        var tripId = $(this).children('.trip-id').text();
        console.log("You clicked on this trip: " + tripId);
        showSection(phase3a);
    });
};

function addSaveTripListener() {
	$("#save").click(function() {
        showSection(phase3a);
    });
}

// add list of trips to phase I 
database.ref().on("child_added", function(snapshot) {
// Change the HTML to reflect
	console.log("child: " + snapshot.val().tripName );
	// Build up train table in DOM.
	$("#trips").append("<tr class='clickable-row'>" +
						  "<th class='trip-id'>" + snapshot.getKey() + "</th>" +
	                      "<th>" + snapshot.val().tripName + "</th>" +
	                      "<th>" + snapshot.val().originName + "</th>" +
	                      "<th>" + snapshot.val().departStart + "</th>" +
	                    "</tr>");

	// Listens for trip click event.
	addTripClickListener();
});
// /////////////////////////////////

//// will be loaded on page load ////
$(document).ready(function() {
	showSection(phase1);

	// Listens for trip click event.
	addTripClickListener();
});
/////////////////////////////////


