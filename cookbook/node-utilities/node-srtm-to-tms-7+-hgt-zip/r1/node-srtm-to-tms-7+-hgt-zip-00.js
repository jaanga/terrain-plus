
// node
	var fs = require('fs');
	var JSZip = require("jszip");

	var runType = 'north';
//	var runType = 'south';
//	var runType = 'test';

	var latDefault = 37.796; // sf
	var lonDefault = -122.398; // sf
	var zoom = 7;
	var zoomText = '7+';

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
		TMS7plusYMax = tmsY + 10;
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

			createHGTTile( TMS7plusX, TMS7plusY );  // comment out to process just a single column

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

		var elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );

console.log( '\ntileX', tileX, 'tileY', tileY, 'count', count );

/*
console.log( 'latStart', latStart.toFixed( 1 ) );
console.log( 'latEnd', latEnd.toFixed( 1 ) );
console.log( 'rowStart', rowStart );
console.log( 'rowEnd', rowEnd );
console.log( 'rowsPerTMS', rowsPerTMS );

console.log( '\nlonStart', lonStart );
console.log( 'lonEnd', lonEnd );
console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );

console.log( '\nbyteStart', byteStart );
console.log( 'byteEnd', byteEnd );
*/

		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = dataBytesPerRow * row + 2 * columnStart;

			lineSlice = byteArray.slice( dataIndex, dataIndex + 2 * colsPerTMS );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

		var zip = new JSZip();
		zip.file( zoom + '.' + TMS7plusX + '.' + TMS7plusY + '.hgt', cropFile);

		var buffer = zip.generate( { type: "nodebuffer", compression: "DEFLATE" } );

		var fName = outputDir + TMS7plusX + '/' + TMS7plusY + '.zip';

		fs.writeFile( fName, buffer, function ( error ) {

			if ( error ) throw error;

console.log( fName, 'saved!');

			processTiles();

		});

//console.log( 'time', Date.now() - startTime );

	}

	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}

	function tile2lat( y, zoom ) {

		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

	}
