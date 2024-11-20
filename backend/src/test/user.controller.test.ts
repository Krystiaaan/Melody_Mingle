import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { closeServer, DI, initializeServer } from "..";
import { loginUser, testDB } from "./helper";
import { insertTestUser } from "./seeder";

describe("UserController", () => {
  let testUser: {
    id: string;
    eMail: string;
    dateOfBirth: string;
    username: string;
    passwordHash: string;
  };

  beforeAll(async () => {
    initializeServer();
    testUser = await insertTestUser();
  });

  afterAll(async () => {
    await closeServer();
  });

  it("returns 404 if user ID invalid", async () => {
    const { token } = await loginUser();
    const invalidUserID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const response = await request(DI.server).get(`/users/${invalidUserID}`).set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("returns 200 when getting correct test user via userId", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server)
      .get(`/users/${testUser.id}`)
      .set("Authorization", token)
      .query({ userId: testUser.id });
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toBe("testUser2");
    expect(response.body[0].eMail).toBe("test@ab.de");
  });

  it("returns 200 when getting all users", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).get("/users").set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("returns 404 when updating a non-existing user", async () => { 
    const { token } = await loginUser();
    const nonExistingUserID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const updatedUser = {
      firstname: "Herbert",
      username: "renamedUser",
    };
    const response = await request(DI.server)
      .put(`/users/${nonExistingUserID}`)
      .send(updatedUser)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("returns 200 when updating a user", async () => {
    const { token } = await loginUser();
    const updatedUser = {
      firstname: "Herbert",
      username: "renamedUser",
    };
    const response = await request(DI.server)
      .put(`/users/${testUser.id}`)
      .send(updatedUser)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body[0].username).toBe("renamedUser");
    expect(response.body[0].firstname).toBe("Herbert");
  });


  it("returns 404 when trying to delete a non-existing user", async () => {
    const { token } = await loginUser();
    const nonExistingUserID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const response = await request(DI.server).delete(`/users/${nonExistingUserID}`).set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });


  it("returns 204 when deleting a user", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).delete(`/users/${testUser.id}`).set("Authorization", token);
    expect(response.status).toBe(204);
  });
});
