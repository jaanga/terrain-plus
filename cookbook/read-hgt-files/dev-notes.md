Read HGT Files Dev Notes
========================


2014-03-20 ~ Theo

Now using Int16Array. Data numbers seem to be coming in correctly, but have huge values.

<http://www.madmappers.com/msdetails/SRTM.htm>:

    Elevations are given relative to the WGS84 ellipsoid or to the reference surface that was used to measure ground control points 
    and not relative to the WGS-84 geoid as it is required for conformance with international mapping accuracy standards.

Heights are in meters referenced to the WGS84/EGM96 geoid

http://gis.stackexchange.com/questions/90417/how-do-you-convert-srtm-hgt-elevations-from-wgs84-into-meters-above-sea-level

2014-03-19 ~ Theo

Build reader that opens any de Ferranti HGT file
App has drop down lists with lat, lon and gazetteer
Uses look up table to source file in de Ferrant's file structure 

There are utils to zip/unzip for JavaScript.
Could perhaps data directly from de Ferranti's zip files.

Reading HGT files and building canvas images that almost look OK.
Feels amazing.
The issue is the the incoming byte array provides two byes per number - to build a 16 bit integer. - signed two byte integer
I have no idea how to turn these two bytes into a JavaScript number.