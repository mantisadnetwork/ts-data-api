import axios from "axios";
import { EJSON } from "bson";

import { envs } from "../src/envs";
import { token } from "./helpers";

const requester = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/ejson",
  },
  transformRequest: (data) => EJSON.stringify(data),
  transformResponse: (data) => EJSON.parse(data),
});

const main = async () => {
  const baseUrl = `http://${envs.SERVER_ADDRESS}:${envs.SERVER_PORT}`;
  const dataSource = "local";
  const database = "test";
  const collection = "users";

  // Insert One
  await requester
    .post(`${baseUrl}/defaults/insertOne`, {
      dataSource,
      database,
      collection,
      document: { name: "john", languages: ["javascript"] },
    })
    .then(({ data }) =>
      console.log(`\nInsert One Result: ${JSON.stringify(data)}`)
    );

  // Insert Many
  await requester
    .post(`${baseUrl}/defaults/insertMany`, {
      dataSource,
      database,
      collection,
      documents: [
        { name: "jen", languages: ["python"] },
        { name: "june", languages: ["ruby"] },
      ],
      options: { ordered: false },
    })
    .then(({ data }) =>
      console.log(`\nInsert Many Result: ${JSON.stringify(data)}`)
    );

  // Update One
  await requester
    .post(`${baseUrl}/defaults/updateOne`, {
      dataSource,
      database,
      collection,
      filter: { name: "john" },
      update: { $push: { languages: "typescript" } },
    })
    .then(({ data }) =>
      console.log(`\nUpdate One Result: ${JSON.stringify(data)}`)
    );

  // Update Many
  await requester
    .post(`${baseUrl}/defaults/updateMany`, {
      dataSource,
      database,
      collection,
      filter: { languages: { $in: ["python", "ruby"] } },
      update: { $push: { languages: "basic" } },
    })
    .then(({ data }) =>
      console.log(`\nUpdate Many Result: ${JSON.stringify(data)}`)
    );

  // Find One
  await requester
    .post(`${baseUrl}/defaults/findOne`, {
      dataSource,
      database,
      collection,
      filter: { languages: "typescript" },
    })
    .then(({ data }) =>
      console.log(`\nFind One Result: ${JSON.stringify(data)}`)
    );

  // Find
  await requester
    .post(`${baseUrl}/defaults/find`, {
      dataSource,
      database,
      collection,
      filter: { languages: "basic" },
    })
    .then(({ data }) => console.log(`\nFind Result: ${JSON.stringify(data)}`));
};

main().catch(console.error);
