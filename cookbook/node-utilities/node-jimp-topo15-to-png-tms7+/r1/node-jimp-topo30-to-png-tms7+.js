
// node
	var fs = require('fs');
	var Jimp = require( 'jimp' );

//	var runType = 'north';
//	var runType = 'south';
	var runType = 'test';

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
		var outputDir = 'C:/temp/srtm-png-test/7+/';

	} else if ( runType === 'south' ) {

//		fileName = 'c:/temp/topo30/topo2.gsd';
		fileName = 'c:/temp/topo15/topo15-001.gsd';
		TMS7plusX = 0; // 20 sf
		TMS7plusY = 64; // 49 sf
		TMS7plusXMin = 0;
		TMS7plusXMax = Math.pow( 2, zoom );
		TMS7plusYMin = 64;
		TMS7plusYMax = Math.pow( 2, zoom );
		outputDir = 'C:/temp/srtm-png-test/7+/';

	} else {

		fileName = 'c:/temp/topo30/topo1.gsd';
		fileName = 'c:/temp/topo15/topo15-001.gsd';
		TMS7plusX = 20; // tmsX; // 20 sf
		TMS7plusY = 49; // tmsY; // 49 sf
		TMS7plusXMax = 21; //tmsX + 1;
		TMS7plusXMin = 0;
		TMS7plusYMax = 50; //tmsY + 1;
		TMS7plusYMin = 0;
		outputDir = './';

	}

	var rows = 43200; // 21600 / 2; // only half the world map
	var columns = 86400; // 43200; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column
	var dataPointsPerDegree = 86400 / 360; // 240;

	var colsPerTMS = Math.floor( columns / Math.pow( 2, zoom ) ); // 675 @ zoom 7

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

		if ( TMS7plusX < TMS7plusXMax && TMS7plusY < TMS7plusYMax  ) {

			if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

				fs.mkdirSync( outputDir + TMS7plusX );   

			}

			createPNGTile( TMS7plusX, TMS7plusY );

			TMS7plusX++;

		} else if ( TMS7plusX < TMS7plusXMax ) {

			TMS7plusY++;

			TMS7plusX = TMS7plusXMin;

			createPNGTile( TMS7plusX, TMS7plusY );  // comment out to process just a single column

		} else {

console.log( '\n\nscript time', Date.now() - startTimeScript );

		}

	}

	function createPNGTile( tileX, tileY ) {

		count++;
//		var startTime = Date.now();

		latStart = tile2lat( tileY, zoom );
		latEnd = tile2lat( tileY + 1, zoom );

		rowStart = latStart > 0 ? 0.5 * 43200 - dataPointsPerDegree * latStart : -dataPointsPerDegree * latStart;
		rowStart = Math.floor( rowStart );

		rowEnd = latEnd >= 0 ? 0.5 * 43200 - dataPointsPerDegree * latEnd : -dataPointsPerDegree * latEnd;
		rowEnd = Math.floor( rowEnd );

		rowsPerTMS = Math.round( Math.abs( latStart - latEnd ) * dataPointsPerDegree );

		lonStart = tile2lon( tileX, zoom );
		columnStart = columns + ( Math.floor( dataPointsPerDegree * lonStart ) );
		lonEnd = tile2lon( tileX + 1, zoom );
		columnEnd = columns + ( Math.floor( dataPointsPerDegree * lonEnd ) );

		var elevations = [];
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
console.log( 'colsPerTMS', colsPerTMS );
console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );

console.log( '\ndataBytesPerRow', dataBytesPerRow );
console.log( 'byteStart', byteStart );
console.log( 'byteEnd', byteEnd );

console.log( 'bytes', 2 * colsPerTMS * rowsPerTMS );

		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = dataBytesPerRow * row + 2 * columnStart;

			lineSlice = byteArray.slice( dataIndex, dataIndex + 2 * colsPerTMS );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

		var elevations = [];

		var image = new Jimp( '../../../../samples-png/10x10.png', function () {

			this.resize( colsPerTMS, rowsPerTMS );

			png = this.bitmap.data;

			dataIndex = 0;

			for ( var pngIndex = 0; pngIndex < png.length; pngIndex += 4 ) {

				elevation = 256 * cropFile[ dataIndex++ ] + cropFile[ dataIndex++ ];

//				elevation = elevation < 32767 ? elevation : elevation - 65536;

				elevations.push( elevation );

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000) >> 16;

				png[ pngIndex + 3 ] = 255;
			}

			this.write( outputDir + tileX + '/' + tileY + '.png', cb ) // save

		});

		function cb() {

console.log( cropFile.slice( 0, 30 ) );

console.log( elevations.slice( 0, 30 ) );

console.log( 'tile', tileX, tileY, count );

			processTiles();

		}

//console.log( 'time', Date.now() - startTime );

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
