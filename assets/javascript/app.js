
// Initialize Firebase
 // var config = {
 // 	apiKey: "AIzaSyCNU5CN43KJZiTfFgMCIpWPMLBIiVUQ8Fo",
 // 	authDomain: "bart-on-time.firebaseapp.com",
 // 	databaseURL: "https://bart-on-time.firebaseio.com",
 // 	storageBucket: "bart-on-time.appspot.com",
 // 	messagingSenderId: "258285045447"
 // };

var config = {
	apiKey: "AIzaSyBS6nowOI7CgfhnS-hM3A5BUxh58k7NdVo",
    authDomain: "test-d1af2.firebaseapp.com",
    databaseURL: "https://test-d1af2.firebaseio.com",
    storageBucket: "test-d1af2.appspot.com",
    messagingSenderId: "395340255814"
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
var destination;
var originCoordinates;
var travelMode;
var userOrigin;
var alternativeTravelMode;
// when user clicks edit
var tripId;
var editUniqueId;
var editStauts = false;
var saveEdit = false;
var tripClickEdit = false;
/////////////////////////////////

// Declare global variables
var apiKeyBart = "ZPZZ-PTE2-9NWT-DWE9"
var orig = "EMBR";
var dest = "WOAK";


// Global varibles that will be assigned during AJAX function execution
var newTrainHeadStnArray = [];
var newEtdArray;
var trainHeadStn;
var eta;
var militaryETA;


//// phase controller ////
function showSection(section) {
	phase1.css({'display': 'none'});
	phase2.css({'display': 'none'});
	phase3a.css({'display': 'none'});
	phase3b.css({'display': 'none'});

	if (section) {
		section.css({'display' : 'block'});
	}
}
/////////////////////////////////

//// phase 1: landing page list of trips ////
// will be loaded on page load 
$(document).ready(function() {
	showSection(phase1);
	nextTrainAjax(orig, dest);
	getUserLocation();
	// Loop through the array of ETD objects
    //(which is already sorted by earliest time) and cross match with the Train array (newTrainHeadStnArray),
    // and print out its associated ETA
    getNextArrivalTimeEstimate();
	// Listens for trip click event.
	//addTripClickListener();
});

// Fires when trip selected.
function addTripClickListener() {
	$("#trips").on("click", "tr", function() {
		tripId = $(this).children('.trip-id').text();
		console.log("You clicked on this trip: " + tripId);

		showSection(phase3a);

		// show relevant data related to clicked trip. displayed in phase 3
		database.ref("" + tripId + "").on("value", function(snapshot) { 
			console.log(snapshot.val().tripName);
			// the below code will return anything saved in firebase to phase 3
			$(".trip-name").text(snapshot.val().tripName);
			$("#selected-origin-station").text(snapshot.val().originName + " ");
			orig = snapshot.val().orig;
			console.log("This is the orig we need for ajax!: " + orig);
			dest = snapshot.val().dest;
			console.log("This is the dest we need for ajax!: " + dest);
			nextTrainAjax(orig, dest);
			// Loop through the array of ETD objects
			//(which is already sorted by earliest time) and cross match with the Train array (newTrainHeadStnArray),
			// and print out its associated ETA
			getNextArrivalTimeEstimate();
		});

		// needed for edit ubtton //
		tripClickEdit = true;

		initMap();



    });
};

// new trip move to phase 2
$("#new").on("click", function() {
	showSection(phase2);
	//addSaveTripClickListener();
});

addSaveTripClickListener();

/////////////////////////////////

//// phase 2: save button; stores user inputs in firebase ////
/// storing in function, as need to call listener to initialize maps.
function addSaveTripClickListener() {
	$("#save").on("click", function(event) {
		event.preventDefault();

		// Grabbed values from text boxes //
		tripName = $("#tripName-input").val().trim();
		console.log(tripName);
		originCoordinates = $("#origin-station option:selected").val().trim();
		originName = $("#origin-station option:selected").html().trim();
		orig = $("#origin-station option:selected" ).attr("id");
		console.log("The origin BART abbreviation is: " + orig);
		console.log(originName);
		destinationCoordinates = $("#destination-station option:selected").val().trim();
		destinationName = $("#destination-station option:selected").html().trim();
		dest = $("#destination-station option:selected" ).attr("id");
		console.log("The destination BART abbreviation is: " + dest);
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
			//TODO: Add to firebase the orig and dest codes for Bart API.
			//TODO: Make sure to have these codes pulled up at all times needed when retrieving data.
			database.ref("" + editUniqueId + "").update({
				tripName: tripName,
				originCoordinates: originCoordinates,
				originName: originName,
				orig: orig,
				destinationCoordinates: destinationCoordinates,
				destinationName: destinationName,
				dest: dest,
				travelMode: travelMode,
				dateAdded: firebase.database.ServerValue.TIMESTAMP
			});

			// Code needed to update html based on update above update
			// html like row 161
			// need to know id/class of element being updated. maybe based on snapshot.key
			// will finish tomorrow
			$("#" + editUniqueId).html(
				  "<th class='trip-id'>" + editUniqueId + "</th>" + //maybe add id/class based on snapshot.getkey
		          "<th>" + tripName + "</th>" +
		          "<th>" + originName + "</th>" +
		          "<th>" + destinationName + "</th>" +
		        "</tr>"
			);
			// needed for edit ubtton //
			editStauts = false;
			saveEdit = true;
		}
		else { // new record
			//TODO: Add to firebase the orig and dest codes for Bart API.
			//TODO: Make sure to have these codes pulled up at all times needed when retrieving data.
			database.ref().push({
				tripName: tripName,
				originCoordinates: originCoordinates,
				originName: originName,
				orig: orig,
				destinationCoordinates: destinationCoordinates,
				destinationName: destinationName,
				dest: dest,
				travelMode: travelMode,
				dateAdded: firebase.database.ServerValue.TIMESTAMP
			});
		}

		// navigate to phase 3 //
		showSection(phase3a);

		//Bart API call.
        nextTrainAjax(orig, dest);

        // Loop through the array of ETD objects
        //(which is already sorted by earliest time) and cross match with the Train array (newTrainHeadStnArray),
        // and print out its associated ETA
        getNextArrivalTimeEstimate();

        initMap();
	});
}

// add list of trips to phase //
database.ref().on("child_added", function(snapshot) {
// Change the HTML to reflect
	console.log("child: " + snapshot.val().tripName );

	//TODO: Add to firebase the orig and dest codes for Bart API.
	//TODO: Make sure to have these codes pulled up at all times needed when retrieving data.
	// Build up train table in DOM.
	$("#trips").append("<tr class='clickable-row'" + "id='" + snapshot.getKey() + "'>" +
						  "<th class='trip-id'>" + snapshot.getKey() + "</th>" + //maybe add id/class based on snapshot.getkey
	                      "<th>" + snapshot.val().tripName + "</th>" +
	                      "<th>" + snapshot.val().originName + "</th>" +
	                      "<th>" + snapshot.val().destinationName + "</th>" +
	                    "</tr>");

	// Listens for trip click event.
	addTripClickListener();
});

// only want to returns the data just saved. displayed in phase 3
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
	// the below code will return anything saved in firebase to phase 3
	//TODO: Add to firebase the orig and dest codes for Bart API.
	//TODO: Make sure to have these codes pulled up at all times needed when retrieving data.
	editUniqueId = snapshot.getKey();
	originCoordinates = snapshot.val().originCoordinates;
	console.log("These are origin coordinates accessible to view page: " + originCoordinates);
	travelMode = snapshot.val().travelMode;
	console.log("This is travel mode accessible to view page: " + travelMode);
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
	$("#tripName-input").attr("placeholder", "");

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

	if (tripClickEdit) {
		database.ref("" + tripId + "").on("value", function(snapshot) {
			$("#tripName-input").attr("placeholder", snapshot.val().tripName);
		});
	}
	else if (saveEdit) {
		database.ref("" + editUniqueId + "").on("value", function(snapshot) {
			$("#tripName-input").attr("placeholder", snapshot.val().tripName);
		});	
	}

	tripClickEdit = false;
	saveEdit = false;

	showSection(phase2);
	//addSaveTripClickListener();
});
// view trips: navigate to phase 1
$(".listView").on("click", function() {
	showSection(phase1);
});


function getNextArrivalTimeEstimate() {
	for (var i = 0; i < newEtdArray.length; i++) {
		console.log("New Train Head Stn Array i: " + newTrainHeadStnArray[i]);
		if (newTrainHeadStnArray.indexOf(newEtdArray[i].abbreviation) !== -1 ) {
			trainHeadStn = newEtdArray[i].abbreviation;
			eta = newEtdArray[i].estimate[0].minutes;
			if (eta === "Leaving") {
				eta = "0";
			}
			// Debug
			console.log("THIS IS THE ETA: " + eta);
			$("#eta").text(eta + " minutes");
			$(".headStation").text(trainHeadStn + " at: ");
			$("#destination-arrival-time-1").text(militaryETA);
			var nextEta = newEtdArray[i].estimate[1].minutes;
			var thirdEta = newEtdArray[i].estimate[2].minutes;

			var nextEtaTime = determineNextArrivalTrain(militaryETA, nextEta);
			console.log("Military time for next trains is working: " + nextEtaTime);
			$("#etd-second").text(nextEtaTime);

			$("#two-train-arrival-time-min").text(nextEta + " minutes");
			$("#three-train-arrival-time-min").text(thirdEta + " minutes");
			var thirdEtaTime = determineNextArrivalTrain(militaryETA, thirdEta);
			$("#etd-third").text(thirdEtaTime);

			console.log("We are getting next train time! " + nextEta);
			break;
		}
	}
}

///////////////////////////////////

//// Maps API integration ///

function initMap() {
	var directionsService = new google.maps.DirectionsService;

	getUserLocation();
    calculateRoute(directionsService, userOrigin);

    if (travelMode === "WALKING") {
    	alternativeTravelMode = "DRIVING";
    } else {
    	alternativeTravelMode = "WALKING";
    }
    calculateAlternativeRoute(directionsService, userOrigin, alternativeTravelMode);
}

addTripClickListener();

function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
    		};
    		console.log("Postion is " + pos.lat + "," + pos.lng);
    		var latitude = pos.lat.toString();
    		var longitude = pos.lng.toString();
    		userOrigin = (latitude + "," + longitude);
    		console.log("Is userOrigin at least OK?" + userOrigin);
  		})
	} else {
  	console.log("Error: things aren't working.");
	}
}

function calculateRoute(directionsService) {
	console.log("Origin Coordinates being used in calculating route are : " + originCoordinates);
	directionsService.route({
		origin: userOrigin,
		destination: originCoordinates,
		travelMode: travelMode,
	}, function(response, status) {
		if (status === 'OK') {
			var route = response.routes[0];
			console.log("What is so wrong with origin?" + route.origin);
			if (travelMode === "WALKING") {
				$(".walking-distance").html(route.legs[0].distance.text + "/ ");
				$(".walking-estimate").html(route.legs[0].duration.text);
			} else if (travelMode === "DRIVING") {
				$(".driving-distance").html(route.legs[0].distance.text + "/ ");
				$(".driving-estimate").html(route.legs[0].duration.text);
			}
			
  		} else {
    		window.alert('Directions request failed due to ' + status);
  		}
	});
}

function calculateAlternativeRoute(directionsService) {
	console.log("Origin Coordinates being used in calculating route are : " + originCoordinates);
	console.log("Alternative travel mode available for alternative calculations : " + alternativeTravelMode);
	directionsService.route({
		origin: userOrigin,
		destination: originCoordinates,
		travelMode: alternativeTravelMode,
	}, function(response, status) {
		if (status === 'OK') {
			var route = response.routes[0];
			if (alternativeTravelMode === "WALKING") {
				$(".walking-distance").html(route.legs[0].distance.text + "/ ");
				$(".walking-estimate").html(route.legs[0].duration.text);
			} else if (alternativeTravelMode === "DRIVING") {
				$(".driving-distance").html(route.legs[0].distance.text + "/ ");
				$(".driving-estimate").html(route.legs[0].duration.text);
			}
			
  		} else {
    		window.alert('Directions request failed due to ' + status);
  		}
	});
} 

// AJAX FUNCTIONS 
function nextTrainAjax(orig, dest) {

	// Data object for Real Time Train ETA
	var xmlObjRealTime = {
	  uri: null,
	  date: null,
	  time: null,
	  station: {
	    name: null,
	    abbr: null,
	    etd: []
	  }
	}
	// Data object for scheduled departure time object
	var xmlObjSchd = {
	  uri: null,
	  origin: null,
	  destination: null,
	  schedule: {
	    date: null,
	    time: null,
	    before: null,
	    after: null,
	    request: []
	  }
	}

	// 1st AJAX Fucntion - Departure Time Schedule
	$.ajax({
	type: "GET",
	url: "http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=" + orig + "&dest=" + dest + "&date=now&key=" + apiKeyBart + "&b=0&a=3&l=1",
	dataType: "text"
	//async: false,
	//contentType: "text/xml; charset=\"utf-8\""
	}).done(function(response) {
	// For debugging API call
	//console.log(response);

	// Use .parseXML() functino (core jQuery)
	var xmlRaw = $.parseXML(response)
	// This is the entire XML doc needed
	var xml = xmlRaw.childNodes[0]

	// Mapping relevant object properties to XML elements
	xmlObjSchd.uri = xml.getElementsByTagName("uri")[0].innerHTML;
	xmlObjSchd.origin = xml.getElementsByTagName("origin")[0].innerHTML;
	xmlObjSchd.destination = xml.getElementsByTagName("destination")[0].innerHTML;
	xmlObjSchd.schedule.date = xml.getElementsByTagName("date")[0].innerHTML;
	xmlObjSchd.schedule.time = xml.getElementsByTagName("time")[0].innerHTML;
	xmlObjSchd.schedule.before = xml.getElementsByTagName("before")[0].innerHTML;
	xmlObjSchd.schedule.after = xml.getElementsByTagName("after")[0].innerHTML;

	var tripsRaw = xml.getElementsByTagName("request")[0].getElementsByTagName("trip");
	//console.log(requestRaw)
	for (var i = 0; i < tripsRaw.length; i++) {
	  //console.log(tripsRaw[i]);
	  var trip = {
	    origin: tripsRaw[i].getAttribute("origin"),
	    destination: tripsRaw[i].getAttribute("destination"),
	    origTimeMin: tripsRaw[i].getAttribute("origTimeMin"),
	    origTimeDate: tripsRaw[i].getAttribute("origTimeDate"),
	    destTimeMin: tripsRaw[i].getAttribute("destTimeMin"),
	    destTimeDate: tripsRaw[i].getAttribute("destTimeDate"),
	    tripTime: tripsRaw[i].getAttribute("tripTime"),
	    legs: []
	  }

	  var legsRaw = tripsRaw[i].getElementsByTagName("leg");
	  for (var j = 0; j < legsRaw.length; j++) {
	    var leg = {
	      order: legsRaw[j].getAttribute("order"),
	      origin: legsRaw[j].getAttribute("origin"),
	      destination: legsRaw[j].getAttribute("destination"),
	      origTimeMin: legsRaw[j].getAttribute("origTimeMin"),
	      origTimeDate: legsRaw[j].getAttribute("origTimeDate"),
	      destTimeMin: legsRaw[j].getAttribute("destTimeMin"),
	      destTimeDate: legsRaw[j].getAttribute("destTimeDate"),
	      trainHeadStation: legsRaw[j].getAttribute("trainHeadStation")
	    }
	    trip.legs.push(leg)
	  }
	  xmlObjSchd.schedule.request.push(trip);
	}
	// Debug
	console.log(xmlObjSchd);

	// Store all of request objects from schedule API response
	var newRequestArray = xmlObjSchd.schedule.request;
	// First clear the existing array elements
	newTrainHeadStnArray = [];
	// Loop through the schedule request object to find all trains whose directions are towards our destination
	for (var i = 0; i < newRequestArray.length; i++) {
		var newTrainHeadStn = newRequestArray[i].legs[0].trainHeadStation;
		newTrainHeadStnArray.push(newTrainHeadStn);
	}

	});
	// END OF 1ST AJAX FUNCTION

	// 2nd AJAX function - Real Time Train ETA
	$.ajax({
		type: "GET",
		url: "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + orig + "&key=" + apiKeyBart,
		dataType: "text"
		//async: false,
		//contentType: "text/xml; charset=\"utf-8\""
		}).done(function(response) {
		// For debugging API call
		// console.log(response);
		// Use .parseXML() functino (core jQuery)
		var xmlRaw = $.parseXML(response)
		// This is the entire XML doc needed
		var xml = xmlRaw.childNodes[0]

		// Mapping relevant object properties to XML elements
		xmlObjRealTime.uri = xml.getElementsByTagName("uri")[0].innerHTML;
		xmlObjRealTime.date = xml.getElementsByTagName("date")[0].innerHTML;
		xmlObjRealTime.time = xml.getElementsByTagName("time")[0].innerHTML;
		// Mapping to certain XML elements selected by children index (also can use getElementsByTagName("name"), etc)
		xmlObjRealTime.station.name = xml.children[3].children[0].innerHTML;
		xmlObjRealTime.station.abbr = xml.children[3].children[1].innerHTML;

		// Loop through multiple <etd> XML elements, where etd stands for "Estimated Time of Departure"
		var etdArray = xml.getElementsByTagName("etd");
		for (var i = 0; i < etdArray.length; i++) {

		  // Create an empty variable object to hold properties in between loops
		  var etdChild = {
		    destination: null,
		    abbreviation: null,
		    limited: null,
		    estimate: []
		  };

		  // Assign element innerHTML to empty object properties
		  etdChild.destination = etdArray[i].getElementsByTagName("destination")[0].innerHTML;
		  etdChild.abbreviation = etdArray[i].getElementsByTagName("abbreviation")[0].innerHTML;
		  etdChild.limited = etdArray[i].getElementsByTagName("limited")[0].innerHTML;
		  
		  // Loop through multiple <estimate> XML elements within an <etd> tag
		  var estimateRaw = etdArray[i].getElementsByTagName("estimate");
		  for (var j = 0; j < estimateRaw.length; j++) {

		    // Create another empty variable object to hold properties in between the loops within the loop
		    var estimateChild = {
		      minutes: null,
		      platform: null,
		      direction: null,
		      trainLength: null,
		      hexcolor: null
		    };

		    // Assign element innerHTML to empty object properties
		    estimateChild.minutes = estimateRaw[j].getElementsByTagName("minutes")[0].innerHTML;
		    estimateChild.platform = estimateRaw[j].getElementsByTagName("platform")[0].innerHTML;
		    estimateChild.direction = estimateRaw[j].getElementsByTagName("direction")[0].innerHTML;
		    estimateChild.trainLength = estimateRaw[j].getElementsByTagName("length")[0].innerHTML;
		    estimateChild.hexcolor = estimateRaw[j].getElementsByTagName("hexcolor")[0].innerHTML;

		    // Push the resulting object to esdChild.estimate array declared outside of the current loop
		    etdChild.estimate.push(estimateChild);
		  }

		  // Push the resulting object to xmlObjRealTime.station.etd array declared globally
		  xmlObjRealTime.station.etd.push(etdChild);
		}

		// Debugging 
		console.log(xmlObjRealTime);

		// Store all of etd objects from real time API reponse into the global variable newEtdArray
	    newEtdArray = xmlObjRealTime.station.etd;

	    militaryETA = xmlObjRealTime.time;
	    console.log("This is the time we need: " + militaryETA);
	});
	// END OF 2ND AJAX FUNCTION
}

// Crazy time stuff to get schedule to update for second and third trains!
// Reusing code from train scheduler assignment.
// Convert first train tim minutes using moment.js.
function determineNextArrivalTrain(militaryETA, nextEta) {

  var firstTrainTime = moment(militaryETA, "hh:mm");
  firstTrainHours = firstTrainTime.hours();
  firstTrainMin = firstTrainTime.minutes();

  // Calculation to add up the minutes.
  var firstTrainTotalMin = firstTrainMin + firstTrainHours*60;

  var nextTrainTotalMin = parseInt(nextEta) + firstTrainTotalMin;

  var nextArrivalHours = Math.floor(nextTrainTotalMin / 60);
  var ampm = "";

  // Also figure out if time is AM or PM.
  if (nextArrivalHours >= 12) {
    nextArrivalHours = nextArrivalHours - 12;
    ampm = "PM";
  } else {
    nextArrivalHours = nextArrivalHours;
    ampm = "AM";
  }
  var nextArrivalMin = nextTrainTotalMin % 60;
  if (nextArrivalHours < 10) {
    nextArrivalHours = "0" + nextArrivalHours;
  }
  if (nextArrivalMin < 10) {
    nextArrivalMin = "0" + nextArrivalMin;
  }

  var nextArrival = nextArrivalHours + ":" + nextArrivalMin + " " + ampm;

  return nextArrival;
}


