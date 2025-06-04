import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/find-one-and-delete";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  const client = dataSources["local"];

  describe("Find One And Delete", () => {
    const users = [
      { _id: new ObjectId(), points: 10 },
      { points: 20 },
      { points: 30 },
    ];

    test("Should find one document and delete it", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: 10,
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual(users[0]);
    });

    test("Should execute the same query as before with some find one and delete options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: 10,
        },
        options: {
          projection: { _id: 0 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body).toStrictEqual({ points: users[0].points });
    });
  });
});
