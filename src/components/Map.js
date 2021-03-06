import React, { useEffect } from 'react';
import { Map, Marker, TileLayer, CircleMarker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';



var greenIcon = L.icon({
    iconUrl: require('../media/icon.png'),
    iconSize: [15, 15]
});

const geoViewport = require('@mapbox/geo-viewport');



const GPXMap = ({markers, bounds, updateUserMarkers, addUserMarker, step}) => {
  const [allMarkers, setAllMarkers] = React.useState([]);
  const [scale, setScale] = React.useState(1);
  const [mapBounds, setMapBounds] = React.useState({});




  const getLoc = () => {
    var c = markers.map(function(e, i) {
      return e.location;
    });
    setAllMarkers(c);
    setScale(Math.round(c.length/step));
  }

  const getBounds = () => {
    const mapEl = document.getElementById('map').getBoundingClientRect();  
    const mapDim = [mapEl.height, mapEl.width];
    var newBounds = bounds.flat();
    setMapBounds(geoViewport.viewport(newBounds, mapDim));
  }

  useEffect(getLoc,[markers, step]);
  useEffect(getBounds, [bounds]);

	return (
    <Map zoom={mapBounds.zoom-1} center={mapBounds.center} id="map" preferCanvas={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <ZoomControl position={'topright'} />
      {markers.map((point,index) => (
        (!point.userDefined) ? [
          (point.possibleError) ? [
            <Polyline
              positions={[markers[index].location,markers[index+1].location]}
              color={'blue'}
              key={index}
              marker_index={index}
              weight={5}
            />,
            <Polyline
              positions={[markers[index].location,markers[index+1].location]}
              color={'blue'}
              onClick={addUserMarker}
              key={index}
              marker_index={index}
              weight={25}
              opacity={0}
            />
          ]:[]
        ] : [
        <Marker
          key={index}
          marker_index={index}
          position={point.location}
          draggable={true}
          onDragend={updateUserMarkers}
          icon={greenIcon}
        />,
        <Polyline
          positions={[markers[index].location,markers[index+1].location]}
          color={'blue'}
          key={index}
          marker_index={index}
          weight={5}
        />,
        <Polyline
          positions={[markers[index].location,markers[index+1].location]}
          color={'blue'}
          onClick={addUserMarker}
          key={index}
          marker_index={index}
          weight={25}
          opacity={0}
        />
        ]  
      ))}

      <Polyline
        positions={allMarkers}
        color={'red'}
      />


    </Map>
  );
}

export default GPXMap;