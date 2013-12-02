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

var MAX_MILE_RADIUS = 5;
var METERS_IN_MILE = 1609.34;
var ORIGIN_BUILDING_PROXIMITY = 50;
var messageToUser = "";
var lastTimeQueried = "";

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//var infoWindows = [];
//var markers = [];