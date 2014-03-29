	var sourceDir = '../../../data-samples/ferranti-3sec-hgt/';
	var fileList = 'hgt-files-list.txt';
	var startTime; 

	var canvas;
	var context;
	var elevations;

	init();

	function init() {
		document.body.style.cssText = ' font: bold 12pt monospace; ';
		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.innerHTML = '<h1 id=title style=display:inline; >HGT Viewer R2</h1> - <select id=selHGT></select>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>';

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
		canvas.onmousemove = onMMove;
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
		elevations = new Int16Array( arrayBuffer );
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

	function onMMove( e ) {
		//if ( e.pageX != undefined && e.pageY != undefined) {
			var x = e.offsetX;
			var y = e.offsetY;
			var p = context.getImageData( x, y, 1, 1).data;
			var hex = rgbToHex( p[0], p[1], p[2] ).toUpperCase();
// broken
			msg.innerHTML =  'x:' + x + ' y:' + y + '<br>rgb:' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '<br>hex: #' + hex + '<br>' +
				'elevation: ' + elevations[ parseInt( '0x'  + hex, 16) ] + ' - ' + elevations[ x * (y - 1) + x ];
			title.style.backgroundColor = '#' + hex;
		//}
	}

// needs work. Why is last digit displayed always 0?
	function rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
		var str = ( ( r << 16 ) | ( g << 8 ) | b ).toString( 16 );
		str = ('000000' + str).slice(-6); 
// console.log ( str );
		return str;
	}
