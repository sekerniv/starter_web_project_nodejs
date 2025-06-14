// services/googleMaps.js
const fetch = require('node-fetch');

async function getDrivingDistances(origin, destinations, apiKey) {
  const destinationStr = destinations
    .map(loc => `${loc.location.latitude},${loc.location.longitude}`)
    .join('|');

  const originStr = `${origin.latitude},${origin.longitude}`;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&key=${apiKey}&mode=driving`;

  const result = await fetch(url);
  const json = await result.json();

  if (json.status !== 'OK') {
    throw new Error(`Google Maps API error: ${json.status}`);
  }

  return json.rows[0].elements.map((el, i) => ({
    ...destinations[i],
    distance: el.distance.value,
    distanceText: el.distance.text
  }));
}

module.exports = { getDrivingDistances };
