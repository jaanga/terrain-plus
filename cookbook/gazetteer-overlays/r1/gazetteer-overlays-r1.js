

	var overlays = {
		apple: { 
			title: 'Apple iPhoto', 
			attribution: '&copy; Apple', 
			src: function( zoom, x, y ) { 
				return 'http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=de_DE&z=' + zoom + '&x=' + x + '&y=' + y + '&v=9';
				}
			},
		bbike: {
			title: 'BBBike Mapnik',
			attribution: '&copy; BBBike.org & Geofabrik GmbH',
			src: function ( zoom, x, y ) {
				var letters = ['a','b','c'];
				return 'http://' + letters[ Math.floor( Math.random() * 3) ] + '.tile.bbbike.org/osm/mapnik/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		bbikeGerman: {
			title: 'BBBike Mapnik (de)',
			attribution: '&copy; BBBike.org & Geofabrik GmbH',
			src: function ( zoom, x, y ) {
				var letters = ['a','b','c'];
				return 'http://' + letters[ Math.floor( Math.random() * 3) ] + '.tile.bbbike.org/osm/mapnik-german/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		bbbikeSmoothness: {
			title: 'BBBike Smoothness',
			attribution: '&copy; BBBike.org & Geofabrik GmbH',
			src: function ( zoom, x, y ) {
				var letters = ['a','b','c','d'];
				return 'http://' + letters[ Math.floor( Math.random() * 4) ] + '.tile.bbbike.org/osm/bbbike-smoothness/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		esri: {
			title: 'ESRI',
			attribution: '&copy; ESRI',
			src: function( zoom, x, y ) { 
				return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/" + zoom + "/" + y + "/" + x + ".png";
			}
		},
		google: {
			title: 'Google Maps',
			attribution: '&copy; Google',
			src: function( zoom, x, y ) { 
				return 'http://mt.google.com/vt/hl=en&src=app&x=' + x + '&y=' + y + '&z=' + zoom;
			}
		},
		google2: {
			title: 'Google Maps2',
			attribution: '&copy; Google',
			src: function( zoom, x, y ) { 
				return 'http://mt1.google.com/vt/x=' + x + "&y=" + y + "&z=" + zoom;
			}
		},
		googleTerrain: {
			title: 'Google Maps Terrain',
			attribution: '&copy; Google',
			src: function( zoom, x, y ) { 
				return 'http://mt1.google.com/vt/lyrs=t&x=' + x + "&y=" + y + "&z=" + zoom;
			}
		},
		googleSatellite: {
			title: 'Google Maps Satellite',
			attribution: '&copy; Google',
			src: function( zoom, x, y ) { 
				return 'http://mt1.google.com/vt/lyrs=s&x=' + x + "&y=" + y + "&z=" + zoom;
			}
		},
		googleHybrid: {
			title: 'Google Maps Hybrid',
			attribution: '&copy; Google',
			src: function( zoom, x, y ) { 
				return 'http://mt1.google.com/vt/lyrs=y&x=' + x + "&y=" + y + "&z=" + zoom;
			}
		},
		mapbox: {
			title: 'Mapbox',
			attribution: '&copy; Openstreetmap Contributors',
			src: function( zoom, x, y ) { 
				return 'http://b.tiles.mapbox.com/v3/landplanner.map-qd1qeap9/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		mapQuestOsm: {
			title: 'MapQuest OSM',
			attribution: '&copy; MapQuest OSM Contributors',
			src: function( zoom, x, y ) { 
				return 'http://otile3.mqcdn.com/tiles/1.0.0/osm/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		mapQuestSatellite: {
			title: 'MapQuest Satellite',
			attribution: '&copy; MapQuest',
			src: function( zoom, x, y ) { 
				return 'http://otile3.mqcdn.com/tiles/1.0.0/sat/'+ zoom + '/' + x + '/' + y + '.png';
			}
		},
		natgeo: {
			title: 'National Geographic',
			attribution: '&copy; National Geographic',
			src: function( zoom, x, y ) { 
				return "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/" + zoom + "/" + y + "/" + x + ".png";
			}
		},
		osm: {
			title: 'OSM-Mapnik',
			attribution: '&copy; Openstreetmap Contributors',
			src: function( zoom, x, y ) {
 				var letters = ['a','b','c','d'];
				return 'http://' + letters[ Math.floor( Math.random() * 3) ] + '.tile.openstreetmap.org/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		openCycle: {
			title: 'Open Cycle Map',
			attribution: '&copy; Open Cycle Map Contributors',
			src: function( zoom, x, y ) {
 				var letters = ['a','b','c'];
				return 'http://' + letters[ Math.floor( Math.random() * 3) ] + '.tile.opencyclemap.org/cycle/' + zoom + '/' + x + '/' + y + '.png';
			}
		},
		stamenterrain: {
			title: 'Stamen Terrain Background',
			attribution: '&copy; Stamen Design',
			src: function( zoom, x, y ) { 
				var letters = ['a','b','c'];
				return 'http://' + letters[ Math.floor( Math.random() * 3) ] + '.tile.stamen.com/terrain-background/' + zoom + '/' + x + '/' + y + '.jpg';
			}
		},
		stamentoner: {
			title: 'Stamen Toner',
			attribution: '&copy; Stamen Design',
			src: function( zoom, x, y ) { 
				return "http://tile.stamen.com/toner/" + zoom + "/" + x + "/" + y + ".jpg";
			}
		},
		stamenwatercolor: {
			title: 'Stamen Watercolor',
			attribution: '&copy; Stamen Design',
			src: function( zoom, x, y ) { 
				return "http://tile.stamen.com/watercolor/" + zoom + "/" + x + "/" + y + ".jpg";
			}
		}

/*

		xxx: {
			title: 'xxx',
			src: function( zoom, x, y ) { 
				return '' + zoom + '/' + x + '/' + y + '.png';
			},
		}

		xxx: {
			title: '',
			attribution: '',
			src: function ( zoom, x, y ) {
					var letters = ['a','b','c','d'];
					return 'http://' + letters[ Math.floor( Math.random() * 4) ] + '.xxx/' + zoom + '/' + x + '/' + y + '.png';
				}
		},

*/
	}



/*
		container.innerHTML += '<br>And many more still to be added. Including:<br>'
+'nokia-map '+' nokia-satellite '+' nokia-hybrid '+' nokia-terrain '+' nokia-public_transit '+' nokia-traffic'
+ 'google-map '+' google-map-mapmaker '+' google-physical '+' google-satellite '+' google-hybrid '+' google-hybrid-mapmaker '+' google-bicycle-map '+' google-traffic-map '+' google-transit-map '+' google-layers-physical '+' google-panoramio-physical '+' google-weather-sat'
+'google-satellite '+' bing-satellite '+' yahoo-satellite '+' mapquest-satellite '+' nokia-satellite '+' yandex-satellite'
+'mapnik '+' mapnik-german '+' osm-no-labels '+' mapnik-bw'
+'transport '+' nokia-public_transit '+' public_transport '+' public_transport_lines '+' google-transit-map'
+'bing-map '+' bing-satellite '+' bing-hybrid'
+'yahoo-map '+' yahoo-satellite '+' yahoo-hybrid'
+'mapnik '+' mapnik-german '+' mapnik-bw '+' toner '+' watercolor '+' cyclemap '+' osm-no-labels '+' transport '+' public_transport '+' hike_bike '+' wanderreitkarte '+' mapbox '+' mapquest-eu '+' mapquest-us '+' skobbler'
+'bbbike-german '+' bbbike-smoothness '+' cyclemap '+' bicycle_network '+' adfc-radwege '+' hike_bike'
+'bbbike '+' bbbike-german '+' google-map '+' bbbike-smoothness '+' hike_bike '+' mapnik-german'
+'google-physical '+' google-layers-physical '+' esri-topo '+' esri '+' nokia-terrain '+' cyclemap '+' yahoo-map '+' landscape '+' wanderreitkarte '+' soviet-military '+' maptoolkit-topo '+' opentopomap '+' landshaded '+' hillshading'
+'cloudmade-map '+' cloudmade-fineline '+' cloudmade-midnight '+' cloudmade-paledawn '+' cloudmade-tourist '+' cloudmade-blackout '+' cloudmade-thin '+' cloudmade-cyclewalk'
+'bbbike-german '+' bbbike-smoothness '+' google-map '+' bvg '+' transport '+' nokia-public_transit'
+'osm-roads '+' osm-roads-greyscale '+' osm-semitransparent '+' aster-gdem-srtm-hillshade '+' aster-gdem-contour-lines '+' osm-administrative-boundaries'
+'esri '+' esri-topo '+' esri-gray '+' esri-satellite '+' esri-physical '+' esri-shaded-relief '+' esri-terrain-base '+' esri-boundaries-places '+' esri-reference-overlay '+' esri-transportation'
+'osm-administrative-boundaries '+' esri-boundaries-places'
+'falk-osm '+' falk-base'
+'mapbox '+' comic-sans'
+'mapnik '+' mapnik-retina'
+'waymarkedtrails-hiking '+' waymarkedtrails-cycling '+' waymarkedtrails-mtb '+' waymarkedtrails-skating'
+'google-map '+' bing-map '+' nokia-map '+' yahoo-map '+' skobbler '+' mapbox '+' esri '+' mapquest-eu';
*/