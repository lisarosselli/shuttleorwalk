/**
 * Some info here
 */

// Get user's current location
function findLocation() {
 	navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
}

function foundLocation(position)
{
 	var lat = position.coords.latitude;
 	var long = position.coords.longitude;
 	alert('Found location: ' + lat + ', ' + long);
}

function noLocation()
{
 	alert('Could not find location');
}

