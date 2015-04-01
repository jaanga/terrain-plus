	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderNameIn = '../../../../terrain-srtm30-plus/srtm/';
	var folderNameOut = '../../../../terrain-srtm30-plus/png/';
	var fileBlank = '../../../samples-png/blank-4800x6000.png';
	var fileAntarctic = '../../../samples-png/blank-7200x3600.png';
	var shortList = [ 6, 10, 14, 21, 25, 32 ];

	var fileNames;
	var count;
	var startTimeApp; 
	var startTimeFile; 

	init();

	function init() {
		fs.readdir( folderNameIn, function( err, files ) {
			if ( err ) throw err;
			startTimeApp = new Date();
			fileNames = files;
			count = 0;
			readFile( fileNames[ count] );
console.log( 'start' );
		});
	}

	function readFile( fileName ) {
		startTimeFile = new Date();
		fs.readFile( folderNameIn + fileName, function ( err, data ) {
			if ( err ) throw err;
			processData( data );
		});
	}

	function processData( byteArray ) {
		var blank = ( shortList.indexOf( count ) > -1 ) ? fileAntarctic : fileBlank;
		fs.createReadStream( blank )

		.pipe( new PNG( {
			filterType: 4
		} ) )

		.on( 'parsed', function() {
			var thisData = this.data, len = thisData.length;
			var elevation, elevationHex;
			var index = 0;
			for ( i = 0; i < len; i++ ) {
				elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevationHex = elevation.toString( 16 ).slice( -6 );
				thisData[ i++ ] = parseInt( elevationHex.substr( 4, 2 ), 16 );
				thisData[ i++ ] = parseInt( elevationHex.substr( 2, 2 ), 16 );
				thisData[ i++ ] = parseInt( elevationHex.substr( 0, 2 ), 16 );
				thisData[ i ] = 255;
			}

			this.pack().pipe( fs.createWriteStream( folderNameOut + fileNames[ count ].slice( 0, -5 ) + '.png' ) );
console.log( 'log', count, fileNames[count], 'file time:', new Date() - startTimeFile, 'app time:', new Date() - startTimeApp );
			count++;
			if ( count < fileNames.length ) {
				readFile( fileNames[count] );
			}
		} );
	}
