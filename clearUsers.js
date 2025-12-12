import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function clearUsers() {
  /*
  This function deletes all rows in the 'users' table,
  but keeps the table structure intact.
  */

  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`DELETE FROM users;`);

  await db.close();
  console.log("all users deleted (table retained)");
}

clearUsers();
