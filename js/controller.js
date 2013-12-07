/**
 *	controller.js
 *
 *	lisarosselli@g.harvard.edu
 *	Main controller of functionality for the app.
 */

/**
 *	Initialize Google Maps and the app itself.
 */
function initialize() 
{
	console.log("initialize");

	user = new User();

	// Select a suitable building/location to be the default
	var defaultBuilding = BUILDINGS[0];

	mapOptions = { 
		center: new google.maps.LatLng(defaultBuilding.lat, defaultBuilding.lng), 
		disableDefaultUI: true,
		minZoom: 10,
		zoom: 16 
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	findLocation();

	// Adding event listeners here for user taps/clicks on the map
	// Ability to set either destination or origin
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
  	document.getElementById("placeMyselfBtn").onclick = userPlaceSelfOrigin;
  	document.getElementById("closeX").onclick = closeUI;
  	document.getElementById("greenUIArrow").onclick = openUI;
  	document.getElementById("iOk").onclick = iOkClick;
  	document.getElementById("dialog").onclick = hideDialog;
  	document.getElementById("search").onkeyup = searchBuildings;
  	document.getElementById("nd0").onclick = setPage;
  	document.getElementById("nd1").onclick = setPage;
  	document.getElementById("nd2").onclick = setPage;
  	document.getElementById("uiInner").style.left = 0;
}

/**
 *	Called from circular UI buttons to change uiView
 */
function setPage(event) {
 	event = event;
    var target = event.target;
    var id = target.id;
    var index = id[2];
 	updateUI(index);
}

/**
 *	Change which UI view is displayed
 *	Update the circular button UI
 */
function updateUI(index) {
	var uiWidth = -280;
	var uiInner = document.getElementById("uiInner");
	var spot = index * uiWidth;

	for (var i = 0; i < 3; i++) {
 		var idName = "nd" + i;
 		var e = document.getElementById(idName);
 		if (i == index) {
 			e.className = "cBtn cBtn_active";
 		} else {
 			e.className = "cBtn cBtn_inactive";
 		}
 	}

	spot = spot.toString() + "px";
	TweenLite.to(uiInner, 0.3, {left:spot});
	clearSearch();

 	uiPageIndex = index;
}

/**
 *	Get user's current location, if possible
 */
var options = {
	enableHighAccuracy: true,
  	timeout: 10000,
  	maximumAge: 0
};

/**
 *	Upon geolocation success
 */
function geosuccess(pos) {
  	var crd = pos.coords;
 	console.log('Your current position is:');
  	console.log('Latitude : ' + crd.latitude);
  	console.log('Longitude: ' + crd.longitude);
  	console.log('More or less ' + crd.accuracy + ' meters.');
};

/**
 *	Upon geolocation error, either browser does not acknowledge
 *	geolocation, user opts no, or other error.
 */
function geoerror(err) {
  	console.warn('ERROR(' + err.code + '): ' + err.message);

  	var extraMessage = "";

  	switch (err.code) {
  		case 0:
  			break;
  		case 1:
  			// user denied location
  			break;
  		case 2:
  			// position unavailable
  			break;
  		case 3:
  			// timeout expired
  			extraMessage = ", defaulting you to Harvard Square.";
  			break;
  	}

  	// Opted not to implement the below, may change mind again
  	//alertUser(err.message + extraMessage);

  	if (err.code > 0) {
  		handleNoGeolocation();
  	}
};

/**
 *	Initially sparking location search
 */
function findLocation() 
{
	console.log("findLocation");

 	if (navigator.geolocation)
 	{
 		console.log("browser does have geo!");
 		navigator.geolocation.getCurrentPosition(foundLocation, geoerror, options);
 	} else
 	{
 		console.log("browser no have geo");
 		handleNoGeolocation(true);
 	}

 	document.getElementById("UIContainer").className += "hide";
 	document.getElementById("greenUIArrow").className += "show";
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

 	if (user.isOnCampus())
 	{
 		initialSpot = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
 		// TODO: attempt to locate them in a building?
 	} else
 	{
 		initialSpot = new google.maps.LatLng(BUILDINGS[0].lat, BUILDINGS[0].lng);
 		alertUser(errorCode.notOnCampus + " " + errorCode.defaultPlacement);
 	}

 	user.setCurrentLocation(initialSpot.lat(), initialSpot.lng());
}

/**
 *	Upon geolocation fail
 */
function handleNoGeolocation()
{
	console.log("handleNoGeolocation");

	var initialSpot = new google.maps.LatLng(BUILDINGS[0].lat, BUILDINGS[0].lng);
	user.setCurrentLocation(initialSpot.lat(), initialSpot.lng());
}

/**
 *	Alert the user
 */
function alertUser( message )
{
	var dialog = document.getElementById("dialog");
	dialog.innerHTML = message;
	dialog.className = "show";

	window.setTimeout(function() {
		dialog.className = "hide";
	}, 8000);
}

/**
 *	UI functionality below
 */
function iOkClick() {
	updateUI(1);
}

function closeUI()
{
	document.getElementById("UIContainer").className = "show uiContainerFadeOut";
	document.getElementById("greenUIArrow").className = "show greenArrowFadeIn";
}

function openUI() {
	document.getElementById("greenUIArrow").className = "show greenArrowFadeOut";
	document.getElementById("UIContainer").className = "show uiContainerFadeIn";
}

function hideDialog() {
	document.getElementById("dialog").className = "hide";
}

function showInfo() {
	var uiInner = document.getElementById("uiInner");
	TweenLite.to(uiInner, 0.2, {left:"0px"});
	clearSearch();
}

function clearSearch() {
	document.getElementById("search").value = "";
}

/**
 *	Begin route calculations
 */
function calculateRoute()
{
	console.log("calculateRoute");

	if (user.originIsNull() || user.destinationIsNull())
	{
		console.log("calculateRoute some user info is missing");
		closeUI();
		alertUser(errorCode.missingInfo);
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

	updateUI(2);
}

/**
 *	User opts to place their origin on the map
 */
function userPlaceSelfOrigin()
{
	console.log("userPlaceSelfOrigin");

	hideWalkingDisplay();
	hideShuttleDisplay();

	user.removeOriginMarker();
	closeUI();
}

/**
 *	Clear map
 */
function clearMap()
{
	hideWalkingDisplay();
	hideShuttleDisplay();
	user.removeOriginMarker();
	user.removeDestinationMarker();
	delete trip;
	delete shuttletrip;
}

/**
 *	Choosing a new destination
 */
function chooseNewDestination()
{
	hideWalkingDisplay();
	hideShuttleDisplay();

	delete trip;
	delete shuttletrip;

	user.removeDestinationMarker();
}

/**
 *	Hides walking route/line
 */
function hideWalkingDisplay()
{
	if (trip) {
		trip.hideRouteLine();
	}
}

/**
 *	Hides shuttle markers, walking lines
 */
function hideShuttleDisplay()
{
	if (shuttletrip)
	{
		shuttletrip.hideMarkers();
		shuttletrip.hideRouteLines();
	}
}

/**
 *	Callback for Google Directions 
 */ 
function googleDirectionsComplete()
{
	console.log("googleDirectionsComplete");
	trip.getGoogleDistanceMatrix();
}

/**
 *	Callback for Shuttleboy API stops
 */
function stopsAreLoadedCallback()
{
	console.log("stopsAreLoadedCallback");
	shuttletrip.defineAndSortStops();
}

/**
 *	Callback for stops being sorted by proximity
 *	to origin and proximity to destination
 */
function stopsAreSortedCallback()
{
	console.log("stopsAreSortedCallback");
	shuttletrip.beginQueryApiForRoute();
}

/**
 *	Callback in case there are no routes returned
 *	from Shuttleboy API
 */
function noRouteForStopsCallback()
{
	console.log("noRouteForStopsCallback");
	shuttletrip.incrementStops();
}

/**
 *	Callback once Shuttleboy API returns
 *	route data
 */
function receivedRouteJSON()
{
	console.log("receivedRouteJSON");
	shuttletrip.displayShuttleRoute();
	shuttletrip.getGoogleDistanceMatrix();
}

/**
 *	Callback when Google Maps returns data
 *	for distance/time to/from shuttle stops
 */
function receivedShuttleDistanceMatrix()
{
	console.log("receivedShuttleDistanceMatrix");
	shuttletrip.displayWalkingRoutes();
	shuttletrip.parseRouteTimes();
}

/**
 *	Present user with Google Maps walking info.
 */
function tripInfoLoaded() {
	var lastQuery = document.getElementById("lastQuery");
	lastQuery.innerHTML = lastTimeQueried;

	var p = document.getElementById("walking");
	p.innerHTML = "<span style='color:#0033FF'>Walking:</span> <b>" +
					trip.distanceMatrix.rows[0].elements[0].duration.text + 
					"</b> for " + trip.distanceMatrix.rows[0].elements[0].distance.text + ".";

	var s = document.getElementById("shuttle");
	s.innerHTML = "<span style='color:#00DD33'>Shuttle:</span> ...";

	document.getElementById("closeX").className = "show";
}

/**
 *	Present user with Shuttleboy API info (in a friendly way).
 */
function shuttleInfoLoaded() {
	var p = document.getElementById("shuttle");
	p.innerHTML = "<span style='color:#00DD33'>Shuttle:</span> <b>" + shuttletrip.totalTravelTime + " minutes</b> in total.<br/>" +
				"The " + shuttletrip.routeResponse[0].key + " will arrive at the " + shuttletrip.origSortedStops[shuttletrip.origProximity].stop +
				" stop in " + shuttletrip.waitTime + " minutes, and will take " + shuttletrip.shuttleTravelTime + " minutes to get to the " +
				shuttletrip.destSortedStops[shuttletrip.destProximity].stop + " stop.";
}

/**
 *	Upon user tapping origin or destination, adjust the map's bounds
 */
function adjustMapBounds() {
	var userLocLatLng = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
	var userDestLatLng = new google.maps.LatLng(user.destination.lat, user.destination.lng);
	var bounds = new google.maps.LatLngBounds();

	bounds.extend(userLocLatLng);
	bounds.extend(userDestLatLng);

	map.fitBounds(bounds);
}

/**
 *	Search through buildings.js when user enters text
 *	into search box. Display appropriate matches as buttons.
 */
function searchBuildings() {
	var value = document.getElementById("search").value;
	var regExp = new RegExp(value, "i", "y");
	var searchDest = document.getElementById("searchDest");
	searchDest.innerHTML = "";

	if (value == "") {
		return;
	}

	buildingMatches = [];

	for (var i = 0; i < BUILDINGS.length; i++) {
		var buildingName = BUILDINGS[i].name;
		if (buildingName.match(regExp)) {
			buildingMatches.push(BUILDINGS[i]);
		}
	}

	for (var i = 0; i < 3; i++) {
		if (buildingMatches[i] != null) {
			var bid = i.toString();
			var btn = "<button id='"+bid+"'>"+ buildingMatches[i].name +"</button><br/>";
			searchDest.innerHTML += btn;
		}
	}

	// Oh closures and scope... my arch nemesis. I circumvent thee for now...
	if (buildingMatches[0]) {
		document.getElementById("0").onclick = setMapTo;
	}

	if (buildingMatches[1]) {
		document.getElementById("1").onclick = setMapTo;
	}

	if (buildingMatches[2]) {
		document.getElementById("2").onclick = setMapTo;
	}
}

/**
 *	Button ability to set map to certain lat/lng
 */
function setMapTo() {
	console.log("setMapTo "+this.id);
	user.setDestination(buildingMatches[this.id].lat, buildingMatches[this.id].lng);

	hideWalkingDisplay();
	hideShuttleDisplay();

	document.getElementById("searchDest").innerHTML = "";
}

/**
 *	Storing the last time user queried a route
 */
function storeFriendlyQueryTime(year, month, day, hour, minutes) {
	var y = year;
	var m = month;
	var d = day;
	var h = hour;
	var m = minutes;
	var am;

	am = (h > 12) ? false : true;
	var amString = (am) ? "am" : "pm";
	h = (hour > 12) ? (hour - 12): hour;

	var monthStr = MONTHS[month];

	lastTimeQueried = h + ":" + minutes + amString + " " + monthStr + " " + day + ", " + year;
}



