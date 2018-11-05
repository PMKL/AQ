var app;
var app2;
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

	//Separate Vue app for the banner 
	app2 = new Vue({
		el: "#banner",
		data: {
			display: false,
			discription: ""
		}

	});

	//Search box input will start with this by default
	app = new Vue({
		el: "#search",
		data: {
			map_search: '',
			input_placeholder: 'Search',
			nearestLocation: "",
			searchResults: [],
			colors: {
				green: "rgb(0,228,0)",
				yellow: "rgb(255,255,0)",
				orange: "rgb(255,126,0)",
				red: "rgb(255,0,0)",
				purple: "rgb(143,63,151)",
				maroon: "rgb(126,0,35)"
			},
			filter_type: "all", 
            filter_type_options: [
                { value: "all", text: "All" },
                { value: "pm10", text: "pm10" },
                { value: "pm25", text: "pm25" },
                { value: "no2", text: "no2" },
				{ value: "so2", text: "so2" },
				{ value: "co", text: "co" },
				{ value: "o3", text: "o3" }
				
            ],
			filter_sign: "-",
			filter_amount: "0",
			filter_specifics_options: [
                { value: "=", text: "=" },
                { value: ">", text: ">" },
                { value: "<", text: "<" },
				{ value: "-", text: "-" }
					
				
            ]
		},
		methods: {
			//Method used to change the background color of table data and banner for warning messages
			background: function (info) {
				if (info.parameter === "pm10") {
					var back = pmTen(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					} //if orange, red, purple or maroon initiate the banner
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} //if red or yellow  change the table data font to black 
					else {
						return "background-color: " + pmTen(info)
					} //otherwise the table data font color will be white 					
				} else if (info.parameter === "no2") {
					var back = noTwo(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					}
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} else {
						return "background-color: " + noTwo(info)
					}
				} else if (info.parameter === "so2") {
					var back = soTwo(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					}
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} else {
						return "background-color: " + soTwo(info)
					}
				} else if (info.parameter === "co") {
					var back = carbonMono(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					}
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} else {
						return "background-color: " + carbonMono(info)
					}
				} else if (info.parameter === "pm25") {
					var back = pmTwoFive(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					}
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} else {
						return "background-color: " + pmTwoFive(info)
					}
				} else if (info.parameter === "o3") {
					var back = oThree(info);
					if (back === "rgb(255,126,0)" || back === "rgb(255,0,0)" || back === "rgb(143,63,151)" || back === "rgb(126,0,35)") {
						app2.display = true;
						changeBanner(back);
					}
					if (back === "rgb(255,0,0)" || back === "rgb(255,255,0)") {
						var font = ";color: black"
						return "background-color: " + back + font
					} else {
						return "background-color: " + oThree(info)
					}
				} else {

					return "background-color: white;"
				}
			}
		}
	})

	myMap.on('zoomend', requestUpdate);
	//updates table with zoom change 
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
		requestUpdate();
		//update table after drag
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
//End of addMarkers

//------------------//

//Used to adjust styles when full screen button is toggled
function full(){ //Used to adjust styles when full screen button is toggled
	var textBox = document.getElementById('textBox');
	var table = document.getElementById('realTable');
	var tableTit = document.getElementById('tableTitle');
	var tableHed = document.getElementById('tableLocation');
	var leg = document.getElementById('legend');
	var ban = document.getElementById('banner');
	var filter = document.getElementById('type');
	var filter2 = document.getElementById('type2');
	var filterReq = document.getElementById('specificBox');
	if(mapFullScreen === false){
		
		var mapContainer = document.getElementById('map');
		table.style.zIndex = '0';
		tableTit.style.zIndex = '0';
		tableHed.style.zIndex = '0';
		leg.style.zIndex = '0';
		ban.style.zIndex='0';
		filter.style.zIndex= '0'; 
		if(filter2 && filterReq != null){
			filter2.style.zIndex= '0'; 
			filterReq.style.zIndex = '0'; 
		}
		mapContainer.style.width = '100%';
		mapFullScreen = true;
		textBox.style.top= "0px";
		textBox.style.marginTop = "0px";

	}
	else{
		
		var mapContainer = document.getElementById('map');
		filter.style.zIndex = '1000'; 
		if(filter2 && filterReq != null){
			filter2.style.zIndex= '1000'; 
			filterReq.style.zIndex = '1000'; 
		}
		table.style.zIndex= '1000';
		tableTit.style.zIndex= '1000';
		tableHed.style.zIndex= '1000';
		leg.style.zIndex= '1000';
		ban.style.zIndex= '1000';
		mapContainer.style.width = '75%';
		mapFullScreen = false;
		textBox.style.top = "24px";
		textBox.style.marginTop = "5vh";
	}

}
//End of full

//-------------//

//Infomation GET request function, obtains from nearest measurment taken
function requestUpdate() {
	var lat = myMap.getCenter().lat.toFixed(2);
	var lng = myMap.getCenter().lng.toFixed(2);

	//Several conditions are set to obtain the nearest AQ data for a location
	var req3 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=100");
	var req4 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=1000");
	var req5 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=10000");
	var req6 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=100000");
	var req7 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=1000000");
	var req8 = $.getJSON("https://api.openaq.org/v1/latest?coordinates=" + lat + "," + lng + "&radius=2000000"); //Could go larger but not sure if its necessary

	Promise.all([req3, req4, req5, req6, req7, req8])
		.then(data => {
			if (data[0].results.length > 0) {
				updateTable(data[0]);

			} else if (data[1].results.length > 0) {
				updateTable(data[1]);

			} else if (data[2].results.length > 0) {
				updateTable(data[2]);

			} else if (data[3].results.length > 0) {
				updateTable(data[3]);

			} else if (data[4].results.length > 0) {
				updateTable(data[4]);

			} else if (data[5].results.length > 0) {
				updateTable(data[5]);

			}
		});
}
// End of requestUpdates

//-----------------------//

function updateTable(data) {
	app2.display = false;
	//Returns banner to invisible each time moved/updated
	var bann = document.getElementById('banner');
	bann.style.backgroundColor = "white";

	if (data.results.length > 0) {
		app.searchResults.length = 0;
		app.nearestLocation = data.results[0].location;
		var i;
		var param;
		var un;
		var val;
		if(app.filter_type === 'all'){ //If 'all' dont need any more specifics
			for(i=0; i < data.results[0].measurements.length; i++){
				param = data.results[0].measurements[i].parameter;
				val = data.results[0].measurements[i].value;
				un = data.results[0].measurements[i].unit;
				if(app.searchResults.length < 10){
					app.searchResults.push( {parameter: param, value: val, unit: un});
				} //Some of the GET values from the latest request have many repeated measurements, dont post in table if more than 10
			
			}
		} 
		else{
			for(i=0; i < data.results[0].measurements.length; i++){
				param = data.results[0].measurements[i].parameter;
				val = data.results[0].measurements[i].value;
				un = data.results[0].measurements[i].unit;
				if(app.searchResults.length < 10){
					if(param === app.filter_type){ 
						if(app.filter_sign === '-'){ // if just filtering based on parameter type dont need more specifics 
							app.searchResults.push( {parameter: param, value: val, unit: un});
						}
						else{
							var isTrue;
							isTrue = specificValue(val);
							if(isTrue === true){
								app.searchResults.push( {parameter: param, value: val, unit: un});
							} //otherwise we need to test if the specific parameter has the correct value type
						}
					} 
				} //Some of the GET values from the latest request have many repeated measurements, dont post in table if more than 10
			
			} //for(i=0; i < data.results[0].measurements.length; i++)
		} //else
	}//if(data.results.length > 0)

} //updateTable(data)
// End of updateTable

//--------------------//

/* The following functions are used to style the background color of certain elements in the table*/
//For particle pm10
function pmTen(data){
	  if(data.value <= 54){
			return app.colors.green
	  }
	
	  else if(data.value > 54 && data.value <= 154){
			return app.colors.yellow
	  }
	  
	  else if(data.value > 154 && data.value <= 254){
			return app.colors.orange
	  }
	  else if(data.value > 254 && data.value <= 354){
			return app.colors.red
	  }
	  else if(data.value > 354 && data.value <= 424){
			return app.colors.purple
	  }
	   else if(data.value > 424){
			return app.colors.maroon
	  }

		
}

function noTwo(data){
	if(data.unit === "ppb"){
		if(data.value <= 53){
			return app.colors.green
		}
	
		else if(data.value > 53 && data.value <= 100){
			return app.colors.yellow
		}
	  
		else if(data.value > 100 && data.value <= 360){
			return app.colors.orange
		}
		else if(data.value > 360 && data.value <= 649){
			return app.colors.red
		}
		else if(data.value > 649 && data.value <= 1249){
			return app.colors.purple
		}
		else if(data.value > 1249){
			return app.colors.maroon
		}
	}
	else if(data.unit === "ppm"){
		var newVal = (data.value * 1000);
		if(newVal <= 53){
			return app.colors.green
		}
	
		else if(newVal > 53 && newVal <= 100){
			return app.colors.yellow
		}
	  
		else if(newVal > 100 && newVal <= 360){
			return app.colors.orange
		}
		else if(newVal > 360 && newVal <= 649){
			return app.colors.red
		}
		else if(newVal > 649 && newVal <= 1249){
			return app.colors.purple
		}
		else if(newVal > 1249){
			return app.colors.maroon
		}
		
	}
	else if(data.unit === "µg/m³"){
		var newVal = (data.value * 0.001);
		if(newVal <= 53){
			return app.colors.green
		}
	
		else if(newVal > 53 && newVal <= 100){
			return app.colors.yellow
		}
	  
		else if(newVal > 100 && newVal <= 360){
			return app.colors.orange
		}
		else if(newVal > 360 && newVal <= 649){
			return app.colors.red
		}
		else if(newVal > 649 && newVal <= 1249){
			return app.colors.purple
		}
		else if(newVal > 1249){
			return app.colors.maroon
		}
		
		
	}
	
}

function soTwo(data){
	if(data.unit === "ppb"){
		if(data.value <= 35){
			return app.colors.green
		}
	
		else if(data.value > 35 && data.value <= 75){
			return app.colors.yellow
		}
	  
		else if(data.value > 75 && data.value <= 185){
			return app.colors.orange
		}
		else if(data.value > 185 && data.value <= 304){
			return app.colors.red
		}
		else if(data.value > 304 && data.value <= 604){
			return app.colors.purple
		}
		else if(data.value > 604){
			return app.colors.maroon
		}
	}
	else if(data.unit === "ppm"){
		var newVal = (data.value * 1000);
		if(newVal <= 35){
			return app.colors.green
		}
	
		else if(newVal > 35 && newVal <= 75){
			return app.colors.yellow
		}
	  
		else if(newVal > 75 && newVal <= 185){
			return app.colors.orange
		}
		else if(newVal > 185 && newVal <= 304){
			return app.colors.red
		}
		else if(newVal > 304 && newVal <= 604){
			return app.colors.purple
		}
		else if(newVal > 604){
			return app.colors.maroon
		}
		
	}
	else if(data.unit === "µg/m³"){
		var newVal = (data.value * 0.001);
		if(newVal <= 35){
			return app.colors.green
		}
	
		else if(newVal > 35 && newVal <= 75){
			return app.colors.yellow
		}
	  
		else if(newVal > 75 && newVal <= 185){
			return app.colors.orange
		}
		else if(newVal > 185 && newVal <= 304){
			return app.colors.red
		}
		else if(newVal > 304 && newVal <= 604){
			return app.colors.purple
		}
		else if(newVal > 604){
			return app.colors.maroon
		}
		
		
	}
}

function carbonMono(data){
	if(data.unit === "ppm"){
		if(data.value <= 4.4){
				return app.colors.green
		}
	
		else if(data.value > 4.4 && data.value <= 9.4){
				return app.colors.yellow
		}
	  
		else if(data.value > 9.4 && data.value <= 12.4){
				return app.colors.orange
		}
		else if(data.value > 12.4 && data.value <= 15.4){
				return app.colors.red
		}
		else if(data.value > 15.4 && data.value <= 30.4){
				return app.colors.purple
		}
	   else if(data.value > 30.4){
				return app.colors.maroon
		}
	}
	
	else if(data.unit === "µg/m³"){
		var newVal = (data.value * 0.000001);
		if(newVal<= 4.4){
				return app.colors.green
		}
	
		else if(newVal > 4.4 && newVal <= 9.4){
				return app.colors.yellow
		}
	  
		else if(newVal > 9.4 && newVal <= 12.4){
				return app.colors.orange
		}
		else if(newVal > 12.4 && newVal <= 15.4){
				return app.colors.red
		}
		else if(newVal > 15.4 && newVal <= 30.4){
				return app.colors.purple
		}
	   else if(newVal > 30.4){
				return app.colors.maroon
		}
	}
}


function pmTwoFive(data){
	
	if(data.value <= 12.0){
			return app.colors.green
	  }
	
	  else if(data.value > 12.0 && data.value <= 35.4){
			return app.colors.yellow
	  }
	  
	  else if(data.value > 35.4 && data.value <= 55.4){
			return app.colors.orange
	  }
	  else if(data.value > 55.4 && data.value <= 150.4){
			return app.colors.red
	  }
	  else if(data.value > 150.4 && data.value <= 250.4){
			return app.colors.purple
	  }
	   else if(data.value > 250.4){
			return app.colors.maroon
	  }
	
}

function oThree(data){
	if(data.unit === "ppm"){
		if(data.value <= 0.054){
			return app.colors.green
		}
	
		else if(data.value > 0.054 && data.value <= 0.070){
			return app.colors.yellow
		}
	  
		else if(data.value > 0.070 && data.value <= 0.085){
			return app.colors.orange
		}
		else if(data.value > 0.085 && data.value <= 0.105){
			return app.colors.red
		}
		else if(data.value > 0.105 && data.value <= 0.200){
			return app.colors.purple
		}
		else if(data.value > 0.200){
			return app.colors.maroon
		}
	}
	else if(data.unit === "µg/m³"){
		var newVal = (data.value *0.000001)
		if(newVal <= 0.054){
			return app.colors.green
		}
	
		else if(newVal > 0.054 && newVal <= 0.070){
			return app.colors.yellow
		}
	  
		else if(newVal > 0.070 && newVal <= 0.085){
			return app.colors.orange
		}
		else if(newVal > 0.085 && newVal <= 0.105){
			return app.colors.red
		}
		else if(newVal > 0.105 && newVal <= 0.200){
			return app.colors.purple
		}
		else if(newVal > 0.200){
			return app.colors.maroon
		}
		
	}
}

/*The changeBanner function get a call when a table data row is either orange, red, purple or maroon. The table updates which banner to represent
on the screen based on the other particle levels. For example, if there is both a hazardous level particle and a unhealthy level particle in
a city, the function will return the hazardous banner since it is more dangerous.*/
function changeBanner(data) {
	var bann = document.getElementById('banner');

	if (data === "rgb(126,0,35)") {
		bann.style.backgroundColor = "rgb(126,0,35)";
		app2.discription = 'hazardous';
	} else if (data === "rgb(143,63,151)") {
		if (bann.style.backgroundColor !== "rgb(126, 0, 35)") {
			bann.style.backgroundColor = "rgb(143,63,151)";
			app2.discription = 'very unhealthy';
		}
	} else if (data === "rgb(255,0,0)") {
		if (bann.style.backgroundColor !== "rgb(126, 0, 35)") {
			if (bann.style.backgroundColor !== "rgb(143, 63, 151)") {
				bann.style.backgroundColor = "rgb(255,0,0)";
				app2.discription = 'unhealthy';
			}
		}
	} else {
		if (bann.style.backgroundColor !== "rgb(126, 0, 35)") {
			if (bann.style.backgroundColor !== "rgb(143, 63, 151)") {
				if (bann.style.backgroundColor !== "rgb(255, 0, 0)") {
					bann.style.backgroundColor = "rgb(255,126,0)";
					app2.discription = 'unhealthy for sensitive groups';
				}
			}
		}
	}
}

function specificValue(value){
	var sign = app.filter_sign;
	if(sign === '='){
		if(value === Number(app.filter_amount)){
			return true;
		}
		else{
			return false;
		}
	}
	else if(sign === '>'){
		
		if(value > Number(app.filter_amount)){
			
			return true;
		}
		else{
			return false;
		}
	}
	else if(sign === '<'){
		if(value < Number(app.filter_amount)){
			return true;
		}
		else{
			return false;
		}
	}
} /*Function used for calculating what the filter method is and if the current parameter is within the filter*/
