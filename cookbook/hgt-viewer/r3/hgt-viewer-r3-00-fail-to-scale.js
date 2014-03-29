	var sourceDir = '../../../data-samples/ferranti-3sec-hgt/';
	var fileList = 'hgt-files-list.txt';
	var startTime; 

	var canvas;
	var context;
	var scale = 75;

	var elevations;
	var files;

	var css;
	var menu;
	var title = 'Select HGT R3';

	init();

	function init() {

		addCSS();
		addMenu();

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
		var index = 0;
//		var holder,
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
		var height;
		var addSpace = 80;  // setting to a higher data may help make data more 'visible'
		for ( i = 0, index = 0, len = id.length; i < len; i++) {
			height = (  addSpace * elevations[ index++ ] + 0xffffff + 1 ).toString( 16 ).slice( -6 );
			id[ i++ ] = parseInt( height.substr( 0, 2 ), 16 );
			id[ i++ ] = parseInt( height.substr( 2, 2 ), 16 );
			id[ i++ ] = parseInt( height.substr( 4, 2 ), 16 );
			id[ i ] = 255;
		}
		context.putImageData( imageData, 0, 0 );

// not good
		var newCanvas = document.body.appendChild( document.createElement( 'canvas' ) );
		newCanvas.width = newCanvas.height = scale * 0.01 * 1201;
		newCanvas.style.cssText = 'border: 1px solid red; ';

		var newContext = newCanvas.getContext("2d");
		newContext.scale( scale * 0.01, scale * 0.01 );
		newContext.putImageData( imageData, 0, 0 );
		newContext.drawImage( newCanvas, 0, 0);

// broken
//		var scaled = scaleImageData( imageData, 0.75);
//		newContext.putImageData( scaled, 0, 0 );

console.log( 'Load time in ms: ', new Date() - startTime );
	}

	function scaleImageData(imageData, scale) {
		var scaleCanvas = document.body.appendChild( document.createElement( 'canvas' ) );
		scaleCanvas.width = scaleCanvas.height = scale * 1201;
		var scaleContext = scaleCanvas.getContext("2d");

		var scaled = scaleContext.createImageData(imageData.width * scale, imageData.height * scale);
		var subLine = scaleContext.createImageData(scale, 1).data
		for (var row = 0; row < imageData.height; row++) {
			for (var col = 0; col < imageData.width; col++) {
				var sourcePixel = imageData.data.subarray(
					(row * imageData.width + col) * 4,
					(row * imageData.width + col) * 4 + 4
				);
				for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4);
				for (var y = 0; y < scale; y++) {
					var destRow = row * scale + y;
					var destCol = col * scale;
					scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
				}
			}
		}

		return scaled;
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
			swatch.style.backgroundColor = '#' + hex;
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


	function updateTitle( titl ) {
		title = titl;
		document.title = title;
	}

	function addCSS() {
		css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 { margin: 0; }' +
			'h1 a {text-decoration: none; }' +
			'#closer { position: absolute; right: 5px; top: 5px; }' +
			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
	}

	function addMenu() {
		menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'movable';
		menu.style.cssText = ' background-color: #ccc; left: 10px; opacity: 0.8; top: 10px; max-width: 320px; ';
		menu.addEventListener( 'mousedown', mouseMove, false );
		menu.innerHTML = '<div onclick=menu.style.display="none"; >[x]</div>' +
			'<h1>' +
				'<a href="" >' + title + '</a> ' +
//				'<a href=# title="Get help and info" onclick=help.style.display="block"; ><large>&#x24D8;</large></a>' +
			'</h1>' +
			'<p>' +
//				'Zoom: &nbsp;  &nbsp;<input id=setZoom title="0 to 18: OK" type=number min=0 max=18 step=1 ><br>' +
//				'Scale:  &nbsp; <input id=setScale type=number min=1 max=50 step=1 ><br>' +
				'Select HGT: <select id=selHGT title="Select the file" ><select>' +
			'</p>' +
			'<hr>' +
			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +
		'';

		var data = requestFile( sourceDir + fileList );
		files = data.split(/\r\n|\n/);

		for (var option, i = 0; i < files.length; i++) {
			option = document.createElement( 'option' );
			option.innerText = files[i].substr( files[i].lastIndexOf('/') + 1);
			selHGT.appendChild( option );
		}

		selHGT.onchange = function() { requestHGTFile( sourceDir + files[ selHGT.selectedIndex ] ); };
		selHGT.selectedIndex = 33;

		window.addEventListener('mouseup', mouseUp, false);
	}

// events
	function mouseUp() {
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseMove( event ){
		if ( event.target.id === 'movable' ) {
			event.preventDefault();

			offsetX = event.clientX - event.target.offsetLeft;
			offsetY = event.clientY - event.target.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}
	}

	function divMove( event ){
		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';
	}
