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
		};

	this.destination = {
		lat: null,
		lng: null,
		marker: null
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

User.prototype.setDestination = function(latitude, longitude)
{
	console.log("User.prototype.setDestination for lat=" + latitude + " lng=" + longitude);

	// hold the incoming info, encapsulated to this object
	this.destination.lat = latitude;
	this.destination.lng = longitude;

	// drop the destination marker
	var dMarker = new google.maps.Marker({
    	position: new google.maps.LatLng(this.destination.lat, this.destination.lng),
    	map: map,
    	animation: google.maps.Animation.DROP,
    	title: "Destination"
	});

	if (this.destination.marker != null)
	{
		this.removeDestinationMarker();
	}

	this.destination.marker = dMarker;
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
		this.placeDestination(userDestLatLng, infoWindowString, isHarvardBuilding);
	}
}

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
		infoWindow.setContent("<div><img class='harvardH' src='img/harvard_H.png'/>&nbsp;"+buildingStringInfo+"</div>");
	} else
	{
		// use meh format
		infoWindow.setContent("<div>"+buildingStringInfo+"</div>")
	}

	infoWindow.open(map, this.destination.marker);
}

/*
User.prototype.queryDestination = function()
{
	console.log("User.prototype.queryDestination");

	var userDestLatLng = new google.maps.LatLng(this.destination.lat, this.destination.lng);

	for (var i = 0; i < BUILDINGS.length; i++)
	{
		var thisBuilding = BUILDINGS[i];
		var buildingLatLng = new google.maps.LatLng(thisBuilding.lat, thisBuilding.lng);
		var d = distance(userDestLatLng, buildingLatLng);
		if (d < ORIGIN_BUILDING_PROXIMITY)
		{
			console.log("User.prototype.queryDestination found: "+thisBuilding.name+" : "+thisBuilding.address);

			if (this.destination.marker != null)
			{
				var infoWindow = new google.maps.InfoWindow();
				infoWindow.setContent("<div><img class='harvardH' src='img/harvard_H.png'/>&nbsp;"+thisBuilding.name+"</div>");
				infoWindow.open(map, this.destination.marker);
			}

			return thisBuilding;
		}
	}

	// TODO: this needs to be fixed. If the destination is say within 5 miles of campus, regardless of
	// if it's a recognized building, should become the this.destination.marker

	console.log("User.prototype.queryDestination :: building not found in Harvard JSON.");
	reverseGeocode(userDestLatLng);
	return null;
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