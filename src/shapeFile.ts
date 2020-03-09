import * as shapefile from 'shapefile';

interface LatLng {
    lat: number;
    lng: number;
}

interface Shape {
    id: string;
    waypoints: LatLng[];
}

export async function openShapeFile(path: string, callback: (shape: Shape) => void) {
    _openShapeFile(path, callback);
}

async function _openShapeFile(path: string, callback: (shape: Shape) => void) {
    const file = await shapefile.open(path);
    for (let line = await file.read(); !line.done; line = await file.read()) {

        const { geometry, properties } = line.value;
        if (!properties || geometry.type !== 'LineString') {
            continue;
        }

        const id = String(properties.LINK_ID);
        const waypoints = geometry.coordinates.map(toLatLng);

        const isForwards = properties.DIR_TRAVEL !== 'F';
        if (isForwards) {
            callback({ id: id + 'T', waypoints });
        }

        const isBackwards = properties.DIR_TRAVEL !== 'T';
        if (isBackwards) {
            callback({ id: id + 'F', waypoints: waypoints.reverse() });
        }
    }
}

function toLatLng(coordinate: number[]) {
    const [ lng, lat ] = coordinate;
    return { lng, lat };
}
