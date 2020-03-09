import { Agent } from 'http';
import axios, { AxiosResponse } from 'axios';

const client = axios.create({
    httpAgent: new Agent({ keepAlive: true, maxSockets: 256 }),
    validateStatus: status => status >= 200 && status < 500,
});

export async function getOsrmNodes(osrmUrl: string, waypoints: Array<{ lat: number, lng: number }>) {
    const osrmWaypoints = waypoints.map(({lat, lng}) => `${lng},${lat}`).join(';');
    const response = await client.get(`${osrmUrl}/route/v1/driving/${osrmWaypoints}?annotations=true`);
    if (response.status !== 200) {
        throw new Error();
    }
    const legs = response.data.routes[0].legs as any[]
    const [firstLeg, ...otherLegs] = legs.map(leg => leg.annotation.nodes as number[]);
    const otherLegsFixed = otherLegs.map(nodes => nodes.slice(2));
    const allNodes = [firstLeg, ...otherLegsFixed].reduce((prev, current) => [...prev, ...current]);
    return allNodes.map(String);
}

async function httpGet(url: string, timeoutMs: number = 1000): Promise<AxiosResponse> {
    const response = await client.get(url);
    if (response.status === 429) {
        if (timeoutMs > 60000) {
            throw new Error();
        }
        await timeout(timeoutMs);
        return await httpGet(url, timeoutMs * 2);
    }
    if (response.status !== 200) {
        throw new Error();
    }
    return response;
}

async function timeout(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
