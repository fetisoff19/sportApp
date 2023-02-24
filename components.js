import * as L from './modules/leaflet/leaflet-src.esm.js';
import { garminLatLongToNormal } from './utils.js';

export function createMapWithWorkoutRoute(workoutData, appendTo) {
  const polylinePoints = [];
  for (let rec of workoutData.recordMesgs) {
    if (!rec.hasOwnProperty('positionLat')) continue;
    polylinePoints.push( garminLatLongToNormal([rec.positionLat, rec.positionLong]) );
  }

  if (polylinePoints.length===0) return;

  const startCoordinates = polylinePoints[0];
  const startZoom = 7;

  let mapElement = document.createElement('div');
  mapElement.id=`map-${workoutData.id_workouts}`;
  mapElement.style.height = '180px';
  // mapElement.style.width = '800px';
  appendTo.appendChild(mapElement);
  let map = L.map(mapElement.id).setView(startCoordinates, startZoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  let polyline = L.polyline(polylinePoints).addTo(map);
  map.fitBounds(polyline.getBounds());
}
