Terrain Dev Notes
=================

2014-03-29 ~ Theo

Added bettr eroor checking
Added ability to read Scripps Institute SRTM files
Added Put canvas image in a DIV so menu and readout stay visible when image is crolled
Enhanced readabiity of variable names and minor code clean-up

All going very well

14:39
Added two USGS 1 Second SRTM files. They are identified just as the others.

All working fast and smoothly.

Perhaps the only issue is that thr 'pretty' viewer could be prettier. Maybe a lookup table version should be added.

So the workflow is looking like this:

Download all the Scripps 1 minute files / 120 points per degree 
These files cover the entire globe
These files have zero voids
Translate data from srtm to PNG for zoom level 7
This is the base map.

Source all of de Ferranti's 3 second files
These fies cover the land masses over the entire globe
All ocean data is kept with an levation of zero

Run throught all the Scripps data
If there is no de Ferrant tile to cover then the Scripps tile stays
If there is a de Ferranti tile, then enlarge the Scripps PNG tile to 12001 points per degree.
Read the de Ferranti tile and the Scripps tile data simulatneously
If the de Ferranti data point says the elevation is 0 and Scripps says it is -7,689 then Scripps wins
For data above 0, de Ferranti's wins. If there is no de Ferranti data then Scripps data stays.  

Repeat the de Ferranti data overlay process with 1 Second data whereever available

In this manner any voids in the data are automaticaly filled by the lower resolution data 
- which has been vetted and authorized by a well-known cartographer.




2014-03-28 ~ Theo

15:45
Failed at scaling image data in a canvas context. Took several hours to learn how to fail.

Added a floating translucent menu to HGT viewer
- Select any data sample fille to view
- With color swatch and data read out

Added a pretty color checkbox that uses Jim Bungardner;s color algorithm.
- looks like it will work well
- needs to know min max elevations and then scale scale the rangge of colors appropriately
- Great start

Added Help box with relevant data

Can now make the round trip: from HGT file to heightmap to nummbers. Yay!

Add check data for outliers

Add 'Save as PNG'

21:09 
Working on read me files


2014-03-27 ~ Theo
I should have started this long ago. This work is so much fun and so interesting. It's a shane when there is no sharing, Anyway, here we go.

Just down loaded the GEBCO_08 Grid - a 30 arc-second grid of global elevations; it is a continuous terrain model for ocean and land.

credit: ‘The GEBCO_08 Grid, version 20100927, http://www.gebco.net’. 

https://www.bodc.ac.uk/data/online_delivery/gebco/gebco_08_grid/
 
From PDF:
 
> Within the netCDF files for the GEBCO_08 Grid and GEBCO_08 SID Grid, the data are stored as one-dimensional arrays of 2-byte signed integer values.  

> The complete data sets give global coverage and each file consists of 21,600 rows x 43,200 columns, resulting in 933,120,000 data points. The data start at the Northwest corner of the files, i.e. for the global files, position 89° 59’ 45’’N, 179° 59’ 45’’W and are arranged in latitudinal bands of 360 degrees x 120 points/degree = 43,200 values. The data range eastward from 179° 59’ 45’’W to 179° 59’ 45’’E. Thus, the first band contains 43,200 values for 89° 59’ 45’’N, then followed by a band of 43,200 values at 89°59’ 15’’N and so on at 30 arc-second latitude intervals down to 89° 59’ 45’’S.  

> The data values are pixel centre registered i.e. they refer to data values at the centre of grid cells.   

It is a 1.8 GB file of binary data. It may be possible to open this in JavaScript by reading just a portion of the file at a time. 
Similar to what was done with the Zurich files in the Urdacha project. Or maybe could use GDAL to covert to simpler format.

The current idea is to go from source data to final PNG is a single swoop or pass. Say, read bathymetric data and put n canvas context, 
then overlay with 3 second data, then overlay with 1 second data where available then save as PNG in TMS level 7 folders

Seems doable

14:04
Satellite Geodesy data - Scripps Institute UCSD - seems better. Files are in SRTM format - which I assume is HGT compatible and the files are available as one or in 33 smaller files. 

17:43

After a lot of siliness on my part, there is now a working SRTM30 Plus viewer