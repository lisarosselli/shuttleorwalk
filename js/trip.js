/**
 *	trip.js
 *
 */

function Trip()
{
	console.log("new Trip!");

	this.markerArray = [];
	this.rendererOptions = null;
	this.stepDisplay = null;
	this.directionsDisplay;
	this.directionsService = null;
	//this.polylineArray = [];
	this.routeLine = null;
	this.distanceMatrix = null;
}

Trip.prototype.getTrip = function( userObject )
{
	if (userObject == null)
	{
		console.log("Trip.prototype.getTrip :: try sending in a user.");
		return;
	}

	if (userObject.originIsNull())
	{
		// TODO: say something to user about either origin
		console.log("Trip.prototype.getTrip :: userObject.originIsNull");
		return;
	} else if (userObject.destinationIsNull())
	{
		// TODO: say something to user about destination
		console.log("Trip.prototype.getTrip :: userObject.destinationIsNull");
		return;
	} else
	{
		console.log("Get trip here.");

		// TODO: get my own "directions" for shuttlebus
  		this.getGoogleDirections();
	}

}

Trip.prototype.getGoogleDirections = function()
{
	console.log("Trip.prototype.getGoogleDirections");

	this.rendererOptions = { map: map };
  	this.stepDisplay = new google.maps.InfoWindow();
  	this.directionsDisplay = new google.maps.DirectionsRenderer(this.rendererOptions);

  	// remove existing trip markers from the map
  	for (var i = 0; i < this.markerArray.length; i++) 
  	{
		this.markerArray[i].setMap(null);
	}

	this.markerArray = [];

	// create a new trip request
	var start = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
  	var end = new google.maps.LatLng(user.destination.lat, user.destination.lng);
  	var request = {
    	origin: start,
    	destination: end,
    	travelMode: google.maps.TravelMode.WALKING
  	};

  	var t = this;

  	this.directionsService = new google.maps.DirectionsService();

  	this.directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {

	    	// make polyline?
	    	var route = response.routes[0];
	    	var polyLineArray = [];
	    	for (var i = 0; i < route.overview_path.length; i++)
	    	{
	    		var polyLatLng = new google.maps.LatLng(route.overview_path[i].lat(), route.overview_path[i].lng());
	    		polyLineArray[i] = polyLatLng;
	    	}

	    	if (t.routeLine != null)
	    	{

	    		console.log("attempting to set null");
	    		t.routeLine.setMap(null);
	    	}

	    	t.routeLine = new google.maps.Polyline({
	    		path: polyLineArray,
	    		geodesic: false,
	    		strokeColor: '#0033FF',
	    		strokeOpacity: 0.8,
	    		strokeWeight: 4
	    	});

	    	t.routeLine.setMap(map);

	    	//t.showGoogleSteps(response);
	    	googleDirectionsComplete();
	    }
  	});
}

Trip.prototype.getGoogleDistanceMatrix = function()
{
	console.log("Trip.prototype.getGoogleDistanceMatrix");
	
	var t = this;

	var userOrigin = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
	var userDest = new google.maps.LatLng(user.destination.lat, user.destination.lng);
	var dmRequest = {origins: [userOrigin],
		destinations: [userDest],
		travelMode: google.maps.TravelMode.WALKING,
		unitSystem: google.maps.UnitSystem.IMPERIAL
		};

	var service = new google.maps.DistanceMatrixService();
	console.log("SERVICE="+service);
	service.getDistanceMatrix(dmRequest, function(response, status) {
		if (status == 'google.maps.DistanceMatrixService.OK' || status == 'OK')
		{
			console.log(response);
			t.distanceMatrix = response;
		} 
	});
}

Trip.prototype.showGoogleSteps = function(directionResult)
{
	console.log("Trip.prototype.showGoogleSteps");
	// For each step, place a marker, and add the text to the marker's
	// info window. Also attach the marker to an array so we
	// can keep track of it and remove it when calculating new
	// routes.
	var myRoute = directionResult.routes[0].legs[0];

	console.log("myRoute = "+myRoute);

	for (var i = 0; i < myRoute.steps.length; i++) 
	{
		var marker = new google.maps.Marker({
    		position: myRoute.steps[i].start_location,
    		map: map
    	});
    
		this.attachGoogleInstructions(marker, myRoute.steps[i].instructions);
		this.markerArray[i] = marker;
	}
}

Trip.prototype.attachGoogleInstructions = function(marker, text)
{
	console.log("Trip.prototype.attachGoogleInstructions");

	var t = this;

	google.maps.event.addListener(marker, 'click', function(t) {

		console.log("Hi");
		console.log("t="+t);
		t.stepDisplay.setContent(text);
		t.stepDisplay.open(map, marker);
	});
}

Trip.prototype.getGoogleDistance = function()
{
	if (this.distanceMatrix != null)
	{
		return this.distanceMatrix.rows[0].elements[0].distance.text;
	}
}

Trip.prototype.getGoogleDuration = function()
{
	if (this.distanceMatrix != null)
	{
		return this.distanceMatrix.rows[0].elements[0].duration.text;
	}
}
/*
[
	{"departs":"2013-11-25T05:50:00","arrives":"2013-11-25T05:55:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T06:20:00","arrives":"2013-11-25T06:25:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T06:45:00","arrives":"2013-11-25T06:50:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T07:10:00","arrives":"2013-11-25T07:20:00","key":"Quad-Stadium Express C 1011"}
] none of these are today?

[
	{"departs":"2013-11-25T05:40:00","arrives":"2013-11-25T05:55:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T06:10:00","arrives":"2013-11-25T06:25:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T06:35:00","arrives":"2013-11-25T06:50:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T07:00:00","arrives":"2013-11-25T07:20:00","key":"Quad-Stadium Express C 1011"},
	{"departs":"2013-11-25T09:00:00","arrives":"2013-11-25T09:23:00","key":"Allston Campus I 1112"}
]
*/