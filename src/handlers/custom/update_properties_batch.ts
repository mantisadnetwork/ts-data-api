import * as h3 from "h3";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";
import { ObjectIdSchema } from "../../utils";
import {BSON, WriteConcern} from "mongodb";

const schema = z.object({
  properties: z.array(z.any()),
});

export const method = "post";
export const endPoint = "/custom/update_properties_batch";
export const handler = async (event: h3.H3Event) => {
  const body = await M.bodyHandler({ event, schema });
  const client = dataSources["local"];
  const session = client.startSession();

  try{
    const data = body.properties;

    const properties = client.db("mantis-ad-server").collection("properties");

    const bulk = [];

    for(const [propertyId, merge] of Object.entries(data)) {
      bulk.push({updateOne: {
          filter: {_id: new BSON.ObjectId(propertyId)},
          update: {$set: merge}
        }})
    }

    await properties.bulkWrite(bulk, {ordered: false, writeConcern: new WriteConcern(1), session});

    return {updated: true, commands: bulk};
  } finally {
    await session.endSession();
  }
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
