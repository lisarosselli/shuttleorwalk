/**
 *	routes.js
 *	
 *	Encapsulating routes here
 */

function Routes()
{
	// stop arrays
	this.AllstonCampusExpressStops = [12, 9, 10, 6, 14, 5, 15, 4, 2];
	this.QuadYardExpressStops = [13, 7, 1, 6];
	this.RiverHouseAStops = [8, 1, 12, 10, 6];
	this.RiverHouseBStops = [13, 7, 12, 10, 6, 8, 1];
	this.RiverHouseCStops = [11, 8, 16, 6, 1, 7, 12, 10, 13];

	// route LatLng arrays
	this.AllstonCampusExpressRoute;
	this.QuadYardExpressRoute;
	this.RiverHouseARoute;
	this.RiverHouseBRoute;
	this.RiverHouseCRoute;
}

/*	https://developers.google.com/maps/documentation/javascript/examples/polyline-simple
[
	0 {"stop":"114 Western Ave","lat":null,"lng":null},
	1 {"stop":"Boylston Gate","lat":"42.373078","lng":"-71.117578"},
	2 {"stop":"Harvard Square","lat":"42.373226","lng":"-71.119527"},
	3 {"stop":"HBS Rotary","lat":"42.365290","lng":"-71.122905"},
	4 {"stop":"HKS","lat":"42.371515","lng":"-71.120910"},
	5 {"stop":"i-Lab","lat":"42.364618","lng":"-71.123360"},
	6 {"stop":"Lamont Library","lat":"42.372862","lng":"-71.115046"},
	7 {"stop":"Mass Ave Garden St","lat":"42.375186","lng":"-71.119394"},
	8 {"stop":"Mather House","lat":"42.368719","lng":"-71.115170"},
	9 {"stop":"Maxwell Dworkin","lat":"42.378795","lng":"-71.116738"},
	10 {"stop":"Memorial Hall","lat":"42.376273","lng":"-71.114441"},
	11 {"stop":"Peabody Terrace","lat":"42.367034","lng":"-71.114936"},
	12 {"stop":"Pound Hall","lat":"42.378184","lng":"-71.119992"},
	13 {"stop":"Quad","lat":"42.381820","lng":"-71.125369"},
	14 {"stop":"Soldiers Field Park","lat":"42.364965","lng":"-71.120287"},
	15 {"stop":"Stadium","lat":"42.367007","lng":"-71.124832"},
	16 {"stop":"Winthrop House","lat":"42.370570","lng":"-71.119220"}
]
*/
