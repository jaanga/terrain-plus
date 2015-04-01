	var info;
	var title = document.title;

	// var fileName = 'w180n90.Bathymetry.png';
	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e020n40.Bathymetry.png';
	var fileName = 'e020n40.Bathymetry.png';

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians;

	var latDelta = 50;
	var lonDelta = 40;

	var signLon = ( fileName.substr( 0, 1 ) === 'w' ) ? -1 : 01;
	var signLat = ( fileName.substr( 4, 1 ) === 's' ) ? -1 : 1;

	var lonStart = signLon * parseInt( fileName.substr( 1, 3 ), 10 );
	var latStart = signLat * parseInt( fileName.substr( 5, 2 ), 10 );


	var lonFinish = lonStart + lonDelta;
	var latFinish = latStart - latDelta;

	var zoomLevel = 7;
	var tileStartX = lon2tile( lonStart, zoomLevel )
	var tileStartY = lat2tile( latStart, zoomLevel );


	var tileStartLon = tile2lon(  tileStartX, zoomLevel );
	var tileStartLat = tile2lat(  tileStartY, zoomLevel );

	var tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;
	var tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;

	var tileDeltaLon = - tileStartLon + tile2lon(  tileStartX + 1, zoomLevel );
	var tileDeltaLat = tileStartLat - tile2lat(  tileStartY + 1, zoomLevel );



	var anchorageLat = +61.2167
	var anchorageLon = -149.9000;

	var anchorageTileX = lon2tile( anchorageLon, 7 );
	var anchorageTileY = lat2tile( anchorageLat, 7 );


	var latDeltaLevel7 = 180 / 128;
	var lonDeltaLevel7 = 360 / 128;



	var pixelsX = Math.floor( lonDeltaLevel7 * 120);
	var pixelsY = Math.floor(latDeltaLevel7 * 120);

	var tileXCount = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;
	var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;

	var currentTileX;
	var currentTileY;

	var b = '<br>';

	init();

	function init() {

		addCSS();

		var mapTextLat = document.body.appendChild( document.createElement( 'div' ) );
		mapTextLat.style.cssText = 'border: 0px solid black; position: absolute; ';
		mapTextLat.style.cssText += 'left: ' + ( ( 1 + tileXCount ) * 23 ) + 'px; line-height: 23px; top: 0;';
		mapTextLat.innerHTML = '';

		var mapTextLon = document.body.appendChild( document.createElement( 'div' ) );
		mapTextLon.style.cssText = 'border: 0px solid black; position: absolute; ';
		mapTextLon.style.cssText += 'left: 10px; line-height: 23px; top: 1200px;';
		mapTextLon.innerHTML = '';

		var i = 0, currentLon = lonStart;
		var j, currentLat;
		while ( currentLon < lonFinish ) {
			j = 0;
			currentLat = latStart;
			while ( currentLat > latFinish ) {
				var map = document.body.appendChild( document.createElement( 'img' ) );
				map.width = 20;
				map.height = 20;
				map.style.cssText = 'border: 1px solid black; position: absolute; ';
				map.style.cssText += 'left: ' + ( i * 23 ) + 'px; top: ' + (j * 23 ) + 'px;';
				if ( currentLat < 73 && currentLat > 53 )
					map.src = 'http://mt.google.com/vt/hl=en&src=app&x=' + i + '&y=' + j + '&z=' + 7;
				currentLat = tile2lat( j, 7 );

				if ( i === 0 ) {
					mapTextLat.innerHTML += j + ' lat:' + tile2lat( j , 7).toFixed(3) + b;
				}

				j++;
			}
			mapTextLon.innerHTML += i + ' lon: ' + currentLon + b;
			i++;
			currentLon = tile2lon( i, 7 );

		} 





		var tileTextLat = document.body.appendChild( document.createElement( 'div' ) );
		tileTextLat.style.cssText = 'border: 0px solid black; position: absolute; ';
		tileTextLat.style.cssText += 'left: ' + (600 + ( 1 + tileXCount ) * 23 ) + 'px; line-height: 23px; top: 0;';
		tileTextLat.innerHTML = '';

		var tileTextLon = document.body.appendChild( document.createElement( 'div' ) );
		tileTextLon.style.cssText = 'position: absolute; left: 600px; top: 1200px; ';
		tileTextLon.innerHTML = '';


		var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = 480;
		canvas.height = 600;
		canvas.style.cssText = 'border: 1px solid black; position: absolute; right: 0; ';
		var context = canvas.getContext( '2d' );

		var image = document.createElement( 'img' );
//		image.src = '../../../../terrain-srtm30-plus/png/' + fileName;
		image.src = fileLink;
		image.onload = function(){

// console.log( image.width, image.height, canvas.width, canvas.height );
			context.scale( 0.1, 0.1 );
			context.drawImage( image, 0, 0 );

			var offset = (90 - tileStartLat ) * 4800 / 40; 
			var currentTileX = tileStartX;

			var currentLatTop, deltaLat, currentPixelY;
			while ( currentTileX < tileFinishX ) {
				//for (var j = 0; j < tileYCount; j++) {
				currentTileY = tileStartY;
				currentPixelY = offset;
				while ( currentTileY <= tileFinishY ) {

					var tile = document.body.appendChild( document.createElement( 'canvas' ) );
					tile.width = 20;
					tile.height = 20;
					tile.style.cssText = 'outline: 1px solid black; position: absolute; ' +
						'left: ' + ( 600 + currentTileX * 23) + 'px; top: ' + ( currentTileY * 23 ) + 'px;';
					var contextTile = tile.getContext( '2d' );

					currentLatTop = tile2lat( currentTileY, zoomLevel );
					currentLatBottom = tile2lat( currentTileY + 1, zoomLevel );
					deltaLat = currentLatTop - currentLatBottom;
					deltaPixel = 120 * deltaLat;

					contextTile.drawImage( image, currentTileX * ( pixelsX - 1 ), currentPixelY, pixelsX, deltaPixel, 0, 0, 20, 20 );
					currentPixelY += deltaPixel;

					if ( currentTileX === 0 ) {
						tileTextLat.innerHTML += currentTileY + ' Y:' + currentPixelY + ' dY:' + deltaPixel + b;
					}
					currentTileY++;
				}
				tileTextLon.innerHTML += currentTileX + ' lon px:' + ( currentTileX * ( pixelsX - 1 ) ) + b;
				currentTileX++;
			} 
		};

		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.style.cssText = 'background-color: #ccc; padding: 10px; opacity: 0.85; position: absolute; right: 20px; top: 50px; ';
		info.innerHTML = '<h1>' + title + '</h1>' +
			'<div id=msg ></div>';

		msg.innerHTML = 
			'tileStartX:' +tileStartX + b +
			'tileStartY:' + tileStartY + b +

			'tileStartLon:' + tileStartLon + b +
			'tileStartLat:' + tileStartLat + b +
			'tileDeltaLon:' + tileDeltaLon + b +
			'tileDeltaLat:' + tileDeltaLat + b +

			'tileFinishX:' + tileFinishX + b +
			'tileFinishY:' + tileFinishY + b +

			b +
			'anchorageTileX:' + anchorageTileX + b +
			'anchorageTileY:' + anchorageTileY + b +

			b +
			'lonDeltaLevel7: ' + lonDeltaLevel7 + ' latDeltaLevel7: ' + latDeltaLevel7 + b +
			'pixelsX: ' + pixelsX + ' pixelsY: ' + pixelsY + b +
			'tileXCount: ' + tileXCount + ' tileYCount: ' + tileYCount + b;
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

