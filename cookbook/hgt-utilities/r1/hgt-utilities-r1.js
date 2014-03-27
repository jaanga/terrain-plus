
	var fileList = '../../../sandbox-ferranti-3sec-hgt/hgt-files-list.txt';
	var saveName = 'hgt-list.geojson';
	var startTime;

	init();

	function init() {
		document.body.style.cssText = ' font: bold 12pt monospace; ';

		info = document.body.appendChild( document.createElement( 'div' ) );
		info.innerHTML = '<h1>HGT Utilities ~ ' +
				'<a id=aHelp href=# onclick=help.style.display="block"; >&#x24D8;</a> ' +
				'<a href=JavaScript:createGeoJSON(); >Create GeoJSON</a> ' +
				'<a href=JavaScript:requestGeoJSONLint(); >Request GeoJSON Lint</a> - ' +

				'<a href=JavaScript:scanHGTFiles(); >Scan HGT Files</a> - ' +
				'<a href=JavaScript:saveIt(); >Save</a>' +
			'</h1>' +
			'<div id=divLeft></div>' +
			'<div id=divRight></div>' +
		'';

		addHelp();

		divLeft.style.cssText = 'left: 1%; height: 900px; outline: 1px solid red; overflow: auto; position: absolute; top: 6%; width: 10%;';

		divRight.style.cssText = 'left: 15%; height: ' + (window.innerHeight - 100 ) + 'px ; outline: 1px solid red; overflow: auto; position: absolute; top: 6%; width: 80%;';
	}

	function createGeoJSON() {
		var nameIn, nameOut;
		var textLeft = '', textRight = '', b = '<br>';

		divRight.innerHTML = '{' + b +
		'"type": "FeatureCollection",' + b +
		'"features": [' + b;

		var pre1 =  '{' +
			'"type": "Feature", ' +
			'"geometry": {' +
			'"type": "Point", ' +
			'"coordinates": [';

		var post1 = ']' + '}, ' + '"properties": { ' + '"name": "';
		var post2 = '" ' + '}' + ' },' ;

		var list = requestFile( fileList );
		var lines = list.split(/\r\n|\n/);
		var line;
		for (var i = 0, len = lines.length - 1; i < len; i++) {
			line = lines[i];
			finalSlash = 1 + line.lastIndexOf('\\');
			nameIn = lines[i].substr( finalSlash, 7);
			textLeft += nameIn + b;

			nameOut = pre1;
			nameOut += ( nameIn.substr( 3,1) === 'E') ? parseInt( nameIn.substr(4), 10 ) : '-' + parseInt( nameIn.substr(4), 10 );
			nameOut += ', ';
			nameOut += ( nameIn.substr( 0,1) === 'N') ? parseInt( nameIn.substr(1,2), 10 ) : '-' + parseInt( nameIn.substr( 1,2 ), 10 );
			nameOut = nameOut.replace('+0','0');
			nameOut = nameOut.replace('-0','0');

			textRight += nameOut + post1 + nameIn + post2 + b;
		}

		divLeft.innerHTML = textLeft;

		var finalComma = textRight.lastIndexOf(',');
		textRight = textRight.substring(0, finalComma) + b + ']' + b +  '}';
		divRight.innerHTML += textRight;
		saveName = 'hgt-list.geojson';
	}

	function scanHGTFiles() {
		var startTime = new Date();

		divRight.innerHTML = '';
		var list = requestFile( fileList );
		var lines = list.split(/\r\n|\n/);
		var arrayBuffer;
		for (var i = 0, len = lines.length - 1; i < len; i++) {
			requestHGTFile( lines[ i ] );
		}
		saveName = 'hgt-errors.txt';

console.log( 'Load time in ms: ', new Date() - startTime );
	}

	function requestHGTFile( fileName ) {
console.log( fileName );
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous";
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', fileName, true );
		xmlHttp.send( null );
		xmlHttp.onload = function() { parseData( xmlHttp.response, fileName ); };
	}

	function parseData( arrayBuffer, fileName ) {
		var txt = '<br><h3>' + fileName.substr( fileName.lastIndexOf('\\') + 1) + '</h3><br>';
		var byteArray = new Uint8Array( arrayBuffer );
		var elevations = new Int16Array( arrayBuffer );
		var len = byteArray.length;
		var index = 0;
		for ( var i = 0; i < len; i += 2) {
			elevations[ index ] = ( byteArray[ i ] << 8 ) + byteArray[ i + 1];
			if ( elevations[ index ] < 0 || elevations[ index ] > 8848 ) {
				txt += index + ' '  + elevations[index] + ' ';
			}
			index++;
		}
		divRight.innerHTML += txt;
	}


	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous";
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}

	function processSuccess( data ) {
		data = JSON.parse( data );
		if (data.status === 'ok') {
			alert('You just posted some valid GeoJSON!');
		} else if (data.status === 'error') {
			alert('There was a problem with your GeoJSON: ' + data.message);
		}
	}

	function requestGeoJSONLint() {
		var cleanText = divRight.innerText;
		xmlHttpLint = new XMLHttpRequest();
		var url = 'http://geojsonlint.com/validate';
		xmlHttpLint.open( 'POST', url, true );
//		xmlHttpLint.setRequestHeader('Content-Type', 'application/json');
		xmlHttpLint.onreadystatechange = function () {
			if ( xmlHttpLint.readyState == 4 && xmlHttpLint.status == 200) {
				processSuccess( xmlHttpLint.responseText );
			}
		};
		xmlHttpLint.send( cleanText );
	}

	function saveIt() {
		var blob = new Blob( [ divRight.innerText ], { type: "text/plain;charset=utf-8" } );
		saveAs( blob, saveName );
	}

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 450px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML =
			'<div onclick=help.style.display="none"; >' +
				'<h3>HGT  Utilities</h3>' +
				'<h4>Create geoJSON File</h4>' +
				'<ul>' +
					'<li>Build a map of the HGT files</li>' +
					'<li>Directly viewable with GitHub</li>' +
				'</ul>' +
				'<h4>Request GeoJSON Lint</h4>' +
				'<ul>' +
					'<li>Validate geoJSON file</li>' +
				'</ul>' +
				'<h4>Scan HGT files</h4>' +
				'<ul>' +
					'<li>List the index and elevation of data < 0 or > 8848 meters</li>' +
				'</ul>' +
				'<a href="https://github.com/jaanga/terrain-plus/tree/gh-pages/cookbook/hgt-utilities" target="_blank">Source code</a><br>' +
				'<small>credits: ' +
//				'<a href="http://threejs.org" target="_blank">three.js</a> - ' +
//				'<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';
		aHelp.style.cssText += 'text-decoration: none; ';
		aHelp.title = 'Get help and information';
		//aHelp.onclick = 'help.style.display="block";';
	}