const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

const _ = require('underscore');


const getEnd = (arr) => {
	return getStart(arr.slice(0).reverse());
}


const getStart = (arr) => {
	var start = 0;
	var started = false;

	arr.slice(0).map( (m,i) => {
		if (!m.userDefined) {
			if (!started) {
				started = true;
			}
		}
		else {
			if (!started) {
				start += 1
			}
		}
	});
	return start;
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}


function splitSeqential(origin) {
	var c = 0, result = _.values( _.groupBy(origin, function(el, i, arr) { 
  		return i ? c+= (1 !== el - arr[i-1]) : 0; }) );

	return result;
}

function getFirstAndLast(seq) {
	var c = [];
	for (var s in seq) {
		c.push([seq[s][0], seq[s][seq[s].length-1]])
	}
	return c;
}



export const serializeObjv2 = (markers, activity) => {

	//LOOP THROUGH MARKERS, ASSIGN THE ONES THAT ARE NOT USER DEFINED TO THEIR TIMES
	var elevations = activity.getStream('Altitude').data.filter((e) => {return e});
	var times = activity.generateTimeStream().data.filter((e) => {return e});
	times.unshift(0);
	var starttime = activity.startDate;
	var endtime = activity.endDate;
	var average_speed = activity.getStat('Average Speed').value; //km/s



	//var end = times.length - getEnd(markers);
	//var start = getStart(markers);


	var ri = 0;
	var points = markers.map((m,i) => {

		if (!m.userDefined) {
			var p = createPoint(
				m.location[0],
				m.location[1],
				elevations[ri],
				times[ri],
				starttime);
			ri += 1;
			return p;
		}
		else {
			return null;
		}
	});


	
	//GET POINTS AT END OF USER DEFINED MARKERS
	var sections = getAllIndexes(points, null);
	var sequences = splitSeqential(sections);
	var firstLast = getFirstAndLast(sequences);
	
	console.log(times);
	console.log(points)

	
	for (var i = 0; i < firstLast.length; i++) {
		var start = firstLast[i][0];
		var end = firstLast[i][1] + 1;

		var whole_time = points[start-1].time - points[end].time;
		var whole_distance = 0;


		//CALCULATE WHOLE DISTANCE FROM TWO PREDEFINED POINTS

		var last = markers[start-1].location;
		for (var j = start; j < end; j++) {
			whole_distance += getDistanceFromLatLonInKm(last[0], last[1], markers[j].location[0], markers[j].location[1]);
		}


		//CALCULATE NEW TIME RATIOS FOR POINTS
		last = markers[start].location;
		for (j = start; j < end; j++) {
			var currentDistance = getDistanceFromLatLonInKm(last[0], last[1], markers[j].location[0], markers[j].location[1]);
			var diffTime = (currentDistance/whole_distance) * whole_time;
			var newTime = points[j-1].time.getTime() + (diffTime * 1000);

			points[j] = createPointNoRef(
				markers[j].location[0],
				markers[j].location[1],
				elevations[start],
				newTime);
		}

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

const createPointNoRef = (lat, long, elevation, time) => {
	return new Point(lat, long, {
		ele: elevation, //314.173
		time: new Date(time) //'2018-06-10T17:39:35Z'
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