HGT Viewer Read Me
==================

### Live Demo

[HGT Viewer R3]( http://jaanga.github.io/terrain-plus/cookbook/hgt-viewer/latest/ )


## Concept

### Mission
Provide a web browser viewer for HGT files - binary data containers of elevation data

### Vision
Help make it easier and faster to visualize mashed-up elevation data from a variety of sources

## Features
* Reads the binary data in an HGT or SRTM file and displays it as a colored image
* Converts 'big endian' data to 'little endian' data
* Displays HGT files in ['Data-Damples/ Ferranti 3 Sec HGT']( https://github.com/jaanga/terrain-plus/tree/gh-pages/data-samples/ferranti-3sec-hgt )
* Elevation, X & Y, RGB and other data are displayed as you move your mouse over the image
* Select to view in 'raw' or 'pretty' colors
* Tests a color range algorithm that can cope with plus or minus 11K elevations
* Check the file for data below sea level or higher than Mount Everest
* Save the data as a PNG bitmap


## Road Map
* Have all the features of [PNG Viewer]( http://jaanga.github.io/terrain-viewer/png-viewer/readme-reader.html )
* Permalinks
* Capability to differentiate distinctly color ranges above and below zero

## Issues /Bugs
* Elevation colors in 'pretty' mode are not pretty enough 


## Credits

Jonathan de Ferranti's [Viewfinder Panoramas]( http://www.viewfinderpanoramas.org/dem3.html )  
USGS's [SRTM Data]( http://dds.cr.usgs.gov/srtm/ )  

Thanks for the color range ideas and algorithm from Jim Bumgardner at <http://krazydad.com/tutorials/makecolors.php>  
Thanks to GeoffMc and BradHards for helping with the 'big endian' issue.   
Thanks to radouxju for the nice link on alternative solutions.  
Thanks to Ryan for the byte swapping routine from here: <http://stackoverflow.com/questions/7869752/javascript-typed-arrays-and-endianness>  

See also this question on GIS Stack Exchange:  
<http://gis.stackexchange.com/questions/90417/how-do-you-convert-srtm-hgt-elevations-from-wgs84-into-meters-above-sea-level>

Background data on the HGT file format is available from:

* <http://stackoverflow.com/questions/357415/how-to-read-nasa-hgt-binary-files>  
* <http://gis.stackexchange.com/questions/43743/how-to-extract-elevation-from-hgt-file>


## Project Links

You have two ways of viewing the HGT Viewer files:

* Web page hosted on GitHub: [jaanga.github.io]( http://jaanga.github.io/jaanga/terrain-plus/cookbook/hgt-viewer "view the files as apps." ) <input value="<< You are now probably here." size=28 style="font:bold 12pt monospace;border-width:0;" >  
* Source code on GitHub: [github.com/jaanga]( https://github.com/jaanga/terrain-plus/tree/gh-pages/cookbook/hgt-viewer "View the files as source code." ) <scan style=display:none ><< You are now probably here.</scan>

This project is a continuation of [Read HGT Files]( http://jaanga.github.io/terrain-plus/cookbook/read-hgt-files/readme-reader.html )


### Copyright and License

[Jaanga copyright notice and license]( https://github.com/jaanga/jaanga.github.io/blob/master/jaanga-copyright-and-mit-license.md )

This repository contains files that are  at an early and volatile stage. Not all licensing requirements may have been fully met let alone identified. It is the intension of the authors to play fair and all such requirements will either be met or the feature in question will turned off.


### Change Log

2014-03-28 ~ Theo

* Add Info box
* Enable full data round trip verification
* Add check data for outliers
* Add Save to PNG


2014-03-27 ~ Theo

* R2 add mouseover read out

2014-03-26 ~ Theo

* R1 Added




