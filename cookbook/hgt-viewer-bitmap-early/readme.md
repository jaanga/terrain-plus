Read HGT Files Read Me
======================

### Live Demo

[Read HGT Files R2]( http://jaanga.github.io/terrain-plus/cookbook/read-hgt-files/r2/read-hgt-files-r2.html )

* Byte swap using strings

[Read HGT Files R3]( http://jaanga.github.io/terrain-plus/cookbook/read-hgt-files/r2/read-hgt-files-r3.html )

* Byte swap using but slices


* Takes a few seconds to load and display the data
* [Source code]( https://github.com/jaanga/terrain-plus/blob/gh-pages/cookbook/read-hgt-files/ )

See also this question on GIS Stack Exchange:  
<http://gis.stackexchange.com/questions/90417/how-do-you-convert-srtm-hgt-elevations-from-wgs84-into-meters-above-sea-level>


## Concept

* The short term goal is to be able to:
	* Open and read using JavaScript the binary HGT files from:
		* Jonathan de Ferranti's [Viewfinder Panoramas]( http://www.viewfinderpanoramas.org/dem3.html )
		* USGS's [SRTM Data]( http://dds.cr.usgs.gov/srtm/ )
	* Display the data as bitmaps in HTML canvas elements
<!--	* Currently a bit slow because counting the numeber of different elevations takes time  -->
* The longer term goal is to use this ability to translate all of de Ferranti's data into heightmaps that can be used to create 3D cartography

## Features

* Converts 'big endian' data to 'little endian' data
* Displays various data about the file including maximum and minimum elevations read
* Display number of points with no data
* Lists the number of different elevations read 

## Credits


Thanks to GeoffMc and BradHards for helping with the 'big endian' issue.   
Thanks to radouxju for the nice link on alternative solutions.  
Thanks to Ryan for the byte swapping routine from here: <http://stackoverflow.com/questions/7869752/javascript-typed-arrays-and-endianness>


<!--
## Road Map
-->

## Issues /Bugs

* 

## Project Links

Background data on the HGT file format is available from

* <http://stackoverflow.com/questions/357415/how-to-read-nasa-hgt-binary-files>
* <http://gis.stackexchange.com/questions/43743/how-to-extract-elevation-from-hgt-file>


You have two ways of viewing the 'Read HGT Files' files:

* Web page hosted on GitHub: [jaanga.github.io]( http://jaanga.github.io/terrain-plus/cookbook/read-hgt-files/ "view the files as apps." ) <input value="<< You are now probably here." size=28 style="font:bold 12pt monospace;border-width:0;" >  
* Source code on GitHub: [github.com/jaanga]( https://github.com/jaanga/terrain-plus/tree/gh-pages/cookbook/read-hgt-files "View the files as source code." ) <scan style=display:none ><< You are now probably here.</scan>

Jaanga web log: [jaanga.com]( http://jaanga.com )


## Copyright Notice and License

[Jaanga copyright notice and license]( https://github.com/jaanga/jaanga.github.io/blob/master/jaanga-copyright-and-mit-license.md )

This app is at an early and volatile stage. Not all licensing requirements may have been fully met let alone identified. It is the intension of the authors to play fair and all such requirements will either be met or the feature in question will turned off.


## Change Log

* R2 update
* Display color for every elevation

2014-03-21 ~ Theo

* R2 added
* Big endian fixes added
* Lists number of elevations

2014-03-19 ~ Theo

* Read me added



