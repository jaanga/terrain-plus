
	var startTime = Date.now();
	var startTimeScript = Date.now();
	var count = 0;

	var fs = require('fs');
 //   var PNG = require( '../node_modules/node-png' ).PNG;

	var fileName = '../../topo1.gsd';
//	var fileName = '../../topo2.gsd';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120

	var latDefault = 39;
	var lonDefault = -123;

	var TMS7plusX = 20; // 20 sf
	var TMS7plusY = 49; // 49
//	var TMS7plusY = 64; // southern hemisphere
	var zoom = 7;

	lonStart = tile2long( TMS7plusX, zoom );

	latStart = tile2lat( TMS7plusY, zoom );
	latFinish = tile2lat( TMS7plusY + 1, zoom );

	var rowsPerTMS = Math.round( Math.abs( latStart - latFinish ) * dataPointsPerDegree );
	var colsPerTMS = Math.floor( dataColumns / 128 );

	var byteArray;

	init();

	function init() {

console.log( 'TMS7plusY', TMS7plusY );
console.log( 'latStart', latStart );
console.log( 'latFinish', latFinish );

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

console.log( 'byteArray.length', byteArray.length );
//console.log( byteArray );

		var dir = '../../../srtm-hgt-temp/' + TMS7plusX;

		if ( !fs.existsSync( dir ) ) {

			 fs.mkdirSync( dir );   

		} else {

//				var stats = fs.lstatSync( dir );
//				console.log( 'isDir:',stats.isDirectory() );

		}

		processTiles()


console.log( 'script time', Date.now() - startTimeScript );

	}

	function processTiles() {

		if ( TMS7plusY < 50 && TMS7plusX < 21 ) {
//		if ( TMS7plusY < 128 && TMS7plusX < 128 ) { // southern hemisphere
//
			createHGTTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( TMS7plusX < 20 ) {

			TMS7plusX++;
			TMS7plusY = 0;
//			TMS7plusY = 64; // southern hemisphere

			var dir = '../../../srtm-hgt-temp/' + TMS7plusX;

			if ( !fs.existsSync( dir ) ) {

				 fs.mkdirSync( dir );   

			}

			createHGTTile( TMS7plusX, TMS7plusY );

		} else {

console.log( '\n\nscript time', Date.now() - startTimeScript );

		}

	}

	function createHGTTile( tileX, tileY ) {
		count++;
//	var startTime = Date.now();

console.log( '\ntileX', tileX, tileY, count );

		lonStart = tile2long( tileX, zoom );

		latStart = tile2lat( tileY, zoom );
		latFinish = tile2lat( tileY + 1, zoom );

		rowsPerTMS = Math.round( Math.abs( latStart - latFinish ) * dataPointsPerDegree );

		startColumn = Math.floor( 120 * lonStart );
		startRow = latStart > 0 ? 10800 - 120 * latStart : 120 * -latStart ;
		startRow = Math.floor( startRow );

		finishRow = startRow + rowsPerTMS - 1;

		var elevations = [];
		var elevation;

		var dataIndex;

console.log( 'startColumn', startColumn );
console.log( 'startRow', startRow );

		for ( var row = startRow; row < finishRow; row++ ) {

			dataIndex = 2 * 43200 * row + 2 * startColumn;

//			for ( var column = 0; column < colsPerTMS; column++ ) {

//				elevation = byteArray[ dataIndex++ ] + byteArray[ dataIndex++ ];
				elevation = byteArray.slice( dataIndex, 2 * colsPerTMS );

// for checking

	if ( row === startRow + 0 ) {
//				elevation2 = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
// console.log( elevation );

	}

				elevations += elevation;

//			}

		}
console.log( 'elevs', elevations[0] );


//		wstream = fs.createWriteStream( '../../../srtm-temp/' + tileX + '/' + tileY + '.png' );
		wstream = fs.createWriteStream( 'test.hgt' );
		wstream.on('finish', function() { 
console.log( 'tile ' + tileX + ' ' + tileY + ' count ' + count ); 
			processTiles();
		} );
		wstream.write( elevations ) ;
		wstream.end();


//console.log( 'time', Date.now() - startTime );

	}

	function tile2long( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );
	}
