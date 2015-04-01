	var info;
	var title = 'PNG to Tiles Viewer R1';

	var fileName = 'w180n90.Bathymetry.png';

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians

	var latDelta = 50;
	var lonDelta = 40;

	var latStart = 90;
	var lonStart = -180;

	var latFinish = latStart - latDelta;
	var lonFinish = lonStart + lonDelta;

	var latDeltaLevel7 = 180 / 128;
	var lonDeltaLevel7 = 360 / 128;

	var pixelsX = (lonDeltaLevel7 * 120).toFixed(3);
	var pixelsY = (latDeltaLevel7 * 120).toFixed(3);

	var tileXCount = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;
	var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;

	var b = '<br>';

	init();

	function init() {

		updateTitle( title );
		addCSS();

		var i = 0, currentLon = -180;
		var j, currentLat;
		while ( currentLon < lonFinish ) {
			j = 0;
			currentLat = 90;
			while ( currentLat > latFinish ) {
				var map = document.body.appendChild( document.createElement( 'img' ) );
				map.width = 20;
				map.height = 20;
				map.style.cssText = 'border: 1px solid black; position: absolute; ';
				map.style.cssText += 'left: ' + ( i * 23 ) + 'px; top: ' + (j * 23 ) + 'px;';
				map.src = 'http://mt.google.com/vt/hl=en&src=app&x=' + i + '&y=' + j + '&z=' + 7;
				currentLat = tile2lat( j, 7 );

				if ( currentLat > latFinish ) {
					var txt = document.body.appendChild( document.createElement( 'div' ) );
					txt.style.cssText = 'border: 1px solid black; position: absolute; ';
					txt.style.cssText += 'left: ' + ( 20 + ( 1 + tileXCount ) * 23 ) + 'px; top: ' + ( j * 23 ) + 'px;';
					txt.innerHTML = 'lat:' + tile2lat( j , 7).toFixed(3);
				}
				j++;
			}
			currentLon = tile2lon( i++, 7 );
		} 

		var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = 480;
		canvas.height = 600;
		canvas.style.cssText = 'border: 1px solid black; position: absolute; right: 0; ';
		var context = canvas.getContext( '2d' );

		var image = document.createElement( 'img' );
		image.src = '../../../../terrain-srtm30-plus/png/' + fileName;
		image.onload = function(){

//			canvas.width = 0.1 * image.width;
//			canvas.height = 0.1 * image.height;

console.log( image.width, image.height, canvas.width, canvas.height );
			context.scale( 0.1, 0.1 );
			context.drawImage( image, 0, 0 );
			
			for (var i = 0; i < tileXCount; i++) {
				for (var j = 0; j < tileYCount; j++) {
					var tile = document.body.appendChild( document.createElement( 'canvas' ) );
					tile.width = 20;
					tile.height = 20;
					tile.style.cssText = 'outline: 1px solid black; position: absolute; ';
					tile.style.cssText += 'left: ' + ( 600 + i * 23) + 'px; top: ' + ( j * 23 ) + 'px;';
					var contextTile = tile.getContext( '2d' );
					//contextTile.scale( 0.1, 0.1 );
					contextTile.drawImage( image, i * 338, j * 169, 338, 169, 0, 0, 20, 20 );
				}
				p = document.body.appendChild( document.createElement( 'p' ) );
			} 
		};

		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.style.cssText = 'position: absolute; right: 0; top: 700px; ';
		info.innerHTML = '<div id=msg ></div>';

		msg.innerHTML = 
			'lonDeltaLevel7: ' + lonDeltaLevel7 + ' latDeltaLevel7: ' + latDeltaLevel7 + b +
			'pixelsX: ' + pixelsX + ' pixelsY: ' + pixelsY + b +
			'tileXCount: ' + tileXCount + ' tileYCount: ' + tileYCount + b;

	}

	function updateTitle( titl ) {
		title = titl;
		document.title = title;
	}

	function addCSS() {
		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; )' + // margin: 0; overflow: hidden; }' +
//			'h1 { margin: 0; }' +
//			'h1 a {text-decoration: none; }' +
//			'#closer { position: absolute; right: 5px; top: 5px; }' +
//			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
	}

// The math
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
	function lon2tile( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * pow( 2, zoom ) );
	}

	function lat2tile( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / cos( lat * pi / 180)) / pi )/2 * pow(2, zoom) );
	}

	function tile2lon( x, zoom ) {
		return ( x / pow( 2, zoom ) * 360 - 180 );
	}

	function tile2lat( y, zoom ) {
		var n = pi - 2 * pi * y / pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	}

	function cos( a ){ return Math.cos( a ); }
	function sin( a ){ return Math.sin( a ); }
	function pow( a, b ){ return Math.pow( a, b ); }
	function ran(){ return Math.random(); }