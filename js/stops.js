/**
 *	Shuttleboy Stops
 *
 *	http://shuttleboy.cs50.net/api/1.2/stops?output=jsonp&callback=parseResponse
 */

function Stops()
{
	this.apiurl = "http://shuttleboy.cs50.net/api/"+ apiVersion +"/stops?output=json";
	this.stopList = [];
	this.loaded = false;
	this.stopsVisible = false;
	this.markers = [];
	this.infoWindows = [];
}

/**
 *	Load all the shuttle stops
 */
Stops.prototype.loadStops = function( callbackFxn )
{
	console.log("Stops.prototype.loadStops calling "+ this.apiurl);

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
			t.stopList = parsedObject;
			t.loaded = true;
			callbackFxn();
		}
	}

	xhr.open('GET', this.apiurl, true);
	xhr.send('');
}

/**
 *	Display all the shuttle stop markers on map
 */
Stops.prototype.displayMarkers = function()
{
	console.log("displayMarkers");
	if (!this.stopsVisible)
	{
		var img = { url: "img/square_marker.png",
					size: new google.maps.Size(23, 24),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(13, 24),
			};

		var shape = { coord: [1, 1, 1, 23, 25, 23, 25 , 1],
      				type: 'poly'
  			};

  		for (var i = 0; i < this.stopList.length; i++)
  		{
  			var aStop = this.stopList[i];
  			var thisLatLng = new google.maps.LatLng(aStop.lat, aStop.lng);
  			var marker = new google.maps.Marker({
		        position: thisLatLng,
		        map: map,
		        icon: img,
		        shape: shape,
		        animation: google.maps.Animation.DROP,
		        title: aStop.stop
		    });

		    this.markers.push(marker);

		    var t = this;

		    google.maps.event.addListener(marker, 'click', function(e){
		    	console.log("marker clicked "+e.latLng);
		    	//t.toggleInfoWindow(e.latLng);
		    });
		}
	} 
}

Stops.prototype.toggleInfoWindow = function( gmLatLng )
{
	console.log(gmLatLng.lat())

	var markerClicked;

	for (var i = 0; i < this.markers.length; i++)
	{
		console.log(this.markers[i].latLng);
	}
}