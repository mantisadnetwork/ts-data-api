import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/find-one-and-replace";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  const client = dataSources["local"];

  describe("Find One And Replace", () => {
    const user = { _id: new ObjectId(), points: 10 };

    test("Should find one document and replace it", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          _id: user._id,
        },
        replacement: {
          points: 40,
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertOne(user);

      const { body } = await requester({ data, url: endPoint });
      expect(body).toStrictEqual(user);

      const userNew = await collection.findOne({ _id: user._id });
      expect(userNew).toStrictEqual({ ...user, ...data.replacement });
    });

    test("Should execute the same query as before with some find one and replace options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          _id: user._id,
        },
        replacement: {
          points: 40,
        },
        options: {
          projection: { _id: 0 },
          returnDocument: "after",
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertOne(user);

      const { body } = await requester({ data, url: endPoint });
      expect(body).toStrictEqual({ points: 40 });

      const userNew = await collection.findOne({ _id: user._id });
      expect(userNew).toStrictEqual({ ...user, ...data.replacement });
    });
  });
});
