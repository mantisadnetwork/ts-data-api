import * as h3 from "h3";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";
import { ObjectIdSchema } from "../../utils";
import {BSON, WriteConcern} from "mongodb";

const schema = z.object({
    zones: z.record(z.string(), z.record(z.string(), z.any())),
});

export const method = "post";
export const endPoint = "/custom/update_zones_batch";
export const handler = async (event: h3.H3Event) => {
    const body = await M.bodyHandler({ event, schema });
    const client = dataSources["local"];
    const session = client.startSession();

    try{
        const properties = client.db("mantis-ad-server").collection("properties");
        const propertyIds = Object.keys(body.zones);

        const crit = {_id: {$in: propertyIds.map(id => new BSON.ObjectId(id))}};

        const docs = await properties.find(crit).toArray();

        const bulk = [];

        for(const doc of docs){
            const docId = doc._id.toString();
            const zones = body.zones[docId];

            if(!doc){
                return {updated: false, reason: 'missing property'};
            }

            for(const [zoneId, merge] of Object.entries(zones)) {
                const zones = doc.zones || [];

                const docZone = zones.find((z:Record<string, any>) => z._id === zoneId);

                if(docZone){
                    Object.assign(docZone, merge);
                } else {
                    zones.push({_id: zoneId, ...merge});
                }

                bulk.push({updateOne: {
                        filter: {_id: doc._id},
                        update: {$set: {zones}}
                    }})
            }
        }

        if(bulk.length > 0){
            await properties.bulkWrite(bulk, {ordered: false, writeConcern: new WriteConcern(1), session});
        }

        return {updated: true};
    } finally {
        await session.endSession();
    }
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
