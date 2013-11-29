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
    	user.setDestination(e.latLng.lat(), e.latLng.lng());
  	});

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


 	//$("#intro").fadeOut();
 	//loadStops();
}

/**
 *	Upon geolocation success
 */
function foundLocation( position )
{
	var initialSpot = null;
	var marker = null;
	var infoWindow = null;

 	user.currentLocation.lat = position.coords.latitude;
 	user.currentLocation.lng = position.coords.longitude;

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

 	setUserOnMap(initialSpot);
}

/**
 *	Upon geolocation fail
 */
function handleNoGeolocation( errorFlag )
{
	if (!errorFlag)
	{
		messageToUser = "Your browser doesn't support geolocation.";
	} else
	{
		messageToUser = "Geolocation service failed.";
	}

	alertUser(messageToUser);

	var initialSpot = new google.maps.LatLng(BUILDINGS[0].lat, BUILDINGS[0].lng);
	setUserOnMap(initialSpot);
}

/**
 *	If geolocation fails, browser does not support geolocation, 
 *	or user has been geolocated and is not found to be on campus:
 *	put the user near Harvard Square, in this case, the Coop.
 *	Or if their location is legit, place them on the map.
 */
function setUserOnMap( initialSpot )
{
	var marker;
	var infoWindow;

	map.setCenter(initialSpot);

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
	markers.push(marker);
	infoWindows.push(infoWindow);

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
	});
}

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

