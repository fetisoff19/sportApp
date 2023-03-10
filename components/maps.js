import * as L from '../node_modules/leaflet/dist/leaflet-src.esm.js';
import { garminLatLongToNormal, loadCss } from '../utils.js';

// const leafletCssLink = "node_modules/leaflet/dist/leaflet.css";
// if (document.querySelector(`[href="${leafletCssLink}"]`)==null) await loadCss(leafletCssLink);

export function createMapWithWorkoutRoute(workoutData, appendTo, height, width) {

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
  if (height) mapElement.style.height = height + 'px';
  else mapElement.style.height = '180px';
  if (width) mapElement.style.width = width + 'px';
  // mapElement.style.width = '800px';
  appendTo.appendChild(mapElement);
  let map = L.map(mapElement.id).setView(startCoordinates, startZoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  let polyline = L.polyline(polylinePoints).addTo(map);
  map.fitBounds(polyline.getBounds());

  return map;
}
