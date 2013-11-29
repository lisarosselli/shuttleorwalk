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
	console.log("User.prototype.setDestination");

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

	this.destination.marker = dMarker;
	this.queryDestination();
}

User.prototype.queryDestination = function()
{
	console.log("User.prototype.queryDestination");

	var userDestLatLng = new google.maps.LatLng(this.destination.lat, this.destination.lng);

	for (var i = 0; i < BUILDINGS.length; i++)
	{
		var thisBuilding = BUILDINGS[i];
		var buildingLatLng = new google.maps.LatLng(thisBuilding.lat, thisBuilding.lng);
		var d = distance(userDestLatLng, buildingLatLng);
		if (d < 60)
		{
			console.log("HEY! You're at "+thisBuilding.name+" : "+thisBuilding.address);

			if (this.destination.marker != null)
			{
				var infoWindow = new google.maps.InfoWindow();
				infoWindow.setContent("<div><img class='harvardH' src='img/harvard_H.png'/>&nbsp;"+thisBuilding.name+"</div>");
				infoWindow.open(map, this.destination.marker);
			}

			return thisBuilding;
		}
	}

	console.log("Not able to locate your building.");
	reverseGeocode(userDestLatLng);
	return null;
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