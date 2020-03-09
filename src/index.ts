import { openShapeFile } from './shapeFile';
import { getOsrmNodes } from './osrm';
import * as fs from 'fs';

async function run() {
    for await (const shape of openShapeFile(filePath)) {
        getOsrmNodes(osrmUrl, shape.waypoints).then(nodes => {
            fs.appendFile(outFilePath, `${shape.id},${nodes.join(' ')}\n`, () => undefined);
        });
    }
}


const outFilePath = 'sensor-segment-map.csv';
const osrmUrl = 'http://23eccc4e.ngrok.io';
const filePath = 'D:\\Users\\Jonathon\\Desktop\\University\\ENSE 400\\20190712-UofT_TrafficAnalytics_TRIAL\\NAVSTREETS\\Streets';

run();
