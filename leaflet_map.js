var app;
var myMap;


function initMap() {
	myMap = L.map('map').setView([51.505, -0.09], 8);
	
   
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGluaDAwMDYiLCJhIjoiY2pubDNiOHhuMDJ0bzN2b3pvYjFwa2UxaSJ9.BVc1SC-6giTzsse9L1Xaxw'
}).addTo(myMap);




var searchBox = L.Control.extend({
	 onAdd: function(){
		var input = document.getElementById("textBox");
		/*input.placeholder = "Search";
		input.addEventListener('keypress', function(pressed){
			if(pressed.keyCode == 13){
				changeCenter(input.value);
		}});*/
		return input;
	}
});

(new searchBox).addTo(myMap);

		
app = new Vue({
      el: "#textBox",
      data: {
			map_search: '',
			input_placeholder: 'Search'
        }
        
  })



myMap.on('dragend', function(){ 
var lat = myMap.getCenter().lat.toFixed(2);
var lng = myMap.getCenter().lng.toFixed(2);

app.input_placeholder = lat + "," + lng;

});

	/*var request =  { //Use this for requesting air quality info
		url: "https://api.openaq.org/v1/parameters",
		dataType: "json", 
        success: test
			
		
		};
		$.ajax(request); //Using the ajax method fr*/
	

	
}

function changeCenter(){
	console.log(app.map_search);
	var latlng = app.map_search.split(",");
	console.log(latlng);
	
	myMap.setView([latlng[0], latlng[1]], 8);

}



