// import { getDB } from "./db";

// export async function createTable() {
//   const db = await getDB();
//   await db.execAsync(`
//     PRAGMA foreign_keys = ON;

//     CREATE TABLE IF NOT EXISTS contact_cards (
//       id TEXT PRIMARY KEY NOT NULL,

//       name TEXT NOT NULL,
//       label TEXT NOT NULL,
//       company TEXT,
//       position TEXT,

//       created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//       updated_at TEXT DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS phone_numbers (
//       id TEXT PRIMARY KEY NOT NULL,

//       contact_id TEXT NOT NULL,

//       number TEXT NOT NULL,

//       FOREIGN KEY(contact_id)
//         REFERENCES contact_cards(id)
//         ON DELETE CASCADE
//     );

//     CREATE TABLE IF NOT EXISTS email_addresses (
//       id TEXT PRIMARY KEY NOT NULL,

//       contact_id TEXT NOT NULL,

//       address TEXT NOT NULL,

//       FOREIGN KEY(contact_id)
//         REFERENCES contact_cards(id)
//         ON DELETE CASCADE
//     );

//     CREATE TABLE IF NOT EXISTS url_links (
//       id TEXT PRIMARY KEY NOT NULL,

//       contact_id TEXT NOT NULL,

//       platform TEXT NOT NULL,
//       url TEXT NOT NULL,

//       FOREIGN KEY(contact_id)
//         REFERENCES contact_cards(id)
//         ON DELETE CASCADE
//     );
//   `);
// }

export type dbContactCard = {
  id: string;
  name: string;
  label: string;
  color: string;
  company?: string;
  position?: string;
  updated_at: string;
  created_at: string;
};

export type dbPhoneNumber = {
  id: string;
  contact_id: string;
  number: string;
};

export type dbEmailAddress = {
  id: string;
  contact_id: string;
  address: string;
};
export type dbURLLink = {
  id: string;
  contact_id: string;
  platform: string;
  url: string;
};
