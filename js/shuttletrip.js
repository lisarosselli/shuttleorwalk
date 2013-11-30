/**
 *	shuttletrip.js
 */

function ShuttleTrip()
{
	console.log("new ShuttleTrip");

	this.origSortedStops = [];
	this.destSortedStops = [];
}

ShuttleTrip.prototype.getShuttleTrip = function( userObject )
{
	console.log("ShuttleTrip.prototype.getShuttleTrip");

	stops = new Stops();
	stops.loadStops(this.stopsLoadCallback);
}

ShuttleTrip.prototype.stopsLoadCallback = function()
{
	console.log("ShuttleTrip.prototype.stopsLoadCallback");
	
	// out of scope here so referring as 'shuttletrip' and not 'this':
	shuttletrip.sortStopsClosestToOrig();
	shuttletrip.sortStopsClosestToDest();
}

ShuttleTrip.prototype.sortStopsClosestToOrig = function()
{
	if (!stops.loaded)
	{
		return ;
	}

	console.log("ShuttleTrip.prototype.sortStopsClosestToOrig");

	var origLatLng = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
	for (var i = 0; i < stops.stopList.length; i++)
	{
		var thisStop = stops.stopList[i];
		var stopLatLng = new google.maps.LatLng(thisStop.lat, thisStop.lng);
		thisStop.distanceToOrigin = Math.ceil(distance(origLatLng, stopLatLng));
	}
}

ShuttleTrip.prototype.sortStopsClosestToDest = function()
{
	if (!stops.loaded)
	{
		return;
	}

	console.log("ShuttleTrip.prototype.sortStopsClosestToDest");

	var destLatLng = new google.maps.LatLng(user.destination.lat, user.destination.lng);
	for (var i = 0; i < stops.stopList.length; i++)
	{
		var thisStop = stops.stopList[i];
		var stopLatLng = new google.maps.LatLng(thisStop.lat, thisStop.lng);
		thisStop.distanceToDest = Math.ceil(distance(destLatLng, stopLatLng));
	}
}