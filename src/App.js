import React from "react";
import GPXMap from './components/Map';
import Overlay from './components/Overlay';
import Loader from './components/Loader';
import Draw from './components/Draw';

import {SportsLib} from '@sports-alliance/sports-lib';
import { saveAs } from 'file-saver';

import { serializeObjv2 } from './utils/gpxSerializer';




export default function App() {
	const [file, setFile] = React.useState([]);

	const [uploaderOpen, setUploaderOpen] = React.useState(true);
	const [loaderOpen, setLoaderOpen] = React.useState(false);

	const [event, setEvent] = React.useState({});

	const [markers, setMarkers] = React.useState([]);
	const [bounds, setBounds] = React.useState([[36.5, -12.5],[62.5, 12.5]]);
	const [step, setStep] = React.useState(0);




	const onFileUpload = (file) => {
		setFile(file);
		setLoaderOpen(true);

	    var reader = new FileReader();

	    //IF GPX FILE.
	    if (file[0].path.split(".")[1] === 'gpx') {
		    reader.onload = (function(theFile) {
		        return function(e) {

					SportsLib.importFromGPX(e.target.result).then((event)=>{
						//GET LAT LONG PAIRS
						var lat = event.getActivities()[0].getStream('Latitude').data.filter((e)=>{return e});
						var long = event.getActivities()[0].getStream('Longitude').data.filter((e)=>{return e});
						
						//CALCULATE POSSIBLE ERRORS
						var errors = calculateErrors(lat,long);


						//CREATE OBJECT FOR EACH POINT
						var c = lat.map(function(e, i) {
							return { location:[e, long[i]], userDefined:false, possibleError:errors.includes(i) };
						})


						//SET VALUES
						setMarkers(c);
						setBounds(calculateMapPos(lat,long));
						setLoaderOpen(false);
						setUploaderOpen(false);
						setEvent(event);
						
					}).catch((e) => {
						console.log(e);
					});
		        };
		      })(file[0]);

		    reader.readAsText(file[0]);
	   	}
	   	//IF FIT FILE
	   	else if (file[0].path.split(".")[1] === 'fit'){
		    reader.onload = (function(theFile) {
		        return function(e) {

					SportsLib.importFromFit(e.target.result).then((event)=>{
						//GET LAT LONG PAIRS
						var lat = event.getActivities()[0].getStream('Latitude').data.filter((e)=>{return e});
						var long = event.getActivities()[0].getStream('Longitude').data.filter((e)=>{return e});
						
						//CALCULATE POSSIBLE ERRORS
						var errors = calculateErrors(lat,long);


						//CREATE OBJECT FOR EACH POINT
						var c = lat.map(function(e, i) {
							return { location:[e, long[i]], userDefined:false, possibleError:errors.includes(i) };
						})


						//SET VALUES
						setMarkers(c);
						setBounds(calculateMapPos(lat,long));
						setLoaderOpen(false);
						setUploaderOpen(false);
						setEvent(event);
						
					}).catch((e) => {
						console.log(e);
					});
		        };
		      })(file[0]);

		    reader.readAsArrayBuffer(file[0]);
	   	}
	};






	const addMarker = (e) => {
		//CREATE NEW ERROR
		var marker = {
			userDefined: true,
			location: [e.target.options.center[0],e.target.options.center[1]],
			possibleError: false
		}


		//MAKE COPY OF MARKERS ARRAY
		var c = JSON.stringify(markers);
		var newMarkers = JSON.parse('{ "data":' + c + '}');


		//INSERT NEW MARKER
		newMarkers.data.splice(e.target.options.marker_index+1, 0, marker)
		setMarkers(newMarkers.data);
	}





	const updateMarkerPosition = (e) => {
		//MAKE COPY OF MARKERS ARRAY
		var newMarkers = JSON.parse('{ "data":' + JSON.stringify(markers) + '}');


		//UPDATE POSITION OF DRAGGED MARKER
		newMarkers.data[e.target.options.marker_index].location = [e.target._latlng.lat, e.target._latlng.lng];
		setMarkers(newMarkers.data);
	};





	const calculateMapPos = (lat, long) => {
		return [[Math.min.apply(Math,lat), Math.min.apply(Math,long)],[Math.max.apply(Math,lat), Math.max.apply(Math,long)]];
	};






	const calculateErrors = (lat, long) => {
		var diff = []

		for (const i of Array(lat.length).keys()) {
			if (i !== 0) {
				diff.push((((lat[i] - lat[i-1])**2) + ((long[i] - long[i-1])**2))**0.5);
			}
		}

		const sum = diff.reduce((a, b) => a + b, 0);
		const avg = (sum / diff.length) || 0;

		var c = diff.map((e,i) => {
			return Math.pow(e-avg,2);
		});
		var sd = Math.pow((c.reduce((a, b) => a + b, 0) / c.length),0.5)
		var sd2 = sd*4;
		
		//Everything in 4 standard deviations is 'normal'
		var errors = []
		diff.map((e,i) => {
			if (e > (avg + sd2)) {
				errors.push(i);
				errors.push(i+1);
			}
			return null;
		});

		return errors;
	};






	const onSave = () => {
		var obj = serializeObjv2(markers, event.getActivities()[0]);

		var blob = new Blob([obj], {type: "application/gpx+xml;charset=utf-8"});
		saveAs(blob, "StravaFixer.gpx");

	};






	return (
		<React.Fragment>
			<Loader open={loaderOpen} setOpen={setLoaderOpen} />
			<Overlay onUpload={onFileUpload} open={uploaderOpen} setOpen={setUploaderOpen}/>
			<GPXMap 
				markers={markers}
				updateUserMarkers={updateMarkerPosition}
				addUserMarker={addMarker}
				bounds={bounds}
				step={step}
			/>
			<Draw onSave={onSave} step={step} setStep={setStep}/>
		</React.Fragment>
	);
}