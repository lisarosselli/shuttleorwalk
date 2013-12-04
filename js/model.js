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
var ORIGIN_BUILDING_PROXIMITY = 50;

/**
 *	These are month short names.
 *	@const
 */
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];