// https://github.com/EyalAr/lwip

/*

Doesn't get through two files.

*/

	var startTime = Date.now();
	var startTimeScript = Date.now();
	var count = 0;

	var fs = require( 'fs' );

	var lwip = require( 'lwip' );
	var image;

	var left = 0;
	var top = 0;

	var row;
	var column;

	var r = Math.floor( 255 * Math.random() );
	var g = Math.floor( 255 * Math.random() );
	var b = Math.floor( 255 * Math.random() );

	var fileName = 'c:/temp/topo30/topo1.gsd';
//	var fileName = '../../topo2.gsd';

//	var outputDir = '../../../srtm-temp/';
	var outputDir = './';

	var dataColumns = 43200; 
	var dataColumnsBytes = 2 * dataColumns;// 2 bytes per column
	var dataRows = 21600 / 2; // only half the world map

	var dataPointsPerDegree = 120;

	var latDefault = 39;
	var lonDefault = -123;
	var zoomText = '7+';

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

//console.log( error, byteArray );

		}

		byteArray = buffer;

console.log( 'byteArray.length', byteArray.length );

//console.log( byteArray );

		if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

			fs.mkdirSync( outputDir + TMS7plusX );   

		}

		processTiles();


console.log( 'script time - callbackReadFile - do we get here?', Date.now() - startTimeScript );

	}

	function processTiles() {

		if ( TMS7plusY < 64 && TMS7plusX < 21 ) {

//		if ( TMS7plusY < 128 && TMS7plusX < 128 ) { // southern hemisphere
//
			createPNGTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( TMS7plusX < 20 ) {

			TMS7plusX++;
			TMS7plusY = 0;
//			TMS7plusY = 64; // southern hemisphere

			if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

				fs.mkdirSync( outputDir + TMS7plusX );   

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

//		var lwip = new Lwip;

		lwip.create( colsPerTMS, rowsPerTMS, 'yellow', callbackCreate );

		function callbackCreate( error, img ) {

			image = img;

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

console.log( 'startColumn', startColumn );
console.log( 'startRow', startRow );

			row = startRow;
			column = startColumn;

			processPixels();

		}

	function processPixels() {

		dataIndex = 2 * 43200 * row + 2 * column;

		elevation = byteArray[ dataIndex++ ] * 256 + byteArray[ dataIndex++ ];

		elevation = elevation < 32767 ? elevation : elevation - 65536;

		r = (( elevation & 0x0000ff ) );
		g = (( elevation & 0x00ff00 ) >> 8 );
		b = (( elevation & 0xff0000 )  >> 16 );

//console.log( left );

		if ( left < colsPerTMS - 1 && top < rowsPerTMS - 1) {

			left++;

			column++;

			setNextPixel( left, top, r, g, b );

		} else if ( top < rowsPerTMS - 1) {

			left = 0;
			top++;

			row++;
			column = startColumn;

			setNextPixel( left, top, r, g, b );

		} else {

			image.writeFile( zoomText + '.' + tileX + '.' + tileY + '.png', function( err ){
				// check err...
				// done.

				processTiles();

			});

console.log( 'tile ' + tileX + ' ' + tileY + ' count ' + count ); 



//console.log( 'done ', Date.now() - startTime );

//			return;

		}

	}

		function setNextPixel ( left, top, r, g, b ) {

			image.setPixel( left, top, [ r, g, b, 100 ], processPixels );

		}

	}

	function tile2long( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );
	}
