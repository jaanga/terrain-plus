
	var startTime = Date.now();
	var startTimeScript = Date.now();
	var count = 0;

	var fs = require('fs');
    var PNG = require( '../node_modules/node-png' ).PNG;

	var fileName = '../../topo1.gsd';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120

	var latDefault = 39;
	var lonDefault = -123;

	var TMS7plusX = 20; // 20 sf
	var TMS7plusY = 0; // 49
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
console.log( 'rowsPerTMS', rowsPerTMS );

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
//console.log( byteArray );


		for ( var i = 0; i < 10; i++ ) {

			var dir = '../../../srtm-temp/' + TMS7plusX;

			if ( !fs.existsSync( dir ) ) {

				 fs.mkdirSync( dir );   

			} else {

				var stats = fs.lstatSync( dir );
				console.log( 'isDir:',stats.isDirectory() );

			}

			for ( var j = 0; j < 64; j++ ) {

				createPNGTile( TMS7plusX, TMS7plusY );

				TMS7plusY++;

			}

			TMS7plusX++;
			TMS7plusY = 0;

		}

console.log( 'script time', Date.now() - startTimeScript );

	}

	function createPNGTile( tileX, tileY ) {

	var startTime = Date.now();

console.log( '\ntileX', tileX, tileY, count++ );

		lonStart = tile2long( tileX, zoom );

		latStart = tile2lat( tileY, zoom );
		latFinish = tile2lat( tileY + 1, zoom );

		rowsPerTMS = Math.round( Math.abs( latStart - latFinish ) * dataPointsPerDegree );

		var png = new PNG({
			width: colsPerTMS,
			height: rowsPerTMS,
			filterType: -1
		});

		startColumn = Math.floor( 120 * lonStart );
		startRow = latStart < 0 ? 10800 - 120 * latStart : 10800 - 120 * latStart;
		startRow = Math.floor( startRow );

		finishRow = startRow + rowsPerTMS - 1;

		var elevations = [];
		var elevation;

		var dataIndex;

		var pngIndex;
		var pngRow = 0;
		var pngCol = 0;

console.log( 'startColumn', startColumn );
//console.log( 'startRow', startRow );

		for ( var row = startRow; row < finishRow; row++ ) {

			dataIndex = 2 * 43200 * row + 2 * startColumn;

			for ( var column = 0; column < colsPerTMS; column++ ) {

				elevation = byteArray[ dataIndex++ ] * 256 + byteArray[ dataIndex++ ];

				pngIndex = ( png.width * pngRow + pngCol++ ) * 4;

				png.data[ pngIndex ] = (( elevation & 0xff0000 ) >> 16 );
				png.data[ pngIndex + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				png.data[ pngIndex + 2 ] = elevation & 0x0000ff;

				png.data[ pngIndex + 3 ] = 255;

				elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
				elevations.push( elevation );
			}
			pngRow++
			pngCol = 0;
		}

		png.pack();
		wstream = fs.createWriteStream( '../../../srtm-temp/' + tileX + '/' + tileY + '.png' ) 
		wstream.on('finish', function() { 
//console.log( 'file ' + tileX + ' ' + tileY + ' written' ); 

		} );
		png.pipe( wstream );

//console.log( elevations );
console.log( 'time', Date.now() - startTime );

	}

	function tile2long( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );
	}

