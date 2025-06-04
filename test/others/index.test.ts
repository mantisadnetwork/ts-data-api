import { DataSourcesSchema } from "../../src/envs";

test("Data Sources Zod Parser", () => {
  const receivedResult = DataSourcesSchema.parse(
    JSON.stringify({
      "in-memory": "mongodb://127.0.0.1:27018",
      "wired-tiger": "mongodb://127.0.0.1:27017",
    })
  );
  const expectedResult = {
    "in-memory": "mongodb://127.0.0.1:27018",
    "wired-tiger": "mongodb://127.0.0.1:27017",
  };

  expect(receivedResult).toStrictEqual(expectedResult);
});
