import { MongoClient } from "mongodb";
import { z } from "zod";

import { envs } from "../envs";

export const dataSources = Object.entries(envs.DATA_SOURCES).reduce<{
  [key: string]: MongoClient;
}>((clients, [key, value]) => {
  clients[key] = new MongoClient(value, {
    appName: envs.APP_NAME,
    ignoreUndefined: true,
    readPreference: "primaryPreferred",
    writeConcern: { journal: true, w: "majority" },
  });

  return clients;
}, {});
