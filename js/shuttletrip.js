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
	shuttletrip.defineStopsClosestToOrig();
	shuttletrip.defineStopsClosestToDest();
	shuttletrip.sortStopsClosestToOrig();
	shuttletrip.sortStopsClosestToDest();
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

ShuttleTrip.prototype.sortStopsClosestToDest = function()
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
}

/**
 *	Selection sort js syntax help and this algorithm curtesy of
 *	Mr. David Shariff: http://davidshariff.com/blog/javascript-selection-sort/
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






