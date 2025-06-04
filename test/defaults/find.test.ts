import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/find";

import { requester, withDb } from "../helpers";

withDb(() => {
  describe("Find", () => {
    const client = dataSources["local"];
    const users = [
      { points: 10 },
      { points: 20 },
      { points: 30 },
      { points: 40 },
    ];

    test("Should find all documents where points is less than 30", async () => {
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

      expect(body).toStrictEqual([users[0], users[1]]);
    });

    test("Should find documents with some find options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {},
        options: {
          skip: 1,
          limit: 2,
          sort: { points: 1 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual([users[1], users[2]]);
    });
  });
});
