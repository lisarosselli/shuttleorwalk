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

	this.origMarker = null;
	this.destMarker = null;

	this.origInfoWindow = null;
	this.destInfoWindow = null;

	this.distanceMatrix = null;
}

ShuttleTrip.prototype.getShuttleTrip = function( userObject )
{
	console.log("ShuttleTrip.prototype.getShuttleTrip");

	stops = new Stops();
	stops.loadStops(stopsAreLoadedCallback);

	if (this.origMarker)
	{
		this.origMarker.setMap(null);
	}

	if (this.destMarker)
	{
		this.destMarker.setMap(null);
	}
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
	var hour = today.getHours();
	var minutes = today.getMinutes();

	day = (day < 10) ? "0"+day : day;
	hour = (hour < 10) ? "0"+hour : hour;
	minutes = (minutes < 10) ? minutes+="0" : minutes;

	// Test only values below
	//day = 25;
	//month = 11;
	//year = 2013;

	//2013-11-25T16:50:00
	var timeString = year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":00";

	console.log("timeString="+timeString);

	shuttletrip.JSONCall = "http://shuttleboy.cs50.net/api/" + apiVersion + "/trips?a=" +
		orig.stop + "&b=" + dest.stop + "&sdt=" + timeString + "&output=json";

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
			} else
			{
				receivedRouteJSON();
				// TODO: mark the stops on the map
			}
		}
	}

	xhr.open('GET', this.JSONCall, true);
	xhr.send('');

}

/**
 *	incrementStops
 *	This is an attempt to find an appropriate shuttle route for the user.
 *	Just because we have an origin stop and a destination stop does not
 *	mean there is a shuttle route that satisfies both requirements.
 *	This attempts to match up the closest few stops to both origin and
 *	destination to a route that is running.
 */
ShuttleTrip.prototype.incrementStops = function()
{
	if (this.origProximity == this.destProximity)
	{
		this.destProximity++;
	} else if (this.destProximity > this.origProximity)
	{
		this.origProximity++;
		this.destProximity--;
	} else
	{
		this.destProximity++;
	}

	if (this.origProximity >= 2 || this.destProximity >= 2 ||
		this.origSortedStops[this.origProximity].stop == this.destSortedStops[this.destProximity].stop)
	{
		// TODO: alert the user there is no appropriate running route at this time
		console.log("ShuttleTrip.prototype.incrementStops :: No appropriate route running right now.")
		return;
	}

	this.queryApiWithStops(this.origSortedStops[this.origProximity], this.destSortedStops[this.destProximity]);
}

ShuttleTrip.prototype.displayShuttleRoute = function()
{
	console.log("ShuttleTrip.prototype.displayShuttleRoute");

	var origStop = this.origSortedStops[this.origProximity];
	var destStop = this.destSortedStops[this.destProximity];

	var origLatLng = new google.maps.LatLng(origStop.lat, origStop.lng);
	var destLatLng = new google.maps.LatLng(destStop.lat, destStop.lng);

	var img = { url: "img/square_marker.png",
					size: new google.maps.Size(23, 24),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(13, 24),
			};

	var shape = { coord: [1, 1, 1, 23, 25, 23, 25 , 1],
			type: 'poly'
	};

	// propagate Google Maps markers and info windows
	this.origMarker = new google.maps.Marker({
		position: origLatLng,
		map: map,
		icon: img,
		shape: shape,
		animation: google.maps.Animation.DROP,
		title: origStop.stop
	})

	this.destMarker = new google.maps.Marker({
		position: destLatLng,
		map: map,
		icon: img,
		shape: shape,
		animation: google.maps.Animation.DROP,
		title: destStop.stop
	})

	this.origInfoWindow = new google.maps.InfoWindow({
		content: this.origSortedStops[this.origProximity].stop
	});

	this.destInfoWindow = new google.maps.InfoWindow({
		content: this.destSortedStops[this.destProximity].stop
	});

	this.origInfoWindow.open(map, this.origMarker);
	this.destInfoWindow.open(map, this.destMarker);

	google.maps.event.addListener(this.destMarker, 'click', function() {
		shuttletrip.destInfoWindow.open(map, shuttletrip.destMarker);
	});

	google.maps.event.addListener(this.origMarker, 'click', function() {
		shuttletrip.origInfoWindow.open(map, shuttletrip.origMarker);
	});
}

ShuttleTrip.prototype.getGoogleDistanceMatrix = function()
{
	console.log("ShuttleTrip.prototype.getGoogleDistanceMatrix");

	var t = this;

	var userOrigin = new google.maps.LatLng(user.currentLocation.lat, user.currentLocation.lng);
	var userDest = new google.maps.LatLng(user.destination.lat, user.destination.lng);
	var origStop = new google.maps.LatLng(this.origSortedStops[this.origProximity].lat, this.origSortedStops[this.origProximity].lng);
	var destStop = new google.maps.LatLng(this.destSortedStops[this.destProximity].lat, this.destSortedStops[this.destProximity].lng);

	var dmRequest = {origins: [userOrigin, destStop],
		destinations: [origStop, userDest],
		travelMode: google.maps.TravelMode.WALKING,
		unitSystem: google.maps.UnitSystem.IMPERIAL
		};

	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(dmRequest, function(response, status) {
		if (status == 'google.maps.DistanceMatrixService.OK' || status == 'OK')
		{
			console.log(response);
			t.distanceMatrix = response;
			receivedShuttleDistanceMatrix();
		} 
	});
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






