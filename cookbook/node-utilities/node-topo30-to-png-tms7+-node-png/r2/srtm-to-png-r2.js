
	var fs = require('fs');

	var fileNameIn = '../../topo1.gsd';
	var startTime;

	var latDefault = 39;
	var lonDefault = -123;

	var cropRows = 240;
	var cropColumns = 240;

	var startRow;
	var startColumn;

	var finishRow = startRow + cropRows - 1;
	var finishColumn = startColumn + cropColumns;

	var dataColumns = 2 * 43200;
	var dataRows = 21600;

	var elevations = [];
	var byteArray;

	init();

	function init() {
		startTimeFile = new Date();
		readFile( fileNameIn );

// fs.read(fd, buffer, offset, length, position, callback) // not. why not??

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {
		if ( error ) { 
			throw error;
console.log( error, byteArray );
		}
		byteArray = buffer

console.log( byteArray.length );
console.log( byteArray );

		lon = lonDefault;
		lat = latDefault;

		startColumn = lon < 0 ? 120 * lon : 120 * lon;
		startRow = lat < 0 ? 10800 - 120 * lat : 10800 - 120 * lat;

		finishRow = startRow + cropRows - 1;
		finishColumn = startColumn + cropColumns;

		elevations = [];

		var index;

		for ( var row = startRow; row < finishRow; row++ ) {

			index = 2 * 43200 * row + 2 * startColumn;

			for ( var column = startColumn; column < finishColumn; column++ ) {

				elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
				elevations.push( elevation );

			}
		}

console.log( elevations );

	}


