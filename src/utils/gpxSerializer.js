const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;


export const serializeObj = (obj, markers) => {

	var ele = obj.getActivities()[0].getStream('Altitude').data.filter((e) => {return e});
	var time = obj.getActivities()[0].generateTimeStream().data.filter((e) => {return e});
	time.unshift(0);


	var starttime = obj.getActivities()[0].startDate;
	var average_speed = obj.getActivities()[0].getStat('Average Speed').value; //km/s


	var sinceLastRealPoint = 0;
	var pointsAdded = 0;
	var points = [];
	for (var i in markers) {
		var lat = markers[i].location[0];
		var long = markers[i].location[1];

		if (markers[i].userDefined) {
			sinceLastRealPoint += 1;
			pointsAdded += 1;
		}
		else {
			sinceLastRealPoint = 0;
		}

		var index = i - (sinceLastRealPoint + pointsAdded);
		var distance = getDistanceFromLatLonInKm(lat, long, markers[i-sinceLastRealPoint].location[0], markers[i-sinceLastRealPoint].location[1])
		var t = time[index] + (distance * average_speed);
		//do sinceLastRealPoint distance by average speed to get new time

		points.push(createPoint(lat, long, ele[index], t, starttime));
	}


	const gpxData = new GarminBuilder();
	gpxData.setSegmentPoints(points);

	return buildGPX(gpxData.toObject())

};



const createPoint = (lat, long, elevation, time, starttime) => {
	return new Point(lat, long, {
		ele: elevation, //314.173
		time: new Date(starttime.getTime() + (time * 1000)) //'2018-06-10T17:39:35Z'
	})
};


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}


function deg2rad(deg) {
  return deg * (Math.PI/180)
}