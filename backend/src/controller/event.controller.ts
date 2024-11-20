import { Router } from "express";
import { db } from "../drizzle/db";
import { EventTable, ParticipantsTable } from "../drizzle/schema";
import { eq, and, inArray} from "drizzle-orm";
import { EventDTO, EventSchema } from "../drizzle/zodValidationSchema";

const router = Router({ mergeParams: true });

router.get('/public', async (req, res) => {
  try {
    // Fetch all public events
    const events = await db.select().from(EventTable).where(eq(EventTable.isPrivate, false));
    if (events.length === 0) {
      return res.status(404).json({ error: 'No public events found' });
    }

    // Get all event IDs from the public events
    const eventIds = events.map(event => event.id);

    // Fetch participants for these events
    const participants = await db
      .select()
      .from(ParticipantsTable)
      .where(inArray(ParticipantsTable.eventId, eventIds));

    // Return events and participants in separate arrays
    res.status(200).json({ 
      events: events, 
      participants: participants 
    }); 
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
});

router.get("/:eventId", async (req, res) => {
  try {
    const event = await db
      .select()
      .from(EventTable)
      .where(eq(EventTable.id, req.params.eventId));
    
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const participants = await db
      .select()
      .from(ParticipantsTable)
      .where(eq(ParticipantsTable.eventId, req.params.eventId));

    res.status(200).json({ 
      event: event[0], 
      participants: participants 
    }); 
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Retrieve events created by the user
    const createdEvents = await db.select().from(EventTable).where(eq(EventTable.creator, userId));
    
    // Retrieve events the user is participating in
    const participantEvents = await db.select()
      .from(ParticipantsTable)
      .where(eq(ParticipantsTable.userId, userId));

    const eventIds = participantEvents.map(participant => participant.eventId);

    // Explicitly type participatedEvents as an array of events
    let participatedEvents: typeof createdEvents = [];

    if (eventIds.length > 0) {
      // Fetch events where user is a participant if there are any event IDs
      participatedEvents = await db.select().from(EventTable).where(inArray(EventTable.id, eventIds));
    }

    // Combine both arrays and remove duplicates
    const allEvents = [...createdEvents, ...participatedEvents.filter(event => !createdEvents.some(createdEvent => createdEvent.id === event.id))];

    if (allEvents.length === 0) {
      return res.status(404).json({ error: 'Events not found' });
    }
    
    res.status(200).json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { creator, eventName, eventType, startDate, endDate, location, description, isPrivate } = req.body;
    
    const newEvent = {
      creator,
      eventName,
      eventType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      description,
      isPrivate,
    };

    const insertedEvent = await db.insert(EventTable).values(newEvent).returning({
      id: EventTable.id,
      creator: EventTable.creator,
      eventName: EventTable.eventName,
      eventType: EventTable.eventType,
      startDate: EventTable.startDate,
      endDate: EventTable.endDate,
      location: EventTable.location,
      description: EventTable.description,
      isPrivate: EventTable.isPrivate,
    });

    res.status(201).json(insertedEvent[0]); // Return single event object
  } catch (error) {
    console.error("Error inserting event:", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.delete('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // First, delete participants associated with the event
    await db.delete(ParticipantsTable).where(eq(ParticipantsTable.eventId, eventId));

    // Then, delete the event
    const deletedEvent = await db.delete(EventTable).where(eq(EventTable.id, eventId)).returning({
      id: EventTable.id,
      creator: EventTable.creator,
      eventName: EventTable.eventName,
      eventType: EventTable.eventType,
      startDate: EventTable.startDate,
      endDate: EventTable.endDate,
      location: EventTable.location,
      description: EventTable.description,
      isPrivate: EventTable.isPrivate,
    });

    if (deletedEvent.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).json(deletedEvent[0]);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
});

router.put('/:eventId', async (req, res) => {
  try {
    const event = await db.select().from(EventTable).where(eq(EventTable.id, req.params.eventId));
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updatedEvent = {
      creator: req.body.creator,
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      description: req.body.description,
      isPrivate: req.body.isPrivate,
    };

    const updateEvent = await db.update(EventTable).set(updatedEvent).where(eq(EventTable.id, req.params.eventId)).returning({
      id: EventTable.id,
      creator: EventTable.creator,
      eventName: EventTable.eventName,
      eventType: EventTable.eventType,
      startDate: EventTable.startDate,
      endDate: EventTable.endDate,
      location: EventTable.location,
      description: EventTable.description,
      isPrivate: EventTable.isPrivate,
    });
    
    res.status(200).json(updateEvent[0]); // Return single event object
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
});

router.post('/join/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    // Check if the event exists
    const event = await db.select().from(EventTable).where(eq(EventTable.id, eventId));
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the event is private and if the user is invited
    if (event[0].isPrivate) {
      const participant = await db.select().from(ParticipantsTable).where(
        and(
          eq(ParticipantsTable.eventId, eventId),
          eq(ParticipantsTable.userId, userId)
        )
      );
      if (participant.length === 0) {
        return res.status(403).json({ error: "You need an invitation to join this private event" });
      }
    }

    // Check if the user is already a participant
    const existingParticipant = await db.select().from(ParticipantsTable).where(
      and(
        eq(ParticipantsTable.eventId, eventId),
        eq(ParticipantsTable.userId, userId)
      )
    );
    if (existingParticipant.length > 0) {
      return res.status(200).json({ message: "Already joined the event" });
    }

    // Add the user to the event
    await db.insert(ParticipantsTable).values({
      eventId,
      userId,
    });

    res.status(200).json({ message: "Successfully joined the event" });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/invite/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, invitedUserId } = req.body;

    // Check if the event exists
    const event = await db.select().from(EventTable).where(eq(EventTable.id, eventId));
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Check if the user is the creator of the event
    if (event[0].creator !== userId) {
      return res.status(403).json({ error: "You are not the creator of the event" });
    }
    // Check if the user is already a participant
    const existingParticipant = await db.select().from(ParticipantsTable).where(
      and(
        eq(ParticipantsTable.eventId, eventId),
        eq(ParticipantsTable.userId, invitedUserId)
      )
    );
    if(existingParticipant.length > 0) {
      return res.status(200).json({ message: "User already invited to the event" });
    }
    // Insert the invited user into the ParticipantsTable
    await db.insert(ParticipantsTable).values({
      eventId,
      userId: invitedUserId,
    });

    res.status(200).json({ message: "User successfully invited to the event" });
  } catch (error) {
    console.error("Error inviting user to event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post('/leave/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    // Check if the event exists
    const event = await db.select().from(EventTable).where(eq(EventTable.id, eventId));
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user is a participant in the event
    const participant = await db.select().from(ParticipantsTable).where(
      and(
        eq(ParticipantsTable.eventId, eventId),
        eq(ParticipantsTable.userId, userId)
      )
    );

    if (participant.length === 0) {
      return res.status(404).json({ error: "You are not a participant of this event" });
    }

    // Remove the user from the ParticipantsTable
    await db.delete(ParticipantsTable).where(
      and(
        eq(ParticipantsTable.eventId, eventId),
        eq(ParticipantsTable.userId, userId)
      )
    );

    res.status(200).json({ message: "You have successfully left the event" });
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const EventController = router;
