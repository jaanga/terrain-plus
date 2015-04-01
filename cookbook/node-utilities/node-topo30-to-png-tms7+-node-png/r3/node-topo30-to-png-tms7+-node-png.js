// https://github.com/leogiese/node-png

	var startTime = Date.now();
	var startTimeScript = Date.now();
	var count = 0;

	var fs = require('fs');
    var PNG = require( 'node-png' ).PNG;

	var fileName = 'c:/temp/topo30/topo1.gsd';
//	var fileName = '../../topo2.gsd';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120

	var latDefault = 39;
	var lonDefault = -123;

	var TMS7plusX = 0; // 20 sf
	var TMS7plusY = 0; // 49
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

		if ( !fs.existsSync( 'c:/temp/srtm-png-temp/' + TMS7plusX ) ) {

			 fs.mkdirSync( 'c:/temp/srtm-png-temp/' + TMS7plusX );   

		}

		processTiles()

console.log( 'script time', Date.now() - startTimeScript );

	}

	function processTiles() {

		if ( TMS7plusY < 64 && TMS7plusX < 128 ) {
//		if ( TMS7plusY < 128 && TMS7plusX < 128 ) { // southern hemisphere
//
			createPNGTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( TMS7plusX < 128 ) {

			TMS7plusX++;
			TMS7plusY = 0;
//			TMS7plusY = 64; // southern hemisphere

			if ( !fs.existsSync( 'c:/temp/srtm-png-temp/' + TMS7plusX ) ) {

				 fs.mkdirSync( 'c:/temp/srtm-png-temp/' + TMS7plusX );   

			}

			createPNGTile( TMS7plusX, TMS7plusY );

		} else {

console.log( '\n\nscript time', Date.now() - startTimeScript );

		}

	}

	function createPNGTile( tileX, tileY ) {
		count++;
//	var startTime = Date.now();

console.log( '\ntileX', tileX, tileY, count );

		lonStart = tile2long( tileX, zoom );

		latStart = tile2lat( tileY, zoom );
		latFinish = tile2lat( tileY + 1, zoom );

		rowsPerTMS = Math.round( Math.abs( latStart - latFinish ) * dataPointsPerDegree );

		var png = new PNG({
			width: colsPerTMS,
			height: rowsPerTMS
//			deflateLevel: 0,
//			deflateStrategy: 0,
//			filterType: 0
		});

		startColumn = Math.floor( 120 * lonStart );
		startRow = latStart > 0 ? 10800 - 120 * latStart : 120 * -latStart ;
		startRow = Math.floor( startRow );

		finishRow = startRow + rowsPerTMS - 1;

		var elevations = [];
		var elevation;

		var dataIndex;

		var pngIndex;
		var pngRow = 0;
		var pngCol = 0;

//console.log( 'startColumn', startColumn );
//console.log( 'startRow', startRow );

		for ( var row = startRow; row < finishRow; row++ ) {

			dataIndex = 2 * 43200 * row + 2 * startColumn;

			for ( var column = 0; column < colsPerTMS; column++ ) {

				elevation = byteArray[ dataIndex++ ] * 256 + byteArray[ dataIndex++ ];

				elevation = elevation < 32767 ? elevation : elevation - 65536;

				pngIndex = 4 * ( png.width * pngRow + pngCol++ );

//				png.data[ pngIndex ] = (( elevation & 0xff0000 )  >> 16 );
//				png.data[ pngIndex + 1 ] =  (( elevation & 0x00ff00 ) >> 8 );
//				png.data[ pngIndex + 2 ] = (( elevation & 0x0000ff ) );

// for pretty
				png.data[ pngIndex ] = elevation & 0x0000ff;
				png.data[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png.data[ pngIndex + 2 ] = ( elevation & 0xff0000) >> 16;

				png.data[ pngIndex + 3 ] = 255;

// for checking

				if ( row === startRow + 0 ) {

			// to identify current row visually
			//				png.data[ pngIndex ] = 0; //(( elevation & 0xffffff )  >> 16 );
			//				png.data[ pngIndex + 1 ] = 0; //(( elevation & 0xffffff )  >> 16 );

							elevation2 = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
			//console.log( elevation, png.data[ pngIndex ], png.data[ pngIndex + 1 ], png.data[ pngIndex + 2], ' ', elevation2 );

			//				elevations.push( elevation );

				}

			}

			pngRow++
			pngCol = 0;

		}

		wstream = fs.createWriteStream( 'c:/temp/srtm-png-temp/' + tileX + '/' + tileY + '.png' );
//		wstream = fs.createWriteStream( 'test.png' );
		wstream.on('finish', function() { 

console.log( 'tile ' + tileX + ' ' + tileY + ' count ' + count ); 

			processTiles();

		} );

		png.pack().pipe( wstream );

//console.log( elevations );
//console.log( 'time', Date.now() - startTime );

	}

	function tile2long( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );
	}
