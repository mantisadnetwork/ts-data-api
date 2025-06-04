import * as h3 from "h3";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";

const schema = z.object({
  dataSource: z.string(),
  database: z.string(),
  collection: z.string(),
  filter: z.record(z.unknown()),
  update: z.union([z.record(z.unknown()), z.array(z.unknown())]),
  options: z.record(z.unknown()).optional(),
});

export const method = "post";
export const endPoint = "/defaults/updateOne";
export const handler = async (event: h3.H3Event) => {
  const body = await M.bodyHandler({ event, schema });

  return dataSources[body.dataSource]
    .db(body.database)
    .collection(body.collection)
    .updateOne(body.filter, body.update, body.options);
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
