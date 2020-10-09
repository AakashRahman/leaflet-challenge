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

// Store our API endpoint

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
  }
}

  // // set different color from magnitude
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
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

    return magnitude * 5;
  }
  //   // GeoJSON layer
    L.geoJson(data, {
      // Maken cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // cirecle style
      style: styleInfo,
      // bind popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h1>  Magnitude:  " + feature.properties.mag + "</h1><br> <h1>Location: " + feature.properties.place +"</h1>");
      }
    }).addTo(myMap);
  
  // add an object legend
    var legend = L.control({position: "bottomright"});
  
    // details for legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];
  
  //     // Looping through
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, our legend to the map.
    legend.addTo(myMap);
  });