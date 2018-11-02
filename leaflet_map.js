var app;
var myMap;
var mapFullScreen;

//Map will be created here
function initMap() {
	mapFullScreen = false;
	//Start page without fullpaging automatically
	myMap = L.map('map').setView([51.505, -0.09], 7);
	//degault location, center of map

	//var locationiqtoken = 960b659c86dc12;
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoibGluaDAwMDYiLCJhIjoiY2pubDNiOHhuMDJ0bzN2b3pvYjFwa2UxaSJ9.BVc1SC-6giTzsse9L1Xaxw'
	}).addTo(myMap);
	//Map request, fufilling requirements and saving via local

	var fullScreen = L.Control.extend({
		//This allows the full screen button to be placed on top of the map
		onAdd: function () {

			var input = document.getElementById("fullButton");
			input.addEventListener('click', full);
			return input;

		}
	});

	(new fullScreen).addTo(myMap);

	//Search box input will start with this by default
	app = new Vue({
      el: "#search",
      data: {
			map_search: '',
			input_placeholder: 'Search',
			nearestLocation: "",
			searchResults: [],
			colors: {green: "rgb(0,228,0)", yellow: "rgb(255,255,0)", orange: "rgb(255,126,0)", red: "rgb(255,0,0)", purple: "rgb(143,63,151)", maroon: "rgb(126,0,35)"}
			
		
        },
	  methods: {
		  background: function (info){
				  if(info.parameter === "pm10"){
					  if(info.value > 0 && info.value < 55){
						  
						  return "background-color: "+ app.colors.green 
					  }
				  }
				  else{
					  
					return "background-color: teal;"
				  }
		  }
	  }
        
  })

    myMap.on('zoomend', requestUpdate); //updates table with zoom change 
	//Search box will be updated with the location where the map is centered
	//Only when movement/zoom actions are complete
	myMap.on('dragend', function () {
		//function changes search box info based on user panning the map
		var lat = myMap.getCenter().lat.toFixed(4);
		var lng = myMap.getCenter().lng.toFixed(4);
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://us1.locationiq.com/v1/reverse.php?key=960b659c86dc12&lat=" + lat + "&lon=" + lng + "&format=json",
			"method": "GET"
		}

		$.ajax(settings).done(function (response) {

			var loc = response.address.state;

			if (loc === undefined) {
				loc = response.address.country;
			}

			app.input_placeholder = loc + " (" + lat + "," + lng + ")";
			//Fields to return the location via lat+long
		}).catch(function () {
				app.input_placeholder = "Ocean" + " (" + lat + "," + lng + ")"
			}
			//An error will occur in the GET request if drag over ocean, better way to do this?
		);
		requestUpdate(); //update table after drag
	})

	var request = {
		//Request to AQ for latest measurements for adding markers
		url: "https://api.openaq.org/v1/latest?limit=10000", // requesting  maximum measurement locations
		dataType: "json",
		success: addMarkers
	};
	$.ajax(request);
	//Ajax request

}
//End of initMap

//--------------------//

function changeCenter() {
	//Adjusts search box if user enters lat/lon
	
	var latlng = app.map_search.split(",");

	myMap.setView([latlng[0], latlng[1]], 8);
	requestUpdate(); //update table after lat long search 
}
//end of changeCenter

//--------------------------------//

//Adjusts search box if user enters name of location
function mapSearch() {
	var test = app.map_search.split(",");
	if (test.length > 1 && isNaN(test[0]) == false && isNaN(test[1]) == false) {
		changeCenter();
	} else {
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.locationiq.com/v1/autocomplete.php?key=960b659c86dc12&q=" + app.map_search,
			"method": "GET"
		}

		$.ajax(settings).done(function (response) {
			//console.log(response);
			myMap.setView([response[0].lat, response[0].lon], 7);
			requestUpdate(); // table update after search of location 
		});

	}
}
//end of mapSearch

//-------------------//

//Adds markers to the map
function addMarkers(data) {

	console.log(data);
	var i;
	var lat;
	var lon;
	var marker;
	var parameter;
	var value;
	var unit;
	var testCluster = L.markerClusterGroup();

	for (i = 0; i < data.results.length; i++) {
		if (data.results[i].hasOwnProperty("coordinates")) {

			var paramString = "";
			var counter;
			lat = data.results[i].coordinates.latitude;
			lon = data.results[i].coordinates.longitude;
			//testCluster.addLayer(L.marker([lat, lon])); //testing clusters
			marker = L.marker([lat, lon]) //.addTo(myMap);

			for (counter = 0; counter < data.results[i].measurements.length; counter++) {
				parameter = data.results[i].measurements[counter].parameter.toString();
				value = data.results[i].measurements[counter].value.toString();
				unit = data.results[i].measurements[counter].unit.toString();
				paramString = paramString + "<i>" + parameter + "</i>: " + value + " " + unit + "<br>";
			}
			marker.bindPopup("<b>Measurements:</b><br>" + paramString);

			marker.on('mouseover', function (e) {
				this.openPopup();
			});
			marker.on('mouseout', function (e) {
				this.closePopup();
			});
			testCluster.addLayer(marker); //used for clustering 

		}

	}

	myMap.addLayer(testCluster); //used for clustering
}

function full(){ //Used to adjust styles when full screen button is toggled
	var textBox = document.getElementById('textBox');
	var table = document.getElementById('realTable');
	var tableTit = document.getElementById('tableTitle');
	var tableHed = document.getElementById('tableLocation');
	if(mapFullScreen === false){
		
		var mapContainer = document.getElementById('map');
		table.style.zIndex = '0';
		tableTit.style.zIndex = '0';
		tableHed.style.zIndex = '0';
		mapContainer.style.width = '100%';
		mapFullScreen = true;
		textBox.style.top= "0px";
	}
	else{
		
		var mapContainer = document.getElementById('map');
		table.style.zIndex= '1000';
		tableTit.style.zIndex= '1000';
		tableHed.style.zIndex= '1000';
		mapContainer.style.width = '75%';
		mapFullScreen = false;
		textBox.style.top = "24px";
	}

}

function requestUpdate(){
	var lat = myMap.getCenter().lat.toFixed(2);
	var lng = myMap.getCenter().lng.toFixed(2);
	
	 var req3= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=100");
	 var req4= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=1000");
	 var req5= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=10000");
	 var req6= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=100000");
	 var req7= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=1000000");
	 var req8= $.getJSON("https://api.openaq.org/v1/latest?coordinates="+lat+","+lng+"&radius=2000000"); //Could go larger but not sure if its necessary
	 
	Promise.all([req3, req4, req5, req6, req7,req8])
	.then(data => {
			if(data[0].results.length > 0){
				updateTable(data[0]);
				
			}
			else if(data[1].results.length > 0){
				updateTable(data[1]);
			
			}
			else if(data[2].results.length > 0){
				updateTable(data[2]);
				
			}
			else if(data[3].results.length > 0){
				updateTable(data[3]);
				
			}
			else if(data[4].results.length > 0){
				updateTable(data[4]);
				
			}
			else if(data[5].results.length > 0){
				updateTable(data[5]);
				
			}
			
	});
	 

}
function updateTable(data){
	if (data.results.length > 0){
		app.searchResults.length = 0;
		app.nearestLocation = data.results[0].location;
		var i;
		var param;
		var un;
		var val;
		for(i=0; i < data.results[0].measurements.length; i++){
			param = data.results[0].measurements[i].parameter;
			val = data.results[0].measurements[i].value;
			un = data.results[0].measurements[i].unit;
			app.searchResults.push( {parameter: param, value: val, unit: un});
			
		}
	}

}

