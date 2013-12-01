/**
 *	shuttletrip.js
 */

function ShuttleTrip()
{
	console.log("new ShuttleTrip");

	this.origSortedStops = [];
	this.destSortedStops = [];
	this.JSONCall = null;
}

ShuttleTrip.prototype.getShuttleTrip = function( userObject )
{
	console.log("ShuttleTrip.prototype.getShuttleTrip");

	stops = new Stops();
	//stops.loadStops(this.initialLoadCallback);
	stops.loadStops(stopsAreLoaded);
}

ShuttleTrip.prototype.defineAndSortStops = function()
{
	console.log("ShuttleTrip.prototype.defineAndSortStops");
	
	this.defineStopsClosestToOrig();
	this.defineStopsClosestToDest();
	this.sortStopsClosestToOrig();
	this.sortStopsClosestToDest(this.loadedAndSorted);
}

ShuttleTrip.prototype.loadedAndSorted = function()
{
	console.log("ShuttleTrip.prototype.loadedAndSorted");
	shuttletrip.queryApiForRoute(shuttletrip.origSortedStops[0], shuttletrip.destSortedStops[0]);
}

ShuttleTrip.prototype.queryApiForRoute = function(originStop, destStop)
{
	console.log("ShuttleTrip.prototype.queryApiForRoute");
	console.log(originStop.stop);
	console.log(destStop.stop);

	//http://shuttleboy.cs50.net/api/1.3/trips?a=Harvard%20Square&b=Mather%20House&sdt=2013-11-25&output=json
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();

	shuttletrip.JSONCall = "http://shuttleboy.cs50.net/api/" + apiVersion + "/trips?a=" +
		originStop.stop + "&b=" + destStop.stop + "&sdt=" + year + "-" + month + "-" + day +
		"&output=json";

	console.log(shuttletrip.JSONCall);
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

	callbackFxn();
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






