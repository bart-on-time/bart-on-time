/* 
data to store:
	trip name
	origin station
	destination station

	database url


*/


// Initialize Firebase
var config = {
	apiKey: "AIzaSyBS6nowOI7CgfhnS-hM3A5BUxh58k7NdVo",
	authDomain: "test-d1af2.firebaseapp.com",
	databaseURL: "https://test-d1af2.firebaseio.com",
	storageBucket: "test-d1af2.appspot.com",
	messagingSenderId: "395340255814"
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
	origin = $(".origin-selection").val().trim();
	console.log(origin);
	destination = $(".destination-selection").val().trim();
	departStart = $("#departStart-input").val().trim();
	departEnd = $("#departEnd-input").val().trim();
	travelMode = $(".travelMode-selection").val().trim();
	//dayOfWeek = $("#myselect").val();

	// save to firebase
	database.ref().push({
		tripName: tripName,
		origin: origin,
		destination: destination,
		departStart: departStart,
		departEnd: departEnd,
		travelMode: travelMode
	});
});
/////////////////////////////////


// add list of trips to phase I 
database.ref().on("child_added", function(childSnapshot) {
// Change the HTML to reflect
	console.log("child: " + childSnapshot.val().tripName );
	$("#trips").append(childSnapshot.val().tripName);
});
// /////////////////////////////////

//// will be loaded on page load ////
$(document).ready(function() {
	showSection(phase1);
});
/////////////////////////////////


