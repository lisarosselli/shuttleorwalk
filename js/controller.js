/**
 * Some info here
 */

// Initialize Google Map!
function initialize() 
{
	user = new User();

	// get a suitable building/location to be the default
	var defaultBuilding = BUILDINGS[0];
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

  	$("#intro").addClass("ontop_visible")
}

/**
 *	Get user's current location, if possible
 */
function findLocation() 
{
	$("#intro").addClass("ontop");

 	if (navigator.geolocation)
 	{
 		navigator.geolocation.getCurrentPosition(foundLocation, handleNoGeolocation);
 	} else
 	{
 		handleNoGeolocation(true);
 	}


 	$("#intro").fadeOut();
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
 	alert('Found location');

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

/**
 *	Creates an google.maps info window with some message
 */
function createInfoWindow(windowTitle, windowText)
{
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">'+ windowTitle + '</h4>'+
      '<div id="bodyContent">'+
      '<p>' + windowText + '</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
  		content: contentString
  	});

  	return infowindow;
}
/**
 *	Shows progress bar up top.
 */
 /*
function showProgressBar()
{
	if (document.getElementById("progressBar"))
	{

	} else
	{
		var progressBar = "<div id='progressBar' class='progress progress-striped active show'>" +
  		"<div class='progress-bar'  role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 45%'>"+
  		"</div>"+
		"</div>";
		document.write(progressBar);
	}
}*/

/**
 *	Removes progress bar view.
 */
function removeProgressBar()
{
	
}

/**
 *	Finds the distance between two objects. Both objects are google.maps.LatLng objects.
 *	Returns distance in meters.
 */
function distance(objectA, objectB)
{
    var R = 6371;
	var dLat = (objectA.lat() - objectB.lat()) * Math.PI / 180;
	var dLon = (objectA.lng() - objectB.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(objectB.lat() * Math.PI / 180) * Math.cos(objectA.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
};

/**
 *	Reverse Geocode
 */
function reverseGeocode( gmLatLng )
{
	var marker;
	var infowindow = new google.maps.InfoWindow();
	var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': gmLatLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          marker = new google.maps.Marker({
              position: gmLatLng,
              map: map
          });
          infowindow.setContent(results[1].formatted_address);
          infowindow.open(map, marker);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}
