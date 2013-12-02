/**
 * Some info here
 */

// Initialize Google Map!
function initialize() 
{
	console.log("initialize");
	user = new User();

	// get a suitable building/location to be the default
	var defaultBuilding = BUILDINGS[0];
	console.log(defaultBuilding);
	mapOptions = { 
		center: new google.maps.LatLng(defaultBuilding.lat, defaultBuilding.lng), 
		disableDefaultUI: true,
		minZoom: 10,
		zoom: 16 
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	findLocation();

	google.maps.event.addListener(map, 'click', function(e) {
    	console.log("map clicked! at "+e.latLng.lat());

    	if (user.currentLocation.lat == null && user.currentLocation.lng == null)
    	{
    		user.setCurrentLocation(e.latLng.lat(), e.latLng.lng());
    	} else 
    	{
    		chooseNewDestination();
    		user.setDestination(e.latLng.lat(), e.latLng.lng());
    	}
  	});

  	document.getElementById("calcRouteBtn").onclick = calculateRoute;
  	document.getElementById("newDestBtn").onclick = chooseNewDestination;
  	document.getElementById("placeMyselfBtn").onclick = userPlaceSelfOrigin;
  	document.getElementById("hideWalkingBtn").onclick = hideWalkingDisplay;
  	document.getElementById("hideShuttleBtn").onclick = hideShuttleDisplay;


  	//$("#intro").addClass("ontop_visible");
  	//$("#intro").delay(1500).fadeOut(300);
  	//$("#logo").delay(500).animate({top: '38%'}, 350, 'swing');
  	//$("#smilie").hide().delay(500).fadeIn(250);
}

/**
 *	Get user's current location, if possible
 */
function findLocation() 
{
	console.log("findLocation");
	//$("#intro").addClass("ontop");

 	if (navigator.geolocation)
 	{
 		navigator.geolocation.getCurrentPosition(foundLocation, handleNoGeolocation);
 	} else
 	{
 		handleNoGeolocation(true);
 	}

 	document.getElementById("UIContainer").className += "ontop_visible";

 	//$("#intro").fadeOut();
 	//loadStops();
}

/**
 *	Upon geolocation success
 */
function foundLocation( position )
{
	console.log("foundLocation");

	var initialSpot = null;
	var marker = null;
	var infoWindow = null;

 	//user.currentLocation.lat = position.coords.latitude;
 	//user.currentLocation.lng = position.coords.longitude;

 	if (user.isOnCampus())
 	{
 		initialSpot = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
 		// TODO: attempt to locate them in a building?
 	} else
 	{
 		initialSpot = new google.maps.LatLng(BUILDINGS[0].lat, BUILDINGS[0].lng);
 		messageToUser = "You are not on campus. Just going to put a marker near Harvard Coop.";
 		alertUser(messageToUser);
 	}

 	user.setCurrentLocation(initialSpot.lat(), initialSpot.lng());
 	//setUserOnMap(initialSpot);
}

/**
 *	Upon geolocation fail
 */
function handleNoGeolocation( errorFlag )
{
	console.log("handleNoGeolocation");

	if (!errorFlag)
	{
		messageToUser = "Your browser doesn't support geolocation.";
	} else
	{
		messageToUser = "Geolocation service failed.";
	}

	alertUser(messageToUser);

	var initialSpot = new google.maps.LatLng(BUILDINGS[0].lat, BUILDINGS[0].lng);
	user.setCurrentLocation(initialSpot.lat(), initialSpot.lng());
	//setUserOnMap(initialSpot);
}

/**
 *	If geolocation fails, browser does not support geolocation, 
 *	or user has been geolocated and is not found to be on campus:
 *	put the user near Harvard Square, in this case, the Coop.
 *	Or if their location is legit, place them on the map.
 */
 /*
function setUserOnMap( initialSpot )
{
	user.setCurrentLocation(initialSpot.lat(), initialSpot.lng());
	/*
	var marker;
	var infoWindow;

	map.setCenter(initialSpot);

	user.currentLocation.lat = initialSpot.lat();
	user.currentLocation.lng = initialSpot.lng();

 	// drop a marker
 	marker = new google.maps.Marker({
    	position: initialSpot,
    	map: map,
    	animation: google.maps.Animation.DROP,
    	title: "You are here."
	});

 	// show an info window
 	infoWindow = createInfoWindow("Hello!", "You are here.");
 	infoWindow.open(map,marker);
 	user.currentLocation.marker = marker;
	//markers.push(marker);
	//infoWindows.push(infoWindow);

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
	});

}
*/

/**
 *	Alert the user
 */
function alertUser( message )
{
	//alert(messageToUser);
}

/**
 * Load stops.
 */
function loadStops()
{
	stops = new Stops();
	stops.loadStops(testCallback);
}

function testCallback()
{
	console.log("testCallback");
	stops.displayMarkers();
}

function calculateRoute()
{
	console.log("calculateRoute");

	if (user.originIsNull() || user.destinationIsNull())
	{
		// TODO: alert user that info is missing
		console.log("calculateRoute some user info is missing");
		return;
	}

	hideWalkingDisplay();
	hideShuttleDisplay();

	delete trip;
	delete shuttletrip;

	trip = new Trip();
	trip.getTrip(user);

	shuttletrip = new ShuttleTrip();
	shuttletrip.getShuttleTrip(user);
}

function userPlaceSelfOrigin()
{
	console.log("userPlaceSelfOrigin");

	hideWalkingDisplay();
	hideShuttleDisplay();

	user.removeOriginMarker();
}

function clearMap()
{
	hideWalkingDisplay();
	hideShuttleDisplay();
	user.removeOriginMarker();
	user.removeDestinationMarker();
	delete trip;
	delete shuttletrip;
}

function chooseNewDestination()
{
	hideWalkingDisplay();
	hideShuttleDisplay();

	delete trip;
	delete shuttletrip;

	user.removeDestinationMarker();
}

function hideWalkingDisplay()
{
	console.log("hideWalkingDisplay");
	if (trip) {
		trip.hideRouteLine();
	}
}

function hideShuttleDisplay()
{
	console.log("hideShuttleDisplay");
	if (shuttletrip)
	{
		shuttletrip.hideMarkers();
		shuttletrip.hideRouteLines();
	}
}

function googleDirectionsComplete()
{
	console.log("googleDirectionsComplete");
	trip.getGoogleDistanceMatrix();
}

function stopsAreLoadedCallback()
{
	console.log("stopsAreLoadedCallback");
	shuttletrip.defineAndSortStops();
}

function stopsAreSortedCallback()
{
	console.log("stopsAreSortedCallback");
	shuttletrip.beginQueryApiForRoute();
}

function noRouteForStopsCallback()
{
	console.log("noRouteForStopsCallback");
	shuttletrip.incrementStops();
}

function receivedRouteJSON()
{
	console.log("receivedRouteJSON");
	shuttletrip.displayShuttleRoute();
	shuttletrip.getGoogleDistanceMatrix();
}

function receivedShuttleDistanceMatrix()
{
	console.log("receivedShuttleDistanceMatrix");
	shuttletrip.displayWalkingRoutes();
	shuttletrip.parseRouteTimes();
}

function storeFriendlyQueryTime(year, month, day, hour, minutes)
{
	var y = year;
	var m = month;
	var d = day;
	var h = h;
	var m = minutes;
	var am;

	am = (h > 12) ? false : true;
	var amString = (am) ? "am" : "pm";
	h = (h > 12) ? (h-12): h;

	var monthStr = MONTHS[month];

	lastTimeQueried = hour + ":" + minutes + amString + " " + monthStr + " " + day + ", " + year;
}



