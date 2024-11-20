import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { closeServer, DI, initializeServer } from "..";
import { loginUser, seedDB, setupDB } from "./helper";
import { insertTestGroup } from "./seeder";

describe("GroupController", () => {
  let testGroup: {
    id: string;
    creator: string | null;
    name: string;
  };

  beforeAll(async () => {
    await initializeServer();
    await setupDB();
    await seedDB();
    const { user } = await loginUser();
    testGroup = await insertTestGroup(user.id);
  });

  afterAll(async () => {
    await closeServer();
  });

  it("returns 404 if group ID invalid", async () => {
    const { token } = await loginUser();
    const invalidGroupID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const response = await request(DI.server)
      .get(`/groups/${invalidGroupID}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Group not found" });
  });

  it("returns 200 when getting correct test group via groupId", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server)
      .get("/groups/" + testGroup.id)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("Test group");
  });

  it("returns 200 when getting all groups", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).get("/groups").set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Test group");
  });

  it("returns 200 when updating an group", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .put("/groups/" + testGroup.id)
      .set("Authorization", token)
      .send({
        creator: user.id,
        name: "Test Group Renamed",
      });
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("Test Group Renamed");
  });

  it("returns 404 when updating a non-existing group", async () => {
    const { token, user } = await loginUser();
    const nonExistingGroupID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const updatedGroup = {
      creator: user.id,
      name: "renamedGroup",
    };
    const response = await request(DI.server)
    .put("/groups/" + nonExistingGroupID)
    .send(updatedGroup)
    .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Group not found" });
});

it("returns 201 when inviting a user to a group", async () => {
  const { token, user } = await loginUser();
  const response = await request(DI.server)
    .post("/groups/inviteUsers")
    .set("Authorization", token)
    .send({
      userId: user.id,
      groupId: testGroup.id,
    });
  expect(response.status).toBe(201);
});

it("returns 204 when deleting a group", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server)
      .delete("/groups/" + testGroup.id)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("returns 404 if no groups found", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .get("/groups")
      .set("Authorization", token)
      .query({ userId: user.id });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Groups not found" });
  });

  it("returns 400 when creating a group with invalid data", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).post("/groups").set("Authorization", token).send({
      wrongField: "hello",
      name: "Test Group 2",
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 when creating a group with missing data", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).post("/groups").set("Authorization", token);
    expect(response.status).toBe(400);
  });

  it("returns 201 when creating a group", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server).post("/groups").set("Authorization", token).send({
      creator: user.id,
      name: "Test Group 2",
    });
    expect(response.status).toBe(201);
  });

  it("returns 404 when getting a group for a non-existing userId", async () => {
    const { token } = await loginUser();
    const nonExistingUserID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const response = await request(DI.server)
      .get("/groups/findGroup/" + nonExistingUserID)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Group not found" });
  });

  it("returns 200 when getting a group for a userId", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .get("/groups/findGroup/" + user.id)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("Test Group 2");
  });


});
