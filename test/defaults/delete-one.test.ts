import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/delete-one";

import { requester, withDb } from "../helpers";

withDb(() => {
  const client = dataSources["local"];

  describe("Delete One", () => {
    const users = [{ points: 10 }, { points: 20 }, { points: 30 }];

    test("Should delete one document where points is less than 30", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: { $lt: 30 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body.acknowledged).toBe(true);
      expect(body.deletedCount).toBe(1);
    });

    test("Should execute the same query as before with some delete one options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: { $lt: 30 },
        },
        options: {
          writeConcern: {
            journal: true,
            w: "majority",
          },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body.acknowledged).toBe(true);
      expect(body.deletedCount).toBe(1);
    });
  });
});
