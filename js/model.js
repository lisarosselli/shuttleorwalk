/**
 *	model.js
 *	
 *	Holds data-state.
 */


// Global Google Map and options variables
var map = null;
var mapOptions = null;

// Shuttleboy API version
var apiVersion = 1.3;

// App data objects
var user = null;
var stops = null;
var trip = null;
var shuttletrip = null;
var messageToUser = null;
var lastTimeQueried = null;
var buildingMatches = [];
var uiPageIndex = 0;

var errorCode = {
	noGeolocation: "Not able to geolocate you.",
	noBrowserGeo: "Your browser does not support geolocation.",
	notOnCampus: "Can't find you on campus.",
	defaultPlacement: "Placing you near Harvard Coop.",
	somethingWrong: "Woah. Something went way wrong.",
	missingInfo: "Info missing. Where are you starting from? Do you have a destination?",
	noShuttles: "There are no appropriate routes running."
}

/**
 *	Maximum radius before you are deemed off-campus.
 *	@const
 */
var MAX_MILE_RADIUS = 3;

/**
 *	Number of meters in a mile.
 *	@const
 */
var METERS_IN_MILE = 1609.34;

/**
 *	How close user must be to be deemed "at" a building, in meters.
 *	@const
 */
var ORIGIN_BUILDING_PROXIMITY = 60;

/**
 *	These are month short names.
 *	@const
 */
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];