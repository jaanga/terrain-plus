	var sourceDir = '../../../sandbox-ferranti-3sec-hgt/';
	var fileList = 'hgt-files-list.txt';
	var startTime; 

	var canvas;
	var context;

	init();

	function init() {
		document.body.style.cssText = ' font: bold 12pt monospace; ';
		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.innerHTML = '<h1 style=display:inline; >HGT Viewer R1</h1> - <select id=selHGT></select>' +
			'<div id=msg></div>';

		var data = requestFile( sourceDir + fileList );
		var files = data.split(/\r\n|\n/);

		for (var option, i = 0; i < files.length; i++) {
			option = document.createElement( 'option' );
			option.innerText = files[i].substr( files[i].lastIndexOf('/') + 1);
			selHGT.appendChild( option );
		}

		selHGT.onchange = function() { requestHGTFile( sourceDir + files[ selHGT.selectedIndex ] ); };
		selHGT.selectedIndex = 33;

		canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = canvas.height = 1201;
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
		var holder, index = 0;
		for ( var i = 0; i < len; i++) {
			elevations[ index++ ] = ( byteArray[ i ] << 8 ) + byteArray[ ++i ];
/* alternative method
			holder = byteArray[i];
			byteArray[i++] = byteArray[i];
			byteArray[i] = holder;
*/
		}

		imageData = context.createImageData( 1201, 1201 );
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
