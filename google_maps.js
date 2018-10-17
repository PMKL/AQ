var mapping;
var blank;

function initMap() {
	
  /*var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 44.977, lng: -93.265},
    zoom: 6
  });*/
  //do you have to call a new map every time?
  
   /*var input = document.getElementById('pac-input');
   var searchBox = new google.maps.places.SearchBox(input);
   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);*/
   
   var google_key = "AIzaSyDU2kgfrqoiWwX2WOWBE08KOGz-_nQ5aEY"
  
	/*var request =  {
		url: "https://api.openaq.org/v1/parameters",
		dataType: "json", 
        success: test
			
		
		};
		$.ajax(request); //Using the ajax method fr*/
	
	mapping = new Vue({
		el: "#map",
		data: {
			center: {lat: 44.977, lng: -93.265},
			zoom: 6
		},
		methods: {
			createMap: function(){ 
				new google.maps.Map(document.getElementById('map'), { 
					center: this.center,
					zoom: this.zoom
				})
			}
			
		}
	})
		
    blank = new Vue({
      el: "#search",
      data: {
			counter: 0,
			search_request: '',
			search_results: []
        }
	  /*methods: {
			cityRequest: function (event) {
				//console.log(event.target.innerHTML);
				console.log(this.search_request)
			}
			
	  },*/
		
        
    })
	
	
	mapping.createMap();
	
	

	//var removeItem = document.getElementById("search");
	
	//removeItem.addEventListener("click", clicked, false);
}

function google_Search(event){
	
	var request2 = {
		url:"https://maps.googleapis.com/maps/api/geocode/json?address=" + blank.search_request + "&key=AIzaSyCsz_H86EN2uQh7eB0aNUqP0WDf3lIU2ZA",
		//url:"https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCsz_H86EN2uQh7eB0aNUqP0WDf3lIU2ZA",
		dataType: "json",
		success: googleSuccess
	};
	
	$.ajax(request2);
}

function googleSuccess(data){
	console.log(data);
	console.log(blank.search_request);

	mapping.center.lat = parseFloat(data.results[0].geometry.location.lat)
	mapping.center.lng = parseFloat(data.results[0].geometry.location.lng)
	
	mapping.createMap();
	//map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 100.977, lng: -93.265}, //{lat: parseFloat(data.results[0].geometry.location[0]), lng: parseFloat(data.results[0].geometry.location[1])},
    //zoom: 6
  //});
}
	
function test(data){
	console.log(data);
}


