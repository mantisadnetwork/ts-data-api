import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/find-one-and-update";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  const client = dataSources["local"];

  describe("Find One And Update", () => {
    const user = { _id: new ObjectId(), points: 10 };

    test("Should find one document and update it", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          _id: user._id,
        },
        update: {
          $set: { points: 40 },
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertOne(user);

      const { body } = await requester({ data, url: endPoint });
      expect(body).toStrictEqual(user);

      const userNew = await collection.findOne({ _id: user._id });
      expect(userNew!.points).toStrictEqual(data.update.$set.points);
    });

    test("Should execute the same query as before with some find one and update options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        filter: {
          _id: user._id,
        },
        update: {
          $set: { points: 40 },
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
      expect(userNew!.points).toStrictEqual(data.update.$set.points);
    });
  });
});
