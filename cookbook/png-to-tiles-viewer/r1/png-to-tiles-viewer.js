	var info;
	var title = 'PNG to Tiles Viewer R1';

	var fileName = 'w180n90.Bathymetry.png';


	var latDelta = 50;
	var lonDelta = 40;

	var latStart = 90;
	var lonStart = -180;

	var latFinish = latStart - latDelta;
	var lonFinish = lonStart + lonDelta;

	var latDeltaLevel7 = 180 / 128;
	var lonDeltaLevel7 = 360 / 128;

	var pixelsX = (lonDeltaLevel7 * 120).toFixed(3);
	var pixelsY = (latDeltaLevel7 * 120).toFixed(3);

	var tileXCount = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;
	var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;


	var b = '<br>';
	init();

	function init() {

		updateTitle( title );
		addCSS();

		var canvas= document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.width = 480;
		canvas.height = 600;
		canvas.style.cssText = 'border: 1px solid black; ';
		var context = canvas.getContext( '2d' );

		var image = document.createElement( 'img' );
		image.src = '../../../../terrain-srtm30-plus/png/' + fileName;
		image.onload = function(){

			canvas.width = 0.1 * image.width;
			canvas.height = 0.1 * image.height;
			context.scale( 0.1, 0.1 );
			context.drawImage( image, 0, 0 );
			
			var tile, tileContext, p;
			for (var i = 0; i < tileXCount; i++) {
				for (var j = 0; j < tileYCount; j++) {
					var tile = document.body.appendChild( document.createElement( 'canvas' ) );
					tile.width = 34;
					tile.height = 17;
					tile.style.cssText = 'border: 1px solid black; ';
					var contextTile = tile.getContext( '2d' );
					//contextTile.scale( 0.1, 0.1 );
					contextTile.drawImage( image, i * 338, j * 169, 338, 169, 0, 0, 34, 17 );

				}
				p = document.body.appendChild( document.createElement( 'p' ) );
			} 

		};
		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.innerHTML = '<div id=msg ></div>';

		msg.innerHTML = 
			'lonDeltaLevel7: ' + lonDeltaLevel7 + ' latDeltaLevel7: ' + latDeltaLevel7 + b +
			'pixelsX: ' + pixelsX + ' pixelsY: ' + pixelsY + b +
			'tileXCount: ' + tileXCount + ' tileYCount: ' + tileYCount + b;



	}

	function updateTitle( titl ) {
		title = titl;
		document.title = title;
	}

	function addCSS() {
		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; )' + // margin: 0; overflow: hidden; }' +
//			'h1 { margin: 0; }' +
//			'h1 a {text-decoration: none; }' +
//			'#closer { position: absolute; right: 5px; top: 5px; }' +
//			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
	}