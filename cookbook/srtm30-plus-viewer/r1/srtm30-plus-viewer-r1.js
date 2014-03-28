	var sourceDir = '../../../data-samples/srtm30-plus/';
	var fileList = 'bathymetry-files-list.txt';
	var startTime; 

	var canvas;
	var context;

	init();

	function init() {
		document.body.style.cssText = ' font: bold 12pt monospace; ';
		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.innerHTML = '<h1 style=display:inline; >SRTM30 Plus Viewer R1</h1> - <select id=selHGT></select>' +
			'<div id=msg></div>';

		var data = requestFile( sourceDir + fileList );
		var files = data.split(/\r\n|\n/);

		for (var option, i = 0; i < files.length; i++) {
			option = document.createElement( 'option' );
			option.innerText = files[i].substr( files[i].lastIndexOf('/') + 1);
			selHGT.appendChild( option );
		}

		selHGT.onchange = function() { requestHGTFile( sourceDir + files[ selHGT.selectedIndex ] ); };
		selHGT.selectedIndex = 0;

		canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = 4800;
		canvas.height = 6000;
		canvas.style.cssText = 'border: 1px solid black; ';
		context = canvas.getContext( '2d' );

		requestHGTFile( sourceDir + files[ selHGT.selectedIndex ] );
	}

	function requestHGTFile( fname ) {
		startTime = new Date();
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', fname, true );
		xmlHttp.send( null );
		xmlHttp.onload = function() { parseData( xmlHttp.response ); } ;
	}

	function parseData( arrayBuffer) {
		var byteArray = new Uint8Array( arrayBuffer );
		var elevations = new Int16Array( arrayBuffer );
		var len = byteArray.length;

console.log( len  / 2 );
		var holder, index = 0;
		for ( var i = 0; i < len; i += 2 ) {
			elevations[ index++ ] = ( byteArray[ i ] << 8 ) + byteArray[ i + 1 ];
/* alternative method
			holder = byteArray[i];
			byteArray[i++] = byteArray[i];
			byteArray[i] = holder;
*/
		}

		var imageData = context.createImageData( 4800, 6000 );
		var id = imageData.data;
		var height, index = 0;
		var addSpace = 80;  // setting to a higher data may help make data more 'visible'
		for ( var i = 0, len = id.length; i < len; i++) {
			height = (  addSpace * elevations[ index++ ] + 0xffffff + 1 ).toString( 16 ).slice( -6 );
			id[ i++ ] = parseInt( height.substr( 0, 2 ), 16 );
			id[ i++ ] = parseInt( height.substr( 2, 2 ), 16 );
			id[ i++ ] = parseInt( height.substr( 4, 2 ), 16 );
			id[ i ] = 255;
		}
		context.putImageData( imageData, 0, 0 );

console.log( 'Load time in ms: ', new Date() - startTime );
	}

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}
