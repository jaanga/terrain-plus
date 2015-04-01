
	var startTime = Date.now();

	var fs = require('fs');
    var PNG = require( '../node_modules/node-png' ).PNG;

	var cropRows = 240;
	var cropColumns = 240;

	var png = new PNG({
		width: cropColumns,
		height: cropRows,
		filterType: -1
	});

	var fileName = '../../topo1.gsd';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120

	var latStart = Math.atan( Math.sinh ( Math.PI )) * 180 / Math.PI; // 85.05112877980659

	var TMSStartLatDelta = 90 - latStart;
	var startRow = Math.floor( TMSStartLatDelta * dataPointsPerDegree ) - 1;  // makes the check come out right

	var degreesPerTMS = latStart / 64;
	var rowsPerTMS = Math.floor( degreesPerTMS * dataPointsPerDegree );

	var colsPerTMS = Math.floor( dataColumns / 128 );



	var latDefault = 39;
	var lonDefault = -123;

	var TMS7plusX = 7;
	var TMS7plusY = 49;

	var startRow;
	var startColumn;

	var finishRow; // = startRow + cropRows - 1;
	var finishColumn; // = startColumn + cropColumns;

	var byteArray;
	var elevations = [];
	var elevation;

	init();

	function init() {

console.log( 'TMSStartLatDelta', TMSStartLatDelta );
console.log( 'startRow', startRow );
console.log( 'degreesPerTMS', degreesPerTMS );
console.log( 'rowsPerTMS', rowsPerTMS );
console.log( 'row check', dataRows, ( 32 * rowsPerTMS ) + ( 32 * ( rowsPerTMS + 1 ) ) + startRow )
console.log( '\n' );
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

		lon = lonDefault;
		lat = latDefault;

		startColumn = lon < 0 ? 120 * lon : 120 * lon;
		startRow = lat < 0 ? 10800 - 120 * lat : 10800 - 120 * lat;


console.log( 'startColumn', startColumn );
console.log( 'startRow', startRow );

		finishRow = startRow + cropRows - 1;
		finishColumn = startColumn + cropColumns;

		elevations = [];

		var index;

		var pRow = 0;
		var pCol = 0;
		for ( var row = startRow; row < finishRow; row++ ) {

			index = 2 * 43200 * row + 2 * startColumn;

			for ( var column = startColumn; column < finishColumn; column++ ) {

				elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
				elevations.push( elevation );

				var idx = ( png.width * pRow + pCol++ ) * 4;

//				png.data[ idx ] = col;
//				png.data[ idx + 1 ] = col;
//				png.data[ idx + 2 ] = col;
//				png.data[ idx + 3 ] = 0xff;

				png.data[ idx ] = (( elevation & 0xff0000 ) >> 16 );
				png.data[ idx + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				png.data[ idx + 2 ] = elevation & 0x0000ff;

				png.data[ idx + 3 ] = 255;
			}
			pRow++
			pCol = 0;
		}

		png.pack().pipe( fs.createWriteStream( __dirname + '/srtm-to-png-r3.png' ) );

//console.log( elevations );
console.log( 'time', Date.now() - startTime );

	}


