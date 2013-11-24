/**
 *	Shuttleboy Stops
 *
 *	http://shuttleboy.cs50.net/api/1.2/stops?output=jsonp&callback=parseResponse
 */

function Stops()
{
	this.apiurl = "http://shuttleboy.cs50.net/api/1.2/stops?output=json";
	this.stopList = [];
	this.response = null;
	this.loaded = false;
}
	

// Stop fucking around and just use the JSON here until you get it figured out!

Stops.prototype.loadStops = function()
{
	console.log("Stops.loadStops() calling "+ this.apiurl);

	var t = this;
	this.response = $.get(this.apiurl, function(responseJSON) {
		t.stopList = responseJSON;
		t.loaded = true;
	});

}