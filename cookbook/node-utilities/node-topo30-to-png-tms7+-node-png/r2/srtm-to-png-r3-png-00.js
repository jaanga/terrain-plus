
	var startTime = Date.now();

	var fs = require('fs');
    var PNG = require( '../node_modules/node-png' ).PNG;


	var fileName = '../../topo1.gsd';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120

/*
	var latStart = Math.atan( Math.sinh ( Math.PI )) * 180 / Math.PI; // 85.05112877980659

	var TMSStartLatDelta = 90 - latStart;
	var startRow = Math.floor( TMSStartLatDelta * dataPointsPerDegree ) - 1;  // makes the check come out right

	var degreesPerTMS = latStart / 64;

	var rowsPerTMS = Math.floor( degreesPerTMS * dataPointsPerDegree );
*/

	var latDefault = 39;
	var lonDefault = -123;

	var TMS7plusX = 20;
	var TMS7plusY = 49;
	var zoom = 7;

	lonStart = tile2long( TMS7plusX, zoom );
//	finishLon = tile2long( TMS7plusX + 1, zoom ); 

	latStart = tile2lat( TMS7plusY, zoom );
	latFinish = tile2lat( TMS7plusY + 1, zoom );

	var rowsPerTMS = Math.round( Math.abs( latStart - latFinish ) * 120 );
	var colsPerTMS = Math.floor( dataColumns / 128 );

	var cropRows = 256;
	var cropColumns = 256;

	var png = new PNG({
		width: colsPerTMS,
		height: rowsPerTMS,
		filterType: -1
	});

	var startRow;
	var startColumn;

	var finishRow; // = startRow + cropRows - 1;
	var finishColumn; // = startColumn + cropColumns;

	var byteArray;
	var elevations = [];
	var elevation;

	init();

	function tile2long( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );
	}

	function init() {

console.log( 'TMS7plusY', TMS7plusY );
console.log( 'latStart', latStart );
console.log( 'latFinish', latFinish );
console.log( 'rowsPerTMS', rowsPerTMS );

//console.log( 'row check', dataRows, ( 32 * rowsPerTMS ) + ( 32 * ( rowsPerTMS + 1 ) ) + startRow )
console.log( '\n' );
console.log( 'TMS7plusX', TMS7plusX );
console.log( 'lonStart', lonStart );
console.log( 'colsPerTMS', colsPerTMS );
console.log( 'column check', ( 32 * colsPerTMS ) + ( 32 * ( colsPerTMS + 1 ) ) );

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {
		if ( error ) { 
			throw error;
console.log( error, byteArray );
		}
		byteArray = buffer;

console.log( byteArray.length );
console.log( byteArray );

		lon = lonStart;
		lat = latStart;

		startColumn = lon < 0 ? 120 * lon : 120 * lon;
		startRow = lat < 0 ? 10800 - 120 * lat : 10800 - 120 * lat;
		startRow = Math.floor( startRow );

		finishRow = startRow + rowsPerTMS - 1;
		finishColumn = startColumn + colsPerTMS;

		elevations = [];

		var index;

		var pngRow = 0;
		var pngCol = 0;

console.log( 'startColumn', startColumn );
console.log( 'startRow', startRow );

		for ( var row = startRow; row < finishRow; row++ ) {

			index = 2 * 43200 * row + 2 * startColumn;

			for ( var column = startColumn; column < finishColumn; column++ ) {

				elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
				elevations.push( elevation );
console.log( elevation );
				var pngIndex = ( png.width * pngRow + pngCol++ ) * 4;

//				png.data[ pngIndex ] = col;
//				png.data[ pngIndex + 1 ] = col;
//				png.data[ pngIndex + 2 ] = col;
//				png.data[ pngIndex + 3 ] = 0xff;

				png.data[ pngIndex ] = (( elevation & 0xff0000 ) >> 16 );
				png.data[ pngIndex + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				png.data[ pngIndex + 2 ] = elevation & 0x0000ff;

				png.data[ pngIndex + 3 ] = 255;
			}
			pngRow++
			pngCol = 0;
		}

		png.pack().pipe( fs.createWriteStream( __dirname + '/srtm-to-png-r3.png' ) );

//console.log( elevations );
console.log( 'time', Date.now() - startTime );

	}


