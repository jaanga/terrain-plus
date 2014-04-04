	var fs = require('fs');
	var PNG = require('pngjs').PNG;
	var elevations = [];

	var fileNameList = '../../../../terrain-srtm30-plus/srtm30-plus-files-list.txt';
	var folderNameIn = '../../../../terrain-srtm30-plus/srtm/';
	var folderNameOut = '../../../../terrain-srtm30-plus/png/';
	var fileNames;
//	var fileName = 'w140n40.Bathymetry';
	var fileType = '.srtm';
//	var fileBlank = '../../../samples-png/blank-1201x1201.png';
	var fileBlank = '../../../samples-png/blank-4800x6000.png';

//	fs.readFile('../../../data-samples/ferranti-3sec-hgt/-123/N37W123.hgt', function ( err, data ) {

	init();

	function init() {
		fs.readFile( fileNameList, function ( err, data ) {
			if ( err ) throw err;
			var text = data.toString();
			fileNames = text.split(/\r\n|\n/);
			for (var i = 0, len = fileNames.length; i < 2; i++) {
				readFile( fileNames[i] );
console.log( fileNames[i] );
			}
		});
	}

	function readFile( fileName ) {

		fs.readFile( folderNameIn + fileName, function ( err, data ) {
			if ( err ) throw err;

			for (var i = 0, len = data.length; i < len; i++) {
				elevations.push( ( data[ i ] * 256 ) + data[ ++i ] );
			}
//console.log( elevations.length, elevations.slice( 0, 30 ) );
		});

		fs.createReadStream( fileBlank )

		.pipe( new PNG( {
			filterType: 4
		} ) )

		.on( 'parsed', function() {
			var elevationHex;
			var len = this.data.length;
//console.log( elevations.length, len );
			var index = 0;
			for ( i = 0; i < len; i++ ) {
				//elevationHex = ( elevations[ index++ ] + 0xffffff + 1 ).toString( 16 ).slice( -6 );
				elevationHex = elevations[ index++ ].toString( 16 ).slice( -6 );
				this.data[ i++ ] = parseInt( elevationHex.substr( 0, 2 ), 16 );
				this.data[ i++ ] = parseInt( elevationHex.substr( 2, 2 ), 16 );
				this.data[ i++ ] = parseInt( elevationHex.substr( 4, 2 ), 16 );
				this.data[ i ] = 255;
			}

			this.pack().pipe( fs.createWriteStream( folderNameOut + fileName.slice(0, -5) + '.png' ) );
		});
	}
