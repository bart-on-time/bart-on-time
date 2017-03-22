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


//// phase I: new trip ////
$("#saveBtn").on("click", function() {
	// take user to data entry section
});
/////////////////////////////////

//// phase II: save button; stores user inputs in firebase////
function showSection(section) {
	phase1.css({'display': 'none'});
	phase2.css({'display': 'none'});
	phase3a.css({'display': 'none'});
	phase3b.css({'display': 'none'});

	if (section) {
		section.css({'display' : 'block'})
	}
}

$("#saveBtn").on("click", function(event) {
	event.preventDefault();

	// Grabbed values from text boxes
	tripName = $("#tripName-input").val().trim();
	origin = $(".origin-selection").val().trim();
	destination = $(".destination-selection").val().trim();
	departStart = $("#departStart-input").val().trim();
	departEnd = $("#departEnd-input").val().trim();
	travelMode = $(".travelMode-selection").val().trim();
	//dayOfWeek = $("#myselect").val();

	// save to firebase
	database.ref().push({
		tripName: tripName,
		Origin: Origin,
		destination: destination,
		departStart: departStart,
		departEnd: departEnd,
		travelMode: travelMode
	});

	// move to new section
	showSection()


});
/////////////////////////////////


// will append trip list
//   // full list of items to the well
//   $("#full-member-list").append("<div class='well'><span id='name'> " + childSnapshot.val().name +
//     " </span><span id='email'> " + childSnapshot.val().email +
//     " </span><span id='age'> " + childSnapshot.val().age +
//     " </span><span id='comment'> " + childSnapshot.val().comment + " </span></div>");
// // Handle the errors
// }, function(errorObject) {
//   console.log("Errors handled: " + errorObject.code);
// });
// /////////////////////////////////

//// will be loaded on page load ////
$(document).ready(function() {
	showSection(phase1);
});
/////////////////////////////////


