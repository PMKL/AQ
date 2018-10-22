var mapping;
var blank;

function initMap() {
	
   
   var google_key = "AIzaSyDU2kgfrqoiWwX2WOWBE08KOGz-_nQ5aEY"
  
	/*var request =  { //Use this for requesting air quality info
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
			//search_results: []
        }
		
        
    })
	
	
	mapping.createMap();
	
}

function google_Search(event){
	
	var request2 = {
		url:"https://maps.googleapis.com/maps/api/geocode/json?address=" + blank.search_request + "&key=AIzaSyCsz_H86EN2uQh7eB0aNUqP0WDf3lIU2ZA",
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
	
}