/**
 *	model.js
 *	
 *	Holds data-state.
 */


// Global Google Map and options variables
var map = null;
var mapOptions = null;

var user = null;
var stops = null;

var MAX_MILE_RADIUS = 5;
var METERS_IN_MILE = 1609.34;
var messageToUser = "";

var infoWindows = [];
var markers = [];