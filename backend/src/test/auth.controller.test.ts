import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { closeServer, DI, initializeServer } from "..";
import { loginUser, testDB } from "./helper";
import { insertTestUser } from "./seeder";
import { pascal } from "postgres";
import e from "express";

describe("AuthController", () => {
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

  it("returns 201 when registering a new user", async () => {
    const response = await request(DI.server).post("/auth/register").send({
      eMail: "test@abc.de",
      dateOfBirth: "1990-12-12",
      username: "testUser3",
      password: "111111",
    });
    expect(response.status).toBe(201);
    expect(response.body[0]).toHaveProperty("id");
  });

  it("returns 400 when registering with missing credentials", async () => {
    const response = await request(DI.server).post("/auth/register");
    expect(response.status).toBe(400);
  });

  it("returns 400 when registering with an already existing eMail", async () => {
    const response = await request(DI.server).post("/auth/register").send({
      eMail: "test@abc.de",
      dateOfBirth: "1990-12-12",
      username: "testUser45",
      password: "111111",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain("User with this email already exists");
  });

  it("returns 400 when registering with an already existing username", async () => {
    const response = await request(DI.server).post("/auth/register").send({
      eMail: "testtttt@abdc.de",
      dateOfBirth: "1990-12-12",
      username: "testUser3",
      password: "111111",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain("User with this username already exists");
  });

  it("returns 400 when logging in with missing credentials", async () => {
    const response = await request(DI.server).post("/auth/login");
    expect(response.status).toBe(400);
  });

  it("returns 401 when logging in with incorrect credentials", async () => {
    const response = await request(DI.server).post("/auth/login").send({
      eMail: testUser.eMail,
      password: "wrongPassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.errors).toContain("Incorrect password");
  });

  it("returns 200 and access token when logging in with correct credentials", async () => {
    const response = await request(DI.server).post("/auth/login").send({
      eMail: testUser.eMail,
      password: "111111",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});
