	var sourceDir = '../../../data-samples/ferranti-3sec-hgt/';
	var fileList = 'hgt-files-list.txt';
	var title = 'HGT Viewer R3';

	var frequency1 = 0.001, 
	frequency2 = 0.001, 
	frequency3 = 0.001, 
	phase1 = 0, 
	phase2 = 2, // 2 * Math.PI / 3, 
	phase3 = 4, // 4 * Math.PI / 3 , 
	center = 128; //255 / 2, 
	amplitude = 127; // / 2;
	var sin = function( n ) { return Math.sin( n ); };

	var startTime; 
	var canvas;
	var context;
	var elevations;
	var files;

	init();

	function init() {

		updateTitle( title );
		addCSS();
		addMenu();
		addHelp();

		canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = canvas.height = 1201;
		canvas.onmousemove = onMMove;
		canvas.style.cssText = 'border: 0px solid black; ';
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
		for ( var i = 0; i < len; i++) {
			elevations[ index++ ] = ( byteArray[ i ] << 8 ) + byteArray[ ++i ];
/* alternative method
			var holder = byteArray[i];
			byteArray[i++] = byteArray[i];
			byteArray[i] = holder;
*/
		}
		imageData = context.createImageData( 1201, 1201 );
		idd = imageData.data;
		var elevation, elevationHex;
		var i, index = 0, len = idd.length;
		if ( inpPretty.checked === true ) {
			for ( i = 0; i < len; i++ ) {
				elevation = elevations[ index++ ]; 
				elevationHex = ( elevation + 0xffffff + 1 ).toString( 16 ).slice( -6 );
				idd[ i++ ] = parseInt( sin( frequency1 * elevation + phase1 ) * amplitude + center, 10 );
				idd[ i++ ] = parseInt( sin( frequency2 * elevation + phase2 ) * amplitude + center, 10 );
				idd[ i++ ] = parseInt( sin( frequency3 * elevation + phase3 ) * amplitude + center, 10 );
				idd[ i ] = 255;
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				elevationHex = ( elevations[ index++ ] + 0xffffff + 1 ).toString( 16 ).slice( -6 );
				idd[ i++ ] = parseInt( elevationHex.substr( 0, 2 ), 16 );
				idd[ i++ ] = parseInt( elevationHex.substr( 2, 2 ), 16 );
				idd[ i++ ] = parseInt( elevationHex.substr( 4, 2 ), 16 );
				idd[ i ] = 255;
			}
		}
		context.putImageData( imageData, 0, 0 );

console.log( 'Load time in ms: ', new Date() - startTime );
	}

	function checkData() {
		var len = elevations.length;
		var txt = 'No outliers found...'
		for (var i = 0;  i < len; i++) {
			if ( elevations[i] < 0 || elevations[ i] > 8848 ) {
				idd[ i * 4] = idd[ i * 4 + 1] = idd[ i * 4 + 2] = idd[ i * 4 + 3] = 255
				txt += i + ' ' + elevations[i] + ' - ';
			}
		}
		msg.innerHTML = len + ' items read<br>Outliers: ' + txt;
	}
	function onMMove( e ) {
		var x = e.offsetX;
		var y = e.offsetY;
		var p = context.getImageData( x, y, 1, 1).data;
		if ( inpPretty.checked === false ) { 
			var hex = rgbToHex( p[0], p[1], p[2] ).toUpperCase();
		} else {
			var hex = 0;
		}
		var indexXY = 1201 * y + x;
		var indexHex = parseInt( '0x'  + hex, 16);

		msg.innerHTML =  'x:' + x + ' y:' + y + '<br>rgb:' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '<br>hex: #' + hex + '<br>' +
			'indexXY: ' + indexXY + ' indexHex: ' + indexHex + '<br>' +
			'elevation: Array:' + elevations[ indexXY ] + ' Hex2Dec:' + indexHex;
		swatch.style.backgroundColor = '#' + hex;
	}

	function rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
		var str = ( ( r << 16 ) | ( g << 8 ) | b ).toString( 16 );
		str = ('000000' + str).slice(-6); 
		return str;
	}

	function updateTitle( titl ) {
		title = titl;
		document.title = title;
	}

	function addCSS() {
		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 { margin: 0; }' +
			'h1 a {text-decoration: none; }' +
			'#closer { position: absolute; right: 5px; top: 5px; }' +
			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
	}

	function addMenu() {
		var menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'movable';
		menu.style.cssText = ' background-color: #ccc; left: 10px; opacity: 0.8; top: 10px; max-width: 320px; ';
		menu.addEventListener( 'mousedown', mouseMove, false );
		menu.innerHTML = '<div onclick=menu.style.display="none"; >[x]</div>' +
			'<h1>' +
				'<a href="" >' + title + '</a> ' +
				'<a href=# id=aHelp title="Get help and info" onclick=help.style.display="block"; ><large>&#x24D8;</large></a>' +
			'</h1>' +
			'<p>' +
				'Select HGT: <select id=selHGT title="Select a different view to view" ><select><br>' +
				'Pretty colors: <input id=inpPretty type=checkbox title="display a continuous range of colors" ><br>' +
				'<input type=button onclick=checkData() value="Check data" title="Highlight any data < 0 or > 8488" ><br>' +
				'<input type=button onclick=saveIt(); value="Save as PNG" >' +
			'</p>' +
			'<hr>' +
			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +
		'';

		inpPretty.onchange = function() { requestHGTFile( sourceDir + files[ selHGT.selectedIndex ] ); };

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

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 370px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML =
			'<div onclick=help.style.display="none"; >' +
				'<h3>boilerplate</h3>' +
				'<h4>Featurs include the following:</h4>' +
				'<ul>' +
					'<li>View any of the data sample HGT files</li>' +
					'<li>Hummans can choose to see pretty colors</li>' +
					'<li>Verifies data goes fro HGT file to heightmap and back to data</li>' +
					'<li>Inspect the HGT file for outliers</li>' +
					'<li>Save file as PNG/li>' +
				'</ul>' +
				'<a href="https://github.com/jaanga/terrain-plus/tree/gh-pages/cookbook/hgt-viewer/" target="_blank">Source code</a><br>' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';
		aHelp.style.cssText += 'text-decoration: none; ';
		aHelp.title = 'Get help and information';
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

	function saveIt() {
		canvas.toBlob( function(blob) {
			saveAs( blob, files[ selHGT.selectedIndex ].replace('.hgt','') + '.png' );
		});
		console.log('saving...' ); 
	}

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}