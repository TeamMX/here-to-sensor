import * as shapefile from 'shapefile';

export async function * openShapeFile(path: string) {
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
            yield {
                id: id + 'T',
                waypoints,
            }
        }

        const isBackwards = properties.DIR_TRAVEL !== 'T';
        if (isBackwards) {
            yield {
                id: id + 'F',
                waypoints: waypoints.reverse(),
            }
        }
    }
}

function toLatLng(coordinate: number[]) {
    const [ lng, lat ] = coordinate;
    return { lng, lat };
}
