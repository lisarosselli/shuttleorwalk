/**
 *	user.js
 *	
 *	User functionality
 */

function User()
{
	this.currentLocation = {
			lat: null,
			lng: null,
			marker: null,
			infoWindow: null,
		};

	this.destination = {
		lat: null,
		lng: null,
		marker: null,
		infoWindow: null
	};
}

User.prototype.isOnCampus = function()
{
	var defaultBuilding = BUILDINGS[0];

	if (this.currentLocation.lat == null || this.currentLocation.lng == null || !defaultBuilding)
	{
		return false;
	}

	var currentGM = new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng);
 	var coopGM = new google.maps.LatLng(defaultBuilding.lat, defaultBuilding.lng);
	var d = Math.ceil(distance(coopGM, currentGM) / METERS_IN_MILE);

	if (d > MAX_MILE_RADIUS)
	{
		return false;
	} else
	{
		return true;
	}
}

User.prototype.setCurrentLocation = function(latitude, longitude)
{
	console.log("User.prototype.setCurrentLocation for lat=" + latitude + " lng=" + longitude);

	var img;
	var shape;
	var oMarker;
	var oInfoWindow;

	this.removeOriginMarker();

	this.currentLocation.lat = latitude;
	this.currentLocation.lng = longitude;

	//http://mt.google.com/vt/icon?psize=27&font=fonts/Roboto-Bold.ttf&color=ff135C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=50&text=%E2%80%A2

	img = { url: "http://mt.google.com/vt/icon?psize=27&font=fonts/Roboto-Bold.ttf&color=ff133C00&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=50&text=%E2%80%A2",
					size: new google.maps.Size(22, 40),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(11, 40),
			};

	shape = { coord: [0, 0, 0, 22, 40, 22, 40 , 0],
  				type: 'poly'
		};

	oMarker = new google.maps.Marker({
		position: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
		icon: img,
		shape: shape,
		map: map,
		animation: google.maps.Animation.DROP,
		title: "You are here!"
	});

	this.currentLocation.marker = oMarker;

	oInfoWindow = new google.maps.InfoWindow({
		content: this.currentLocation.marker.title
	});	

	this.currentLocation.infoWindow = oInfoWindow;

	oMarker.setMap(map);
	oInfoWindow.open(map, this.currentLocation.marker);

	google.maps.event.addListener(user.currentLocation.marker, 'click', function() {
		user.currentLocation.infoWindow.open(map, user.currentLocation.marker);
	});	
}

User.prototype.setDestination = function(latitude, longitude)
{
	console.log("User.prototype.setDestination for lat=" + latitude + " lng=" + longitude);

	var dMarker;
	var dInfoWindow;

	// hold the incoming info, encapsulated to this object
	this.destination.lat = latitude;
	this.destination.lng = longitude;

	console.log("THIS?"+this);
	console.log(this.destination.lat);
	console.log(this.destination.lng);

	// drop the destination marker
	dMarker = new google.maps.Marker({
    	position: new google.maps.LatLng(this.destination.lat, this.destination.lng),
    	map: map,
    	animation: google.maps.Animation.DROP,
    	title: "Destination"
	});

	this.destination.marker = dMarker;

	dInfoWindow = new google.maps.InfoWindow({
		content: this.destination.marker.title
	});

	this.destination.infoWindow = dInfoWindow;

	dMarker.setMap(map);
	dInfoWindow.open(map, this.destination.marker);

	google.maps.event.addListener(user.destination.marker, 'click', function() {
		user.destination.infoWindow.open(map, user.destination.marker);
	});	

	this.queryDestination();
}

User.prototype.queryDestination = function()
{
	console.log("User.prototype.queryDestination");

	var userDestLatLng = new google.maps.LatLng(this.destination.lat, this.destination.lng);
	var isHarvardBuilding = false;
	var infoWindowString = null;

	// Is the destination "on campus" or a known HU location?
	for (var i = 0; i < BUILDINGS.length; i++)
	{
		var thisBuilding = BUILDINGS[i];
		var buildingLatLng = new google.maps.LatLng(thisBuilding.lat, thisBuilding.lng);
		var dist = distance(userDestLatLng, buildingLatLng);

		if (dist < ORIGIN_BUILDING_PROXIMITY)
		{
			console.log("\tUser.prototype.queryDestination found: "+thisBuilding.name+" : "+thisBuilding.address);
			infoWindowString = thisBuilding.name;
			isHarvardBuilding = true;
			user.destination.marker.title = thisBuilding.name;

			// TODO: if more than 1 match, store in array and present to user?
			// i.e. which building are you at?
		}
	}

	// reverse geocode if needed
	if (!isHarvardBuilding)
	{	
		getReverseGeocodeInfo(userDestLatLng);
	} else
	{
		this.updateDestinationInfoWindow(userDestLatLng, infoWindowString, isHarvardBuilding);
	}
}

User.prototype.updateDestinationInfoWindow = function(gmLatLng, buildingStringInfo, isHarvardBuilding)
{
	console.log("User.prototype.updateDestinationInfoWindow");

	if (isHarvardBuilding)
	{
		this.destination.infoWindow.setContent("<div><img class='harvardH' src='img/harvard_H.png'/>&nbsp;"+
			buildingStringInfo+"</div>");
	} else
	{
		this.destination.infoWindow.setContent("<div>"+buildingStringInfo+"</div>");
	}
}

/*
User.prototype.placeDestination = function( gmLatLng, buildingStringInfo, isHarvardBuilding)
{
	console.log("User.prototype.placeDestination");

	var infoWindow = new google.maps.InfoWindow();

	// Remove any existing destination marker
	if (this.destination.marker != null)
	{
		this.removeDestinationMarker();
	}

	// Place new marker
	marker = new google.maps.Marker({
		position: gmLatLng,
		map: map
	})

	this.destination.marker = marker;

	if (isHarvardBuilding)
	{
		// use nice format
		infoWindow.setContent("<div><img class='harvardH' src='img/harvard_H.png'/>&nbsp;"+
			buildingStringInfo+"</div>");
	} else
	{
		// use meh format
		infoWindow.setContent("<div>"+buildingStringInfo+"</div>")
	}

	infoWindow.open(map, this.destination.marker);
}*/

/**
 *	Removes destination marker
 */
User.prototype.removeDestinationMarker = function()
{
	console.log("User.prototype.removeDestinationMarker");
	this.destination.marker.setMap(null);
	this.destination.marker = null;
}

/**
 *	Quick call to ensure destination data exists
 */
User.prototype.destinationIsNull = function()
{
	if (this.destination.marker == null || this.destination.lat == null || this.destination.lng == null)
	{
		return true;
	}

	return false;
}

/**
 *	Quick call to ensure currentLocation data exists
 */
User.prototype.originIsNull = function()
{
	if (this.currentLocation.marker == null || this.currentLocation.lat == null || this.currentLocation.lng == null)
	{
		return true;
	}

	return false;
}

User.prototype.hideDestinationMarker = function()
{
	if (this.destination.marker)
	{
		this.destination.marker.setMap(null);
	}
}

User.prototype.hideOriginMarker = function()
{
	if (this.currentLocation.marker)
	{
		this.currentLocation.marker.setMap(null);
	}
}

User.prototype.removeDestinationMarker = function()
{
	console.log("HEYY! removeDestinationMarker");
	if (this.destination.marker)
	{
		this.hideDestinationMarker();
		this.destination.lat = null;
		this.destination.lng = null;
		this.destination.marker = null;
		this.destination.infoWindow = null;
	}
}

User.prototype.removeOriginMarker = function()
{
	if (this.currentLocation.marker)
	{
		this.hideOriginMarker();
		this.currentLocation.lat = null;
		this.currentLocation.lng = null;
		this.currentLocation.marker = null;
		this.currentLocation.infoWindow = null;
	}
}
