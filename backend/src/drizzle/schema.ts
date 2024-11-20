import { pgTable, timestamp, uuid, varchar, customType, text, pgEnum, primaryKey, boolean, date, integer, bigint } from "drizzle-orm/pg-core";
import { string } from "zod";

export const UserTable = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  eMail: varchar("email", { length: 255 }).notNull().unique(),
  dateOfBirth: date("dateOfBirth").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  username: varchar("username", { length: 255 }).notNull(),
  bio: text("bio"),
  gender: varchar("gender", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  genrePreferences: varchar("genrePreferences", { length: 255 }).array(),
  image: varchar("image", { length: 255 }),
  topTrackID: varchar("topTrackID", { length: 255 }),
});

export const SpotifyAuthInfoTable = pgTable("SpotifyAuthInfo", {
  access_token: varchar("access_token", { length: 255 }).notNull(),
  token_type: varchar("token_type", { length: 255 }).notNull(),
  scope: varchar("scope", { length: 255 }).notNull(),
  expires_in: bigint("expires_in", { mode: "number" }).notNull(),
  expires_timestamp: bigint("expires_timestamp", { mode: "number" }).notNull(),
  refresh_token: varchar("refresh_token", { length: 255 }).notNull(),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
});

export const GroupsTable = pgTable("Group", {
  id: uuid("id").primaryKey().defaultRandom(),
  creator: uuid("creator").references(() => UserTable.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const GroupsMemberTable = pgTable(
  "GroupsMember",
  {
    userId: uuid("userId")
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
    groupId: uuid("groupId")
      .references(() => GroupsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.groupId] }),
    };
  }
);

export const eventEnum = pgEnum("EventType", ["Concert", "Party", "Festival"]);

export const EventTable = pgTable("Event", {
  id: uuid("id").primaryKey().defaultRandom(),
  creator: uuid("creator")
    .references(() => UserTable.id)
    .notNull(),
  eventName: varchar("eventName", { length: 255 }).notNull(),
  eventType: eventEnum("eventType").notNull().default("Party").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  location: varchar("location", { length: 255 }),
  description: varchar("description", { length: 255 }),
  isPrivate: boolean("isPrivate").default(true),
});

export const ParticipantsTable = pgTable(
  "EventParticipants",
  {
    userId: uuid("userId")
      .references(() => UserTable.id)
      .notNull(),
    eventId: uuid("eventId")
      .references(() => EventTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.eventId] }),
    };
  }
);

export const SongTable = pgTable("Song", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
});

export const FavSongsTable = pgTable(
  "FavoriteSongs",
  {
    userId: uuid("userId")
      .references(() => UserTable.id)
      .notNull(),
    songId: uuid("songId")
      .references(() => SongTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.songId] }),
    };
  }
);

export const MatchTable = pgTable(
  "Match",
  {
    userA: uuid("userA")
      .references(() => UserTable.id)
      .notNull(),
    userB: uuid("userB")
      .references(() => UserTable.id)
      .notNull(),
    result: boolean("result"),
    matchDate: timestamp("matchDate").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userA, table.userB] }),
    };
  }
);

export const MessageTable = pgTable("Message", {
  id: uuid("id").primaryKey().defaultRandom(),
  composed_id: varchar("composed_id", { length: 255 }),
  text: text("text").notNull(),
  sender_id: uuid("sender_id")
    .notNull()
    .references(() => UserTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
