
	fileName = '../../../data-samples/ferranti-3sec-hgt/-120/N37W120.hgt';

	var rowStart = 0;
	var rows = 1201

	var columnStart = 0;
	var columns = 1201;

	var data;

	var fs = require( 'fs' );

	fs.readFile( fileName, function ( error, result ) {

		if ( error ) throw error;

		data = result;

console.log( 'length', data.length );
console.log( 'isBuffer',Buffer.isBuffer( data ) );
console.log( 'isEncoding',Buffer.isEncoding( data ) );
console.log( data );

		cropFile = new Buffer( 0 );

console.log( 'Buffer.byteLength( cropFile )', Buffer.byteLength( cropFile ) );


		for ( var row = rowStart; row < rowStart + rows; row++ ) {

			lineSlice = data.slice( ( 2 * ( 1201 * row + columnStart) ), ( 2 * ( 1201 * row + columnStart + columns) ) );

console.log( row, lineSlice );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

console.log( cropFile );

		fs.writeFile('./test.hgt', cropFile, function (err) {

			if ( err ) throw err;

			console.log('\nIt\'s saved!');

		});

	});
