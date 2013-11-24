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