import { openShapeFile } from './shapeFile';
import { getOsrmNodes } from './osrm';
import * as fs from 'fs';

async function run() {
    let count = 0;
    openShapeFile(filePath, shape => {
        getOsrmNodes(osrmUrl, shape.waypoints).then(nodes => {
            fs.appendFile(outFilePath, `${shape.id},${nodes.join(' ')}\n`, () => {
                count += 1;
                if (count % 1000 === 0)
                console.info(`processed ${count} entries...`);
            });
        });
    });
}

const outFilePath = 'sensor-segment-map.csv';
const osrmUrl = 'http://localhost:5000';
const filePath = 'Streets';

run();
