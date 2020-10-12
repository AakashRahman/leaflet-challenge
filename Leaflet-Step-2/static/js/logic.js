//Visualize an Earthquake map using earthquake dataset
//declare a funtion to create map for Earthquakes and Tectoniplates
function createMap(earthquakes, tectoniplates) {

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});
  // Create map object and set default layers 
  var myMap = L.map("mapid", {
    center: [
      40.7, -94.5
    ],
    zoom: 4,
    layers: [satellitemap,grayscalemap, outdoorsmap ]
  });


  // crate a basemap
    var basemaps = {
    "Satellite Map" :satellitemap,
    "Grayscale Map" :grayscalemap,
    "Outdoors Map" :outdoorsmap
  }
  // create overlay map
  var overlay = {
    "Tectonic Plates":tectoniplates,
    "Earthquakes": earthquakes
  }
  // add to myMap
  L.control.layers(basemaps, overlay).addTo(myMap);
  
  // set different color from depth
  function getColor(depth) {
    switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  
 
  // add legend on the map
  var legend = L.control({position: "bottomright"});

    // details for legend
  legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
      depth = [-10, 10, 30, 50, 70, 90];
        
    // Looping throug our destiny interval and generate label with color for each interval
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background: ' + getColor(depth[i]+1) + '"></i> ' +
        depth[i] + (depth[i + 1]? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };

  // Finally, add legend to the map.
  legend.addTo(myMap);  
}  

// create a counter to track remaining async function calls
var remainingCalls = 2;

// create variable to store earthquake results after fetching from api endpoint
var earthquakesLayer = []
// creeate variabel to store fault line results after fetching from api endpoint
var faultlinelLayer = []

// grap the json data and Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  //  GET color radius call to the query URL
  d3.json(queryUrl, function(data) {
    //console.log(data);
    function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // set different color from depth
  function getColor(depth) {
    switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }  

  // set radiuss from magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  var earthquakes = new L.LayerGroup()
  L.geoJson(data, {

  pointToLayer: function (feature, latlong) {
    return L.circleMarker(latlong);
  },

  style: styleInfo,  

 // add tooltip 
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h1> Magnitude:" + feature.properties.mag + "</h1><br> Location: " + feature.properties.place );
    }
  }).addTo(earthquakes);


  earthquakesLayer = earthquakes



  // decrement remainingCalls by 1
  --remainingCalls;
  console.log(`Fetched earthquake data. Remaining calls: ${remainingCalls}`)

  // check if ready to call createMap function
  if (remainingCalls === 0) {
    createMap(earthquakesLayer, faultlinelLayer)
  }

});
// get the tecnotiplates data from reference
var queryUrl1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  //  GET color radius call to the query URL
  d3.json(queryUrl1, function(data) {
    //console.log(data);
    var faultlines = new L.LayerGroup()

    L.geoJson(data, {
      color: "orange",
      weight: 2,
    }).addTo(faultlines);

    faultlinelLayer = faultlines

    // decrement remainingCalls by 1
    --remainingCalls;
    console.log(`Fetched faultline data. Remaining calls: ${remainingCalls}`)

    // check if ready to call createMap function
    if (remainingCalls === 0) {
      createMap(earthquakesLayer, faultlinelLayer)
  }
});