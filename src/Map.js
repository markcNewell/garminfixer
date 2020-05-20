import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, TileLayer, CircleMarker, Polyline, ZoomControl } from 'react-leaflet'
import L from 'leaflet';


const greenIcon = new L.Icon({
  iconUrl: 'icon.png',
  iconSize: [10, 10],
});

const geoViewport = require('@mapbox/geo-viewport');



const GPXMap = ({markers, bounds, updateUserMarkers, addUserMarker}) => {
  const [allMarkers, setAllMarkers] = React.useState([]);
  const [scale, setScale] = React.useState(1);
  const [mapBounds, setMapBounds] = React.useState({});




  const getLoc = () => {
    var c = markers.map(function(e, i) {
      return e.location;
    });
    setAllMarkers(c);
    setScale(Math.round(c.length/100));
  }

  const getBounds = () => {
    const mapEl = document.getElementById('map').getBoundingClientRect();  
    const mapDim = [mapEl.height, mapEl.width];
    var newBounds = bounds.flat();
    setMapBounds(geoViewport.viewport(newBounds, mapDim));
  }

  useEffect(getLoc,[markers]);
  useEffect(getBounds, [bounds]);

	return (
    <Map zoom={mapBounds.zoom-1} center={mapBounds.center} id="map" preferCanvas={true} noMoveStart={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <ZoomControl position={'topright'} />
      {markers.map((point,index) => (
        (!point.userDefined) ? [
          (index%scale === 0 || point.possibleError) ? [
            <CircleMarker
              key={index}
              marker_index={index}
              center={point.location}
              radius={5}
              onClick={addUserMarker}
              color={point.possibleError ? 'red' : 'blue'}
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