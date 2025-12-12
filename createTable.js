import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function createTable() {
  /*
Challenge:

1. Debug this code so a new table 'users' is created.
   Check you have been successful with logTable.js.

*/

  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(
    `
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            recipe_id TEXT NOT NULL,
            recipe_name TEXT NOT NULL,
            recipe_image TEXT,
            recipe_category TEXT,
            recipe_area TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
            );
      `
  );

  await db.close();
  console.log("table created");
}

createTable();
