/**
 *	model.js
 *	
 *	Holds data-state.
 */


// Global Google Map and options variables
var map = null;
var mapOptions = null;

var apiVersion = 1.3;
var user = null;
var stops = null;
var trip = null;
var shuttletrip = null;
var messageToUser = null;
var lastTimeQueried = null;
var buildingMatches = [];

var errorCode = {
	noGeolocation: "Not able to geolocate you.",
	noBrowserGeo: "Your browser does not support geolocation.",
	notOnCampus: "Can't find you on campus.",
	defaultPlacement: "Placing you near Harvard Square",
	somethingWrong: "Woah. Something went way wrong.",
	missingInfo: "Info missing. Where are you starting from? Do you have a destination?",
	noShuttles: "There are no appropriate routes running."
}

/**
 *	Maximum radius before you are deemed off-campus.
 *	@const
 */
var MAX_MILE_RADIUS = 5;

/**
 *	Number of meters in a mile.
 *	@const
 */
var METERS_IN_MILE = 1609.34;

/**
 *	How close user must be to be deemed "at" a building.
 *	@const
 */
var ORIGIN_BUILDING_PROXIMITY = 60;

/**
 *	These are month short names.
 *	@const
 */
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];