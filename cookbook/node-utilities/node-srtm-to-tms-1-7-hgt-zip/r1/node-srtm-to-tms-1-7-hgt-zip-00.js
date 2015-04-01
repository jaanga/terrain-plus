// https://github.com/niegowski/node-pngjs

// node
	var fs = require( 'fs' );
	var JSZip = require( 'jszip' );
	var lwip = require( 'lwip' );

//	var runType = 'north';
//	var runType = 'south';
	var runType = 'test';

	var latDefault = 37.796; // sf
	var lonDefault = -122.398; // sf
	var zoom = 6;

	var tmsX = lon2tile ( lonDefault, zoom );
	var tmsY = lat2tile ( latDefault, zoom );


	if ( runType === 'north' ) {

		var fileName = 'c:/temp/topo30/topo1.gsd';
		var TMS7plusX = 0; // 20 sf
		var TMS7plusY = 0; // 49 sf
		var TMS7plusXMin = 0;
		var TMS7plusXMax = Math.pow( 2, zoom );
		var TMS7plusYMin = 0;
		var TMS7plusYMax = 0.5 * TMS7plusXMax;
		var outputDir = 'C:/temp/srtm-hgt-temp/';

	} else if ( runType === 'south' ) {

		fileName = 'c:/temp/topo30/topo2.gsd';
		TMS7plusX = 0; // 20 sf
		TMS7plusY = 64; // 49 sf
		TMS7plusXMin = 0;
		TMS7plusXMax = 127;
		TMS7plusYMin = 64;
		TMS7plusYMax = 128;
		outputDir = 'C:/temp/srtm-hgt-temp/';

	} else {

		fileName = 'c:/temp/topo30/topo1.gsd';
		TMS7plusX = tmsX; // 20 sf
		TMS7plusY = tmsY; // 49 sf
		TMS7plusXMax = tmsX + 1;
		TMS7plusXMin = 0;
		TMS7plusYMax = tmsY + 1;
		TMS7plusYMin = 0;
		outputDir = './';

	}

	var rows = 21600 / 2; // only half the world map
	var columns = 43200; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column
	var dataPointsPerDegree = 120;

	var colsPerTMS = Math.floor( columns / Math.pow( 2, zoom ) );

// lat/lon

	var latStart;
	var latEnd;

	var lonStart;
	var lonEnd;

// current run stats
	var startTime = Date.now();
	var startTimeScript = Date.now();

	var count = 0;
	var byteArray;

	var elevations;

	var top;
	var left;

	init();

	function init() {

console.log( '\nfileName', fileName );
console.log( 'colsPerTMS', colsPerTMS );
console.log( 'column check', ( 32 * colsPerTMS ) + ( 32 * ( colsPerTMS + 1 ) ) );

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArray = buffer;  // make global

console.log( '\nfile loaded - byteArray.length', byteArray.length );
//console.log( byteArray );

		if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

			fs.mkdirSync( outputDir + TMS7plusX );   

		}

		processTiles();

console.log( 'script time ???', Date.now() - startTimeScript );

	}


	function processTiles() {

		if ( TMS7plusY < TMS7plusYMax && TMS7plusX < TMS7plusXMax ) {

			createHGTTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( TMS7plusX < TMS7plusXMax ) {

			TMS7plusX++;

			TMS7plusY = TMS7plusYMin;

			if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

				fs.mkdirSync( outputDir + TMS7plusX );   

			}

			if ( runType !== 'test' ) { createHGTTile( TMS7plusX, TMS7plusY ); }  // comment out to process just a single column


		} else {

console.log( '\n\nscript time', Date.now() - startTimeScript );

		}

	}

	function createHGTTile( tileX, tileY ) {

		count++;
//		var startTime = Date.now();

		latStart = tile2lat( tileY, zoom );
		latEnd = tile2lat( tileY + 1, zoom );

		rowStart = latStart > 0 ? 10800 - 120 * latStart : 120 * -latStart;
		rowStart = Math.floor( rowStart );

		rowEnd = latEnd >= 0 ? 10800 - 120 * latEnd: -120 * - latEnd;
		rowEnd = Math.floor( rowEnd );

		rowsPerTMS = Math.round( Math.abs( latStart - latEnd ) * dataPointsPerDegree );

		lonStart = tile2lon( tileX, zoom );
		columnStart = columns + ( Math.floor( 120 * lonStart ) );
		lonEnd = tile2lon( tileX + 1, zoom );
		columnEnd = columns + ( Math.floor( 120 * lonEnd ) );
		columnsCheck = columnEnd - columnStart

		elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );

console.log( '\ntileX', tileX, 'tileY', tileY, 'count', count );


console.log( 'latStart', latStart.toFixed( 1 ) );
console.log( 'latEnd', latEnd.toFixed( 1 ) );
console.log( 'rowStart', rowStart );
console.log( 'rowEnd', rowEnd );
console.log( 'rowsPerTMS', rowsPerTMS );

console.log( '\nlonStart', lonStart );
console.log( 'lonEnd', lonEnd );
console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );
console.log( 'columnsCheck', columnsCheck );

console.log( '\nbyteStart', byteStart );
console.log( 'byteEnd', byteEnd );

console.log( 'bytes', 2 * colsPerTMS * rowsPerTMS );

		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = dataBytesPerRow * row + 2 * columnStart;

			lineSlice = byteArray.slice( dataIndex, dataIndex + 2 * colsPerTMS );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

		min = max = 0;

		for ( var i = 0; i < cropFile.length; ) {

			elevation = ( cropFile[ i++ ] << 8 ) + cropFile[ i++ ];
			elevation = elevation < 32767 ? elevation : elevation - 65536;
			elevations.push( elevation );

min = elevation < min ? elevation : min;
max = elevation > max ? elevation : max;

		}

console.log( 'elevations.length', elevations.length );
console.log( 'elevations', elevations.slice( 0, 10 ) );
console.log( 'min', min, 'max', max );

		lwip.create( colsPerTMS, rowsPerTMS, 'red', callbackLwip );

		function callbackLwip( error, img ) {

			image = img

// console.log( 'image', image );

			left = 0;
			top = 0;

			processPixels();

		}

/*
console.log( 'cropFile.length', cropFile.length );

		var zip = new JSZip();
		zip.file( zoom + '-' + TMS7plusX + '-' + TMS7plusY + '.hgt', cropFile);

		var buffer = zip.generate( { type: "nodebuffer", compression: "DEFLATE" } );

		var fName = outputDir + TMS7plusX + '/' + TMS7plusY + '.zip';

		fs.writeFile( fName, buffer, function ( error ) {

			if ( error ) throw error;

console.log( fName, 'saved!');

			processTiles();

		});

//console.log( 'time', Date.now() - startTime );

*/

	}

	function processPixels() {

		elevation = elevations[ top * colsPerTMS + left ];

		b = (( elevation & 0xff0000 )  >> 16 );
		g =  (( elevation & 0x00ff00 ) >> 8 );
		r = (( elevation & 0x0000ff ) );

		if ( left < colsPerTMS - 1 && top < rowsPerTMS - 1) {

			left++;

			setNextPixel( left, top, r, g, b );

		} else if ( top < rowsPerTMS - 1) {

			left = 0;
			top += 1;

			setNextPixel( left, top, r, g, b );

		} else {

			image.resize( 256, 256, function() {

				image.writeFile( zoom + '.' + TMS7plusX + '.' + TMS7plusY + '.png', function( err ){
					// check err...

					imageDataToHGT();

				});

			});

//console.log( 'tile ' + tileX + ' ' + tileY + ' count ' + count ); 



//console.log( 'done ', Date.now() - startTime );

//			return;

		}

		function setNextPixel ( left, top, r, g, b ) {

			image.setPixel( left, top, [ r, g, b, 100 ], processPixels );

		}

	}

	function imageDataToHGT() {

console.log( 'imageDataToHGT', image.getPixel( 0, 0 ), image.width() );

		elevations2 = [];

		for ( var top = 0; top < 256; top++ ) {
			for ( var left = 0; left < 256; left++ ) {
				pixel = image.getPixel( left, top )
//console.log( pixel );
				elevation = pixel.r + 256 * pixel.g + 65536 * pixel.b;
				elevations2.push( elevation );

			}
		}

		elev = elevations2.slice( 0, 100 );

		typedArray = new Uint8Array( elevations2 );

console.log( typedArray.length );


//		processTiles();

		var zip = new JSZip();
		zip.file( zoom + '-' + TMS7plusX + '-' + TMS7plusY + '.hgt', typedArray );

		var buffer = zip.generate( { type: "nodebuffer", compression: "DEFLATE" } );

//		var fName = outputDir + TMS7plusX + '/' + TMS7plusY + '.zip';
		var fName = outputDir + TMS7plusY + '.zip';

		fs.writeFile( fName, buffer, function ( error ) {

			if ( error ) throw error;

console.log( fName, 'saved!');

			processTiles();

		});


	}



	function lon2tile( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}

	function lat2tile( lat, zoom ) {

		var pi = Math.PI
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}

	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {

		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

	}
