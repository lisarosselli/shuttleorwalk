/**
 *	functions.js
 */

/**
 *	Finds the distance between two objects. Both objects are google.maps.LatLng objects.
 *	Returns distance in meters.
 *	Object arguments are expected to be of type google.maps.LatLng.
 */
function distance(objectA, objectB)
{
    var R = 6371;
	var dLat = (objectA.lat() - objectB.lat()) * Math.PI / 180;
	var dLon = (objectA.lng() - objectB.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(objectB.lat() * Math.PI / 180) * Math.cos(objectA.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
};

/**
 *	Reverse Geocode
 */
function reverseGeocode( gmLatLng )
{
	var marker;
	var infowindow = new google.maps.InfoWindow();
	var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': gmLatLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          marker = new google.maps.Marker({
              position: gmLatLng,
              map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}

function getReverseGeocodeInfo( gmLatLng )
{
	var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': gmLatLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      	if (results[0])
      	{
      		console.log("getReverseGeocodeInfo: "+results[0].formatted_address);
      		if (user)
      		{
      			user.placeDestination(gmLatLng, results[0].formatted_address, false);
      		}
      	}
      } else {
      	// TODO: make not so apparent
        alert("Geocoder failed due to: " + status); 
      }
    });
}	

/**
 *	Creates an google.maps info window with some message
 */
function createInfoWindow(windowTitle, windowText)
{
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">'+ windowTitle + '</h4>'+
      '<div id="bodyContent">'+
      '<p>' + windowText + '</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
  		content: contentString
  	});

  	return infowindow;
}

function getLocalDateHours(dateJSON)
{
	var d = new Date(dateJSON);
	var tzo = d.getTimezoneOffset() / 60;
	return d.getHours() + tzo;
}

function getMinuteDifference( dateA, dateB )
{
	var a = new Date(dateA);
	var b = new Date(dateB);
	var shuttleMins = null;

	a.min = a.getMinutes();
	b.min = b.getMinutes();

	if (a.min > b.min)
	{
		shuttleMins = (60 - a.min) + b.min;
	} else if (b.min > a.min)
	{
		shuttleMins = b.min - a.min;
	} else 
	{
		shuttleMins = 60;
	}

	return shuttleMins;
}

function secondsRoundToMinute( seconds )
{
	return Math.round(seconds / 60);
}

function roundToOneDecimal(n)
{
	var num = n / METERS_IN_MILE;
	return num.toFixed(1);
}