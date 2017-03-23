
// Initialize Firebase
// var config = {
// 	apiKey: "AIzaSyCNU5CN43KJZiTfFgMCIpWPMLBIiVUQ8Fo",
// 	authDomain: "bart-on-time.firebaseapp.com",
// 	databaseURL: "https://bart-on-time.firebaseio.com",
// 	storageBucket: "bart-on-time.appspot.com",
// 	messagingSenderId: "258285045447"
// };
// firebase.initializeApp(config);
// var database = firebase.database();

//// meggin's fire base api ////
var config = {
	apiKey: "AIzaSyCNU5CN43KJZiTfFgMCIpWPMLBIiVUQ8Fo",
	authDomain: "bart-on-time.firebaseapp.com",
	databaseURL: "https://bart-on-time.firebaseio.com",
	storageBucket: "bart-on-time.appspot.com",
	messagingSenderId: "258285045447"
};
firebase.initializeApp(config);
var database = firebase.database();
/////////////////////////////////

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
// when user clicks edit
var editUniqueId;
var editStauts = false;
/////////////////////////////////

//// phase controller ////
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

//// phase 1: landing page list of trips ////
// will be loaded on page load 
$(document).ready(function() {
	showSection(phase1);
	// Listens for trip click event.
	addTripClickListener();
	//addSaveTripListener();
});

// Fires when trip selected.
function addTripClickListener() {
	$(".clickable-row").on("click", function() {
        var tripId = $(this).children('.trip-id').text();
        console.log("You clicked on this trip: " + tripId);
        showSection(phase3a);

        // show relevant data related to clicked trip. displayed in phase 3
        database.ref("" + tripId + "").on("value", function(snapshot) { 
        	console.log(snapshot.val());
        	console.log(snapshot.val().tripName);
        	// the below code will return anything saved in firebase to phase 3
        	$(".trip-name").text(snapshot.val().tripName);
        	$(".selected-origin-station").text(snapshot.val().originName);
        	// ...
        });

    });
};

// new trip move to phase 2
$("#new").on("click", function() {
	showSection(phase2);
});

/////////////////////////////////

//// phase 2: save button; stores user inputs in firebase ////
$("#save").on("click", function(event) {
	event.preventDefault();

	// Grabbed values from text boxes //
	tripName = $("#tripName-input").val().trim();
	console.log(tripName);
	originCoordinates = $("#origin-station option:selected").val().trim();
	originName = $("#origin-station option:selected").html().trim();
	console.log(originName);
	destinationCoordinates = $("#destination-station option:selected").val().trim();
	destinationName = $("#destination-station option:selected").html().trim();

	departStart = $("#departStart-input").val().trim();
	departEnd = $("#departEnd-input").val().trim();
	travelMode = $(".travelMode-selection").val().trim();
	//dayOfWeek = $("#myselect").val();

	// save to firebase //
	if (editStauts) { // edited record
		console.log("editUniqueId** " + editUniqueId);
		// removes existing id and creates new one. technique 1
		//database.ref().child(editUniqueId).remove();

		// technique 2 prefered
		// Update some of the keys for a defined path without replacing all of the data
		//database.ref("-KfuTowI1RAjwSmgOBtz").update({ tripName: 'yo'});

		//database.ref("-KfuTowI1RAjwSmgOBtz").update({
		database.ref("" + editUniqueId + "").update({
			tripName: tripName,
			originCoordinates: originCoordinates,
			originName: originName,
			destinationCoordinates: destinationCoordinates,
			destinationName: destinationName,
			departStart: departStart,
			departEnd: departEnd,
			travelMode: travelMode,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});

		// Code needed to update html based on update above update
		// html like row 161
		// need to know id/class of element being updated. maybe based on snapshot.key
		// will finish tomorrow

		// needed for edit ubtton //
		editStauts = false;
	}
	else { // new record
		database.ref().push({
			tripName: tripName,
			originCoordinates: originCoordinates,
			originName: originName,
			destinationCoordinates: destinationCoordinates,
			destinationName: destinationName,
			departStart: departStart,
			departEnd: departEnd,
			travelMode: travelMode,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	}

	// navigate to phase 3 //
	showSection(phase3a);
});

// add list of trips to phase //
database.ref().on("child_added", function(snapshot) {
// Change the HTML to reflect
	console.log("child: " + snapshot.val().tripName );
	// Build up train table in DOM.
	$("#trips").append("<tr class='clickable-row'>" +
						  "<th class='trip-id'>" + snapshot.getKey() + "</th>" + //maybe add id/class based on snapshot.getkey
	                      "<th>" + snapshot.val().tripName + "</th>" +
	                      "<th>" + snapshot.val().originName + "</th>" +
	                      "<th>" + snapshot.val().departStart + "</th>" +
	                    "</tr>");

	// Listens for trip click event.
	addTripClickListener();
});

// only want to returns the data just saved. displayed in phase 3
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
	// the below code will return anything saved in firebase to phase 3
	editUniqueId = snapshot.getKey();
	console.log("editUniqueId " + editUniqueId);
	$(".trip-name").text(snapshot.val().tripName);
	$(".selected-origin-station").text(snapshot.val().originName);
	// ...
});

// cancel btn //
$("#cancel").on("click", function() { 
	// clear input fields
	// navigate back to trip view
	$("input:text").val(""); // this clears the input box after clicking enter
	showSection(phase1);
});

/////////////////////////////////


//// phase 3: display data ////
// actions related to buttons edit and view trips
// edit: navigate to phase 2
	// saveing at this point should either
		// edit existing trip and not create a new unique trip // currently working - preferred
		// or delete prior verion and create new unique trip //  not preferred
$(".edit").on("click", function() {
	editStauts = true;
	showSection(phase2);
});
// view trips: navigate to phase 1
$(".listView").on("click", function() {
	showSection(phase1);
});


///////////////////////////////////



