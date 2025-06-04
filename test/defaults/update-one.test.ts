import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/update-one";

import { requester, withDb } from "../helpers";

withDb(() => {
  describe("Update One", () => {
    const client = dataSources["local"];
    const users = [{ points: 10 }, { points: 20 }, { points: 30 }];

    test("Should update one document where points is less than 30", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {},
        update: {
          $set: { points: 30 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body.modifiedCount).toBe(1);
      expect(body.matchedCount).toBe(1);
    });

    test("Should update one document with some update one options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {},
        update: {
          $set: { points: 30 },
        },
        options: {
          upsert: true,
        },
      };

      const { body } = await requester({ data, url: endPoint });

      expect(body.modifiedCount).toBe(0);
      expect(body.upsertedCount).toBe(1);
    });
  });
});
