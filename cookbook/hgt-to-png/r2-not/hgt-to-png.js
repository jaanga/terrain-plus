
	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderNameIn = '../../../../terrain-srtm30-plus/srtm/';
	var folderNameOut = '../../../../terrain-srtm30-plus/png/';

	var fileBlank = '../../../samples-png/blank-4800x6000.png';

	fs.readdir( folderNameIn, function( err, files ) {
		if ( err ) throw err;

		files.forEach( function( file ) {

			if ( !file.match(/\.srtm$/i) )
			return;

			fs.createReadStream( fileBlank )
	//		fs.createReadStream(__dirname + '/img/' + file)

			.pipe(new PNG())

			.on('parsed', function() {
console.log( file );

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

	/*
				if (this.gamma) {
					for (var y = 0; y < this.height; y++) {
						for (var x = 0; x < this.width; x++) {
							var idx = (this.width * y + x) << 2;

							for (var i = 0; i < 3; i++) {
								var sample = this.data[idx + i] / 255;
								sample = Math.pow(sample, 1 / 2.2 / this.gamma);
								this.data[idx + i] = Math.round(sample * 255);
							}
						}
					}
				}
	*/

				this.pack().pipe(fs.createWriteStream( folderNameOut + file.slice( 0, -5 ) + '.png'));

			});



		});
	});
