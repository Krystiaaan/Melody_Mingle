import { drizzle } from "drizzle-orm/postgres-js";
import { closeServer } from "..";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Auth } from "../middleware/auth.middleware";
import { EventTable, UserTable } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TEST_DB_URL } from "./drizzle.test.config";

const client = postgres(TEST_DB_URL);
export const testDB = drizzle(client, { schema });

export const setupDB = async () => {
  try {
    const migrationClient = postgres(TEST_DB_URL, { max: 1 });
    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./src/test/migrations",
    });
    console.log("DB setup complete");
    await migrationClient.end();
  } catch (error) {
    console.error("Error setting up DB:", error);
  }
};


export const teardownDB = async () => {
  await closeServer();
};

export const seedDB = async () => {
  const newUserData = {
    eMail: "test@mm.de",
    dateOfBirth: "1990-12-12",
    username: "testUser1",
    passwordHash: await Auth.hashPassword("111111"),
  };
  const newUser = await testDB
    .insert(UserTable)
    .values({
      ...newUserData,
    })
    .returning({
      id: UserTable.id,
      eMail: UserTable.eMail,
      dateOfBirth: UserTable.dateOfBirth,
      username: UserTable.username,
      passwordHash: UserTable.passwordHash,
    });

    const newEventData = {
      creator: newUser[0].id,
      eventName: "Test Event",
      startDate: new Date("2022-12-12T12:00:00.000Z"),
      endDate: new Date("2022-12-12T12:00:00.000Z"),
      location: "Berlin",
      description: "This is a test event",
      isPrivate: false,
    };

    await testDB
      .insert(EventTable)
      .values({
        ...newEventData,
      })
      .returning({
        id: schema.EventTable.id,
        creator: schema.EventTable.creator,
        eventName: schema.EventTable.eventName,
        eventType: schema.EventTable.eventType,
        startDate: schema.EventTable.startDate,
        endDate: schema.EventTable.endDate,
        location: schema.EventTable.location,
        description: schema.EventTable.description,
      });
};

export const loginUser = async () => {
  const user = await testDB.query.UserTable.findFirst({
    where: eq(UserTable.eMail, "test@mm.de"),
  });
  return {
    token: Auth.generateToken({
      id: user!.id,
      eMail: user!.eMail,
      username: user!.username,
    }),
    user: user!,
  };
};
