import * as SQLite from "expo-sqlite";
import { type SQLiteDatabase } from "expo-sqlite";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { ContactCardContainer } from "./ContactCard";
import {
  dbContactCard,
  dbEmailAddress,
  dbPhoneNumber,
  dbURLLink,
} from "./schema";

export const DB_NAME = "sql_db";

export async function closeDB(db: SQLiteDatabase) {
  await db.closeAsync();
}

export async function deleteDB() {
  await SQLite.deleteDatabaseAsync(DB_NAME);
}

export async function saveCard(
  db: SQLiteDatabase,
  cardContainer: ContactCardContainer,
) {
  const cardUUID = await uuid();
  const { card } = cardContainer;
  return await Promise.all([
    db.runAsync(
      `INSERT OR REPLACE INTO contact_cards(
      id, name, label, color, company, position
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cardUUID,
        card.name,
        cardContainer.label,
        cardContainer.color,
        card.organization?.company!,
        card.organization?.position!,
      ],
    ),
    card.phoneNumbers.forEach(async (num: string) => {
      db.runAsync(
        `INSERT OR REPLACE INTO phone_numbers(
        id, contact_id, number
        ) VALUES (?, ?, ?)`,
        [await uuid(), cardUUID, num],
      );
    }),
    card.emailAddresses.forEach(async (email: string) => {
      db.runAsync(
        `INSERT OR REPLACE INTO email_addresses(
        id, contact_id, address
        ) VALUES (?, ?, ?)`,
        [await uuid(), cardUUID, email],
      );
    }),
    Object.entries(card.urlLinks).forEach(async ([platform, url]) => {
      db.runAsync(
        `INSERT OR REPLACE INTO url_links(
        id, contact_id, platform, url
        ) VALUES (?, ?, ?, ?)`,
        [await uuid(), cardUUID, platform, url],
      );
    }),
  ]);
}

export async function getCards(db: SQLiteDatabase) {
  const contactCards = await db.getAllAsync<dbContactCard>(
    `SELECT * FROM contact_cards`,
  );
  const phoneNumbers = await db.getAllAsync<dbPhoneNumber>(
    `SELECT * FROM phone_numbers`,
  );
  const emailAddresses = await db.getAllAsync<dbEmailAddress>(
    `SELECT * FROM email_addresses`,
  );
  const urlLinks = await db.getAllAsync<dbURLLink>(`SELECT * FROM url_links`);

  const containers: ContactCardContainer[] = contactCards.map((card) => ({
    uuid: card.id,
    label: card.label,
    color: card.color as ContactCardContainer["color"],
    card: {
      name: card.name,
      organization: {
        company: card.company || undefined,
        position: card.position || undefined,
      },
      emailAddresses: emailAddresses
        .filter(({ contact_id }) => contact_id === card.id)
        .map(({ address }) => address),
      phoneNumbers: phoneNumbers
        .filter(({ contact_id }) => contact_id === card.id)
        .map(({ number }) => number),
      urlLinks: Object.fromEntries(
        urlLinks
          .filter(({ contact_id }) => contact_id === card.id)
          .map(({ platform, url }) => [platform, url]),
      ),
    },
  }));
  return containers;
}

export async function deleteCard(db: SQLiteDatabase, id: string) {
  db.runAsync(`DELETE FROM contact_cards WHERE id = ?`, [id]).catch((error) => {
    console.error(error);
  });
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS contact_cards (
      id TEXT PRIMARY KEY NOT NULL,

      name TEXT NOT NULL,
      label TEXT NOT NULL,
      color TEXT NOT NULL,
      company TEXT,
      position TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS phone_numbers (
      id TEXT PRIMARY KEY NOT NULL,

      contact_id TEXT NOT NULL,

      number TEXT NOT NULL,

      FOREIGN KEY(contact_id)
        REFERENCES contact_cards(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_addresses (
      id TEXT PRIMARY KEY NOT NULL,

      contact_id TEXT NOT NULL,

      address TEXT NOT NULL,

      FOREIGN KEY(contact_id)
        REFERENCES contact_cards(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS url_links (
      id TEXT PRIMARY KEY NOT NULL,

      contact_id TEXT NOT NULL,

      platform TEXT NOT NULL,
      url TEXT NOT NULL,

      FOREIGN KEY(contact_id)
        REFERENCES contact_cards(id)
        ON DELETE CASCADE
    );
  `);
}
