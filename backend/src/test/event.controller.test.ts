import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { closeServer, DI, initializeServer } from "..";
import { loginUser, seedDB, setupDB, teardownDB } from "./helper";

describe("EventController", () => {
  beforeAll(async () => {
    await initializeServer();
  });

  afterAll(async () => {
    await closeServer();
  });

  it("returns 404 if event ID invalid", async () => {
    const { token } = await loginUser();
    const invalidEventID = "0db4911e-0ae7-4e10-8a11-5136a226b166";
    const response = await request(DI.server)
      .get(`/events/${invalidEventID}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Event not found" });
  });

  let eventID: string;

  it("returns 200 when getting correct test event via userId", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .get("/events")
      .set("Authorization", token)
      .query({ userId: user.id });
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].eventName).toBe("Test Event");
    expect(response.body[0].location).toBe("Berlin");

    eventID = response.body[0].id;
  });

  it("returns 200 when getting correct test event via eventId", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server)
      .get("/events/" + eventID)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body.event.eventName).toBe("Test Event");
    expect(response.body.event.location).toBe("Berlin");
  });

  it("returns 200 when updating an event", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .put("/events/" + eventID)
      .set("Authorization", token)
      .send({
        creator: user.id,
        eventName: "Test Event 3",
        location: "Berlin",
        startDate: new Date("2022-12-12T12:00:00.000Z"),
        endDate: new Date("2022-12-12T12:00:00.000Z"),
        description: "This is a test event",
        isPrivate: false,
      });
    expect(response.status).toBe(200);
    expect(response.body.eventName).toBe("Test Event 3");
  });

  it("returns 204 when deleting an event", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server)
      .delete("/events/" + eventID)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("returns 404 if no events found", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .get("/events")
      .set("Authorization", token)
      .query({ userId: user.id });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Events not found" });
  });

  it("returns 201 when creating an event", async () => {
    const { token, user } = await loginUser();
    const response = await request(DI.server)
      .post("/events")
      .set("Authorization", token)
      .send({
        creator: user.id,
        eventName: "Test Event 2",
        startDate: new Date("2022-12-12T12:00:00.000Z"),
        endDate: new Date("2022-12-12T12:00:00.000Z"),
        location: "Berlin",
        description: "This is a test event",
        isPrivate: false,
      });
    expect(response.status).toBe(201);
  });

  it("gets all public events", async () => {
    const { token } = await loginUser();
    const response = await request(DI.server).get("/events/public").set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body.events.length).toBe(1);
    expect(response.body.events[0].eventName).toBe("Test Event 2");
  });
});
