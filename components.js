import * as L from './modules/leaflet/leaflet-src.esm.js';

export function createMapWithWorkoutRoute(workoutData, appendTo) {
  const garminCoorToNormal = (gl)=>gl/11930465;

  const polylinePoints = [];
  for (let rec of workoutData.recordMesgs) {
    if (!rec.hasOwnProperty('positionLat')) continue;
    polylinePoints.push([garminCoorToNormal(rec.positionLat),garminCoorToNormal(rec.positionLong)]);
  }

  if (polylinePoints.length===0) return;

  const startCoordinates = polylinePoints[0];
  const startZoom = 7;

  let mapElement = document.createElement('div');
  mapElement.id=`map-${workoutData.id_workouts}`;
  mapElement.style.height = '180px';
  appendTo.appendChild(mapElement);
  var map = L.map(mapElement.id).setView(startCoordinates, startZoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
      
  L.polyline(polylinePoints).addTo(map);
}
