// Create the tile layer that will be the background of our map
// var map = L.map("map-id", {
//   center: [40.73, -74.0059],
//   zoom: 12,
// });
//  function createMap(sampling_location) {

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

d3.csv('./static/data/data.csv', function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.sampling_location);
  console.log(data)
});

var baseMaps = {
  "Light Map": lightmap
};

var sampling_location =  sampling_location
// Initialize all of the LayerGroups we'll be using
var overlayMaps = {
  "sampling_location" : sampling_location
  // oxidation_reduction_potential_mv_bottom_sample: new L.LayerGroup(),
  // top_bottom_coliform_cells_100_ml: new L.LayerGroup(),
  // bottom_salinity_psu: new L.LayerGroup(),
  // top_dissolved_organic_carbon_mg_l: new L.LayerGroup(),
  // top_fecal_coliform_bacteria_cells_100ml: new L.LayerGroup()
};

// var sampling_location =  sampling_location

var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [lightmap]
  });

// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(map);

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var sampling_location = response.sampling_location;

  // Initialize an array to hold bike markers
  var sampling_location = [];

  // Loop through the stations array
  for (var index = 0; index < sampling_location.length; index++) {
    var sampling_location = sampling_location[index];

    // For each station, create a marker and bind a popup with the station's name
    var sampling_location = L.marker([sampling_location.lat, sampling_location.long])
      .bindPopup("<h3>" + sampling_location.sampling_location + "<h3><h3>Capacity: " + sampling_location.bottom_salinity_psu + "<h3>");

    // Add the marker to the bikeMarkers array
    sampling_location.push(sampling_location);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  // var createMap = createMap(L.tileLayer(sampling_location));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.csv('./static/data/data.csv',createMarkers);


// Create the map with our layers
// var map = L.map("map-id", {
//   center: [40.73, -74.0059],
//   zoom: 12,
//   layers: [
//     layers.oxidation_reduction_potential_mv_bottom_sample,
//     layers.top_bottom_coliform_cells_100_ml,
//     layers.bottom_salinity_psu,
//     layers.top_dissolved_organic_carbon_mg_l,
//     layers.top_fecal_coliform_bacteria_cells_100ml
//   ]
// });

// Add our 'lightmap' tile layer to the map
// lightmap.addTo(map);

// // Create an overlays object to add to the layer control
// var overlays = {
//   "oxidation_reduction_potential_mv_bottom_sample": layers.oxidation_reduction_potential_mv_bottom_sample,
//   "top_bottom_coliform_cells_100_ml": layers.top_bottom_coliform_cells_100_ml,
//   "bottom_salinity_psu": layers.bottom_salinity_psu,
//   "top_dissolved_organic_carbon_mg_l": layers.top_dissolved_organic_carbon_mg_l,
//   "top_fecal_coliform_bacteria_cells_100ml": layers.top_fecal_coliform_bacteria_cells_100ml
// };

// // Create a control for our layers, add our overlay layers to it
// L.control.layers(null, overlays).addTo(map);

// // Create a legend to display information about our map
// var info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//   var div = L.DomUtil.create("div", "legend");
//   return div;
// };
// // Add the info legend to the map
// info.addTo(map);

// // Initialize an object containing icons for each layer group
// var icons = {
//   oxidation_reduction_potential_mv_bottom_sample: L.ExtraMarkers.icon({
//     icon: "ion-settings",
//     iconColor: "white",
//     markerColor: "yellow",
//     shape: "star"
//   }),
//   top_bottom_coliform_cells_100_ml: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "red",
//     shape: "circle"
//   }),
//   top_ammonium_mg_l: L.ExtraMarkers.icon({
//     icon: "ion-minus-circled",
//     iconColor: "white",
//     markerColor: "blue-dark",
//     shape: "penta"
//   }),
//   bottom_salinity_psu: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "orange",
//     shape: "circle"
//   }),
//   oakwood_bod_top_sample_mg_l: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "green",
//     shape: "circle"
//   })
// };

// // Perform an API call to the Citi Bike Station Information endpoint
// d3.csv('./data/data').then(function(nycData){

//   console.log(nycData);
  
//   //nyc data
//   nycData.forEach(function(data){
//       data.top_ammonium_mg_l = +data.top_ammonium_mg_l;
//       data.oakwood_bod_top_sample_mg_l = +data.oakwood_bod_top_sample_mg_l;
//       data.oxidation_reduction_potential_mv_bottom_sample = +oxidation_reduction_potential_mv_bottom_sample;
//       data.ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l = +data.ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l;
//       data.bottom_salinity_psu = +data.bottom_salinity_psu;
//       data.top_bottom_coliform_cells_100_ml = +data.top_bottom_coliform_cells_100_ml;
//   });
//   console.log(data);

// // d3.json("https://data.cityofnewyork.us/resource/5uug-f49n.json", function(infoRes) {

//     // var updatedAt = infoRes.last_updated;
    
//     // var stationInfo = infoRes.data.stations;

//     // Create an object to keep of the number of markers in each layer
//     var sampling_location = {
//       oxidation_reduction_potential_mv_bottom_sample: 0,
//       top_bottom_coliform_cells_100_ml: 0,
//       bottom_salinity_psu: 0,
//       top_dissolved_organic_carbon_mg_l: 0,
//       top_fecal_coliform_bacteria_cells_100ml: 0
//     };

//     // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
//     var sampling_location;

//     // Loop through the stations (they're the same size and have partially matching data)
//     for (var i = 0; i < sampling_location.length; i++) {

//       // Create a new station object with properties of both station objects
//       var sampling_location = Object.assign({}, sampling_locationInfo[i]);
//       // If a station is listed but not installed, it's coming soon
//       if (!sampling_location.is_installed) {
//         sampling_locationCode = "oxidation_reduction_potential_mv_bottom_sample";
//       }
//       // If a station has no bikes available, it's empty
//       else if (!sampling_location.num_bikes_available) {
//         sampling_locationCode = "top_bottom_coliform_cells_100_ml";
//       }
//       // If a station is installed but isn't renting, it's out of order
//       else if (sampling_location.is_installed && !station.is_renting) {
//         sampling_locationCode = "top_fecal_coliform_bacteria_cells_100ml";
//       }
//       // If a station has less than 5 bikes, it's status is low
//       else if (sampling_location.num_bikes_available < 5) {
//         sampling_locationCode = "bottom_salinity_psu";
//       }
//       // Otherwise the station is normal
//       else {
//         sampling_locationCode = "top_dissolved_organic_carbon_mg_l";
//       }

//       // Update the station count
//       sampling_location[sampling_locationCode]++;
//       // Create a new marker with the appropriate icon and coordinates
//       var newMarker = L.marker([sampling_location.lat, sampling_location.long], {
//         icon: icons[sampling_locationCode]
//       });

//       // Add the new marker to the appropriate layer
//       newMarker.addTo(layers[sampling_locationCode]);

//       // Bind a popup to the marker that will  display on click. This will be rendered as HTML
//       newMarker.bindPopup(sampling_location.sampling_location + "<br> : " + sampling_location.top_salinity_psu + "<br>" + sampling_location.top_fecal_coliform_bacteria_cells_100ml + " top_fecal_coliform_bacteria_cells_100ml");
//     }

//     // Call the updateLegend function, which will... update the legend!
//     update(sampling_location);
//   });


// // Update the legend's innerHTML with the last updated time and station count
// function update(sampling_location) {
//   document.querySelector(".legend").HTML = [
//     "<p class='top_fecal_coliform_bacteria_cells_100ml'>top_fecal_coliform_bacteria_cells_100ml: " + sampling_location.top_fecal_coliform_bacteria_cells_100ml + "</p>",
//     "<p class='oxidation_reduction_potential_mv_bottom_sample'>Stations oxidation_reduction_potential_mv_bottom_sample: " + sampling_location.oxidation_reduction_potential_mv_bottom_sample + "</p>",
//     "<p class='top_bottom_coliform_cells_100_ml Stations'>top_bottom_coliform_cells_100_ml Stations: " + sampling_location.top_bottom_coliform_cells_100_ml + "</p>",
//     "<p class='bottom_salinity_psu'>bottom_salinity_psu Stations: " + sampling_location.bottom_salinity_psu + "</p>",
//     "<p class='top_dissolved_organic_carbon_mg_l'>top_dissolved_organic_carbon_mg_l Stations: " + sampling_location.top_dissolved_organic_carbon_mg_l + "</p>"
//   ].join("");

