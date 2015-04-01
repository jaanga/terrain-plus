
	var fs = require('fs');
	var Buffer = require('buffer').Buffer;

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

		readFile( fileNameIn );

	}

	function readFile( fileName ) {
		startTimeFile = new Date();

// fs.read(fd, buffer, offset, length, position, callback) // not. why not??

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {
		if ( error ) { 
			throw error;
console.log( error, byteArray );
		}
		byteArray = buffer
//		index = byteArray.length - 2;
//		elevation = ( byteArray[ index ] * 256 + byteArray[ index + 1] );
//		elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
console.log( byteArray.length );
console.log( byteArray );
//console.log( 'buffer', byteArray.toString('utf-8', 0, 100) );
//console.log( elevation );
		readRows( 0, 2 );
	}


	function readRows( startRow, lengthRow ) {

		for ( var i = startRow; i < startRow + lengthRow; i++ ) {

			readColumns( i, 0, 50 );

		}

	}

	function readColumns( row, startColumn, length ) {

		index = 2 * 43200 * row + 2 * startColumn;
		start = startColumn;

		finish = start + length;

		for ( var i = start; i < finish; i++ ) {
			elevation = ( byteArray[ index ] * 256 + byteArray[ index + 1] );
			elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
			elevations.push( elevation );
		}

console.log( elevations );

	}