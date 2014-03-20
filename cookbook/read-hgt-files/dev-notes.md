Dev Notes
=========

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