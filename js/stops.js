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
}
	

// Stop fucking around and just use the JSON here until you get it figured out!

Stops.prototype.loadStops = function()
{
	console.log("Stops.loadStops() calling "+ this.apiurl);

	//this.response = $.get(this.apiurl, this.parseJSON());

	var t = this;

	this.response = $.get(this.apiurl, function(responseJSON) {
  	 	console.log("jquery got json?");
		console.log("\t"+responseJSON);

  	 	// In here I'd like to take response.responseJSON objects, 
  	 	// and push them into this.stopList, but "this" no work here.

	});

	console.log("done loadStops");
	console.log("this.response="+this.response);
}

Stops.prototype.parseJSON = function()
{
	console.log("parseJSON");
	console.log(this.response);

}