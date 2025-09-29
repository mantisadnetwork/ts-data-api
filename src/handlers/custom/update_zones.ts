import * as h3 from "h3";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";
import { ObjectIdSchema } from "../../utils";
import {BSON, WriteConcern} from "mongodb";

const schema = z.object({
    _id: z.string(),
    zones: z.record(z.string(), z.record(z.string(), z.any())),
});

export const method = "post";
export const endPoint = "/custom/update_zones";
export const handler = async (event: h3.H3Event) => {
    const body = await M.bodyHandler({ event, schema });
    const client = dataSources["local"];
    const session = client.startSession();

    try{
        const properties = client.db("mantis-ad-server").collection("properties");
        const crit = {_id: new BSON.ObjectId(body._id)};

        const doc = await properties.findOne(crit);

        if (!doc){
            return {updated: false, reason: 'missing property'}
        }

        for(const [zoneId, merge] of Object.entries(body.zones)) {
            if (!doc.zones){
                return {updated: false, reason: 'missing zones'};
            }

            const docZone = doc.zones.find((z:Record<string, any>) => z._id === zoneId);

            if(docZone){
                Object.assign(docZone, merge);
            } else {
                return {updated: false, reason: 'zone not found'};
            }
        }

        await properties.updateOne(crit, {$set: {zones: doc.zones}}, {session});

        return {updated: true};
    } finally {
        await session.endSession();
    }
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
