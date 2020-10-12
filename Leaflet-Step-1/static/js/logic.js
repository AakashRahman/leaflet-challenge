//Visualize an Earthquake map using earthquake dataset

 // Creating our initial map object

var myMap = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 4,
  //layers: [streetmap]
});
 // Create our map, giving it the streetmap and earthquakes layers to display on load
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// grap the json data and Store our API endpoint

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
  console.log(data);
  function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  }
}

  // // set different color from depth
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
  //   // GeoJSON layer
    L.geoJson(data, {
      // create cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // cirecle style
      style: styleInfo,
      // bind popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h1> Magnitude:" + feature.properties.mag + "</h1><br> Location: " + feature.properties.place );
      }
    }).addTo(myMap);
  
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
  });