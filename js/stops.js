/**
 *	Shuttleboy Stops
 *
 *	http://shuttleboy.cs50.net/api/1.2/stops?output=jsonp&callback=parseResponse
 */

function Stops()
{
	this.apiurl = "http://shuttleboy.cs50.net/api/"+ apiVersion +"/stops?output=json";
	this.stopList = [];
	this.response = null;
	this.loaded = false;
	this.stopsVisible = false;
	this.markers = [];
	this.infoWindows = [];
}
	

// Stop fucking around and just use the JSON here until you get it figured out!

Stops.prototype.loadStops = function( callbackFxn )
{
	console.log("Stops.loadStops() calling "+ this.apiurl);

	var t = this;
	this.response = $.get(this.apiurl, function(responseJSON) {
		t.stopList = responseJSON;
		t.loaded = true;
		callbackFxn();
	});
}

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
		        title: aStop.stop
		    });

		    this.markers.push(marker);
		}

		for (var i = 0; i < this.markers.length; i++)
		{
			var thisMarker = this.markers[i];
			var infoWindow = createInfoWindow("", thisMarker.title);
		 	infoWindow.open(map, thisMarker);
		 	this.infoWindows.push(infoWindow);
		}
	} 
}