import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/find-one";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  const client = dataSources["local"];

  describe("Find One", () => {
    const users = [
      { _id: new ObjectId(), points: 10 },
      { _id: new ObjectId(), points: 20 },
      { _id: new ObjectId(), points: 30 },
      { _id: new ObjectId(), points: 40 },
    ];

    test("Should find one document", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: users[0].points,
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });
      expect(body).toStrictEqual(users[0]);
    });

    test("Should find one document with some find one options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          points: { $gte: 15 },
        },
        options: {
          skip: 1,
          sort: { points: 1 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });
      expect(body).toStrictEqual(users[2]);
    });
  });
});
