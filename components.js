import * as L from './modules/leaflet/leaflet-src.esm.js';

export function createMapWithWorkoutRoute(workoutData, appendTo) {
  const garminLatLongToNormal = (gl)=>gl/11930465;
  const polylinePoints = [];

  for (let rec of workoutData.recordMesgs) {
    if (!rec.hasOwnProperty('positionLat')) continue;
    polylinePoints.push([garminLatLongToNormal(rec.positionLat),garminLatLongToNormal(rec.positionLong)]);
  }

  if (polylinePoints.length===0) return;

  const startCoordinates = polylinePoints[0];

  let mapElement = document.createElement('div');
  mapElement.id=`map-${workoutData.id_workouts}`;
  mapElement.style.height = '180px';
  appendTo.appendChild(mapElement);
  var map = L.map(mapElement.id).setView(startCoordinates, 7);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
      
  L.polyline(polylinePoints).addTo(map);
}
