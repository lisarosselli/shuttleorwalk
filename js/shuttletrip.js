/**
 *	shuttletrip.js
 */

function ShuttleTrip()
{
	console.log("new ShuttleTrip");

	this.origSortedStops = [];
	this.destSortedStops = [];
	this.origProximity = 0;
	this.destProximity = 0;
	this.JSONCall = null;
	this.routeResponse = null;
}

ShuttleTrip.prototype.getShuttleTrip = function( userObject )
{
	console.log("ShuttleTrip.prototype.getShuttleTrip");

	stops = new Stops();
	//stops.loadStops(this.initialLoadCallback);
	stops.loadStops(stopsAreLoadedCallback);
}

ShuttleTrip.prototype.defineAndSortStops = function()
{
	console.log("ShuttleTrip.prototype.defineAndSortStops");
	
	this.defineStopsClosestToOrig();
	this.defineStopsClosestToDest();
	this.sortStopsClosestToOrig();
	this.sortStopsClosestToDest(this.loadedAndSorted);
}

ShuttleTrip.prototype.beginQueryApiForRoute = function()
{
	console.log("ShuttleTrip.prototype.queryApiForRoute");
	this.queryApiWithStops(this.origSortedStops[0], this.destSortedStops[0]);
}

ShuttleTrip.prototype.queryApiWithStops = function( orig, dest)
{
	console.log("ShuttleTrip.prototype.queryApiWithStops");

	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();

	shuttletrip.JSONCall = "http://shuttleboy.cs50.net/api/" + apiVersion + "/trips?a=" +
		orig.stop + "&b=" + dest.stop + "&sdt=" + year + "-" + month + "-" + day +
		"&output=json";

	console.log(shuttletrip.JSONCall);


	var xhr = new XMLHttpRequest;
	xhr.onreadystatechange = ensureReadiness;

	var t = this;

	function ensureReadiness()
	{
		if (xhr.readyState < 4)
		{
			return;
		}

		if (xhr.status != 200)
		{
			return;
		}

		if (xhr.readyState === 4)
		{
			var parsedObject = JSON.parse(xhr.response);
			t.routeResponse = parsedObject;
			console.log("parsedObject!="+t.routeResponse);
			if (t.routeResponse == null || t.routeResponse.length == 0)
			{
				noRouteForStopsCallback();
			}
		}
	}

	xhr.open('GET', this.JSONCall, true);
	xhr.send('');

}

ShuttleTrip.prototype.incrementStops = function()
{
	if (this.origProximity == this.destProximity)
	{
		this.destProximity++;
	} else if (this.destProximity > this.origProximity)
	{
		this.origProximity++;
	}

	if (this.origProximity >= 2 || this.destProximity >= 2 ||
		this.origSortedStops[this.origProximity].stop == this.destSortedStops[destProximity].stop)
	{
		// TODO: alert the user there is no appropriate running route at this time
		console.log("ShuttleTrip.prototype.incrementStops :: No appropriate route running right now.")
		return;
	}

	this.queryApiWithStops(this.origSortedStops[this.origProximity], this.destSortedStops[this.destProximity]);
}

ShuttleTrip.prototype.defineStopsClosestToOrig = function()
{
	if (!stops.loaded)
	{
		return ;
	}

	console.log("ShuttleTrip.prototype.defineStopsClosestToOrig");

	var origLatLng = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
	for (var i = 0; i < stops.stopList.length; i++)
	{
		var thisStop = stops.stopList[i];
		var stopLatLng = new google.maps.LatLng(thisStop.lat, thisStop.lng);
		thisStop.distanceToOrigin = Math.ceil(distance(origLatLng, stopLatLng));
	}
}

ShuttleTrip.prototype.defineStopsClosestToDest = function()
{
	if (!stops.loaded)
	{
		return;
	}

	console.log("ShuttleTrip.prototype.defineStopsClosestToDest");

	var destLatLng = new google.maps.LatLng(user.destination.lat, user.destination.lng);
	for (var i = 0; i < stops.stopList.length; i++)
	{
		var thisStop = stops.stopList[i];
		var stopLatLng = new google.maps.LatLng(thisStop.lat, thisStop.lng);
		thisStop.distanceToDest = Math.ceil(distance(destLatLng, stopLatLng));
	}
}

ShuttleTrip.prototype.sortStopsClosestToOrig = function()
{
	console.log("ShuttleTrip.prototype.sortStopsClosestToOrig");

	this.origSortedStops = stops.stopList.slice(0);

	var direction = 'ASC';
    var smallestValueIndex;
    var inputList = this.origSortedStops;
	var arrSize = this.origSortedStops.length;

	for (var i = 0; i < arrSize; i++)
	{
		// current smallest value in the array
		smallestValueIndex = i;

		for (var k = i+1; k < arrSize; k++)
		{
			if (compare(inputList[k].distanceToOrigin, inputList[smallestValueIndex].distanceToOrigin, direction) === true) {
				smallestValueIndex = k;
			}
		}

		// a new smallest value was assigned, perform a swap !
        if (smallestValueIndex !== i) {
            var tmp = inputList[i];
            inputList[i] = inputList[smallestValueIndex];
            inputList[smallestValueIndex] = tmp;
        }

	}
}

ShuttleTrip.prototype.sortStopsClosestToDest = function(callbackFxn)
{
	console.log("ShuttleTrip.prototype.sortStopsClosestToDest");

	this.destSortedStops = stops.stopList.slice(0);

	var direction = 'ASC';
    var smallestValueIndex;
    var inputList = this.destSortedStops;
	var arrSize = this.destSortedStops.length;

	for (var i = 0; i < arrSize; i++)
	{
		// current smallest value in the array
		smallestValueIndex = i;

		for (var k = i+1; k < arrSize; k++)
		{
			if (compare(inputList[k].distanceToDest, inputList[smallestValueIndex].distanceToDest, direction) === true) {
				smallestValueIndex = k;
			}
		}

		// a new smallest value was assigned, perform a swap !
        if (smallestValueIndex !== i) {
            var tmp = inputList[i];
            inputList[i] = inputList[smallestValueIndex];
            inputList[smallestValueIndex] = tmp;
        }

	}

	stopsAreSortedCallback();
}

/**
 *	Selection sort js syntax help and this algorithm curtesy of
 *	David Shariff: http://davidshariff.com/blog/javascript-selection-sort/
 */
function compare(a, b, sortDir) 
{
	if (sortDir === 'ASC') 
	{
    	return a < b ? true : b;         
    } else if (sortDir === 'DESC') 
    {             
        return a > b ? true : b;
    }

    return false; // error
}






