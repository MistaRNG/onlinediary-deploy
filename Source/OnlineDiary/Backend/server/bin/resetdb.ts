import dotenv from "dotenv";
import fs from "fs";
import { Client, ClientConfig } from "pg";
import dbParams from "../lib/db";

dotenv.config();

const db = new Client(dbParams as ClientConfig);

const runSchemaFiles = async () => {
  console.log(`-> Loading Schema Files ...`);
  const schemaFilenames = fs.readdirSync("./database/schema");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./database/schema/${fn}`, "utf8");
    console.log(`\t-> Running ${fn}`);
    await db.query(sql);
  }
};

const runResetDB = async () => {
  try {
    if (dbParams.host) {
      console.log(`-> Connecting to PG on ${dbParams.host} as ${dbParams.user}...`);
    }
    if (dbParams.connectionString) {
      console.log(`-> Connecting to PG with ${dbParams.connectionString}...`);
    }
    await db.connect();
    await runSchemaFiles();
    db.end();
  } catch (err) {
    console.error(`Failed due to error: ${err}`);
    db.end();
  }
};

runResetDB();
