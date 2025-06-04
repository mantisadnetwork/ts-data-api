import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/distinct";

import { requester, withDb } from "../helpers";

withDb(() => {
  const client = dataSources["local"];

  describe("Distinct", () => {
    const users = [{ points: 10 }, { points: 20 }, { points: 30 }];

    test("Should get all the distinct values for the field points", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        key: "points",
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual([10, 20, 30]);
    });

    test("Should get all the distinct values for the field points that is less than 30", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        key: "points",
        filter: {
          points: { $lt: 30 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual([10, 20]);
    });

    test("Should execute the same query as before with some distinct options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        key: "points",
        filter: {
          points: { $lt: 30 },
        },
        options: {
          readConcern: { level: "local" },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual([10, 20]);
    });
  });
});
