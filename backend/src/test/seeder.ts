import { Auth } from "../middleware/auth.middleware";
import { EventTable, UserTable, GroupsTable } from "../drizzle/schema";
import { testDB } from "./helper";



export const insertTestUser = async () => {
  const newUserData = {
    eMail: "test@ab.de",
    dateOfBirth: "1990-12-12",
    username: "testUser2",
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
  return newUser[0];
};

export const insertTestGroup = async (creatorId: string) => {
    const newGroupData = {
        creator: creatorId,
        name: "Test group",
        location: "Berlin",
    };
    const newGroup = await testDB
        .insert(GroupsTable)
        .values({
        ...newGroupData,
        })
        .returning({
        id: GroupsTable.id,
        creator: GroupsTable.creator,
        name: GroupsTable.name,
        });
    return newGroup[0];
    }
