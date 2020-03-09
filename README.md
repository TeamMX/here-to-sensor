# HERE to Sensor Map

This project converts HERE static geography and map layout files into a map of sensor IDs to OSM segment IDs. This map is produced in `.csv` format and is imported from hdfs by the batch and stream components of the spark backend.

## Usage

This project expects `Streets.dbf` and `Streets.shp` files in the application's root directory. the `.dbf` file provides the link ID and the `.shp` provides the road geometry. The output file is `sensor-segment-map.csv`. The output file should be deleted before each run as the program uses `fs.appendFile` to add each line.

Additionally, an OSRM instance running the `driving` profile with geometry of the region being processed is expected at `http://localhost:5000`.

```
npm install
npm run start:dev
```
