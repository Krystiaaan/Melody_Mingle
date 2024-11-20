import { Router } from "express";
import { db } from "../drizzle/db";
import {and, eq, asc } from "drizzle-orm";
import {MessageTable, UserTable} from "../drizzle/schema";

const router = Router({ mergeParams: true });

router.post("/message", async (req, res) => {
    try {
        let composed_id = [req.body.sender_id, req.body.receiver_id].sort().join();
        const newMessage = await db
            .insert(MessageTable)
            .values({
                composed_id: composed_id,
                text: req.body.text,
                sender_id: req.body.sender_id,
            })
            .returning({
                id: MessageTable.id,
                chat_id: MessageTable.composed_id,
                sender_id: MessageTable.sender_id,
                text: MessageTable.text,
                createdAt: MessageTable.created_at
            });
        return res.status(201).send(newMessage);
    } catch (error) {
        console.error("Error inserting message:", error);
        res.status(503).json({ error: "Service Unavailable" });
    }
});

router.get("/message/:sender_id/:receiver_id", async (req, res) => {
    try {
        let composed_id = [req.params.sender_id, req.params.receiver_id].sort().join();
        const messages = await db.select().from(MessageTable).innerJoin(UserTable, eq(MessageTable.sender_id, UserTable.id)).
        where(eq(MessageTable.composed_id, composed_id)).orderBy(asc(MessageTable.created_at));
        return res.status(200).send(messages);
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(503).json({ error: "Service Unavailable" });
    }
});


router.post('/groupMessage', async (req, res) => {
    try {
        const newMessage = await db
            .insert(MessageTable)
            .values({
                composed_id: req.body.composed_id,
                text: req.body.text,
                sender_id: req.body.sender_id,
            })
            .returning({
                id: MessageTable.id,
                chat_id: MessageTable.composed_id,
                sender_id: MessageTable.sender_id,
                text: MessageTable.text,
                createdAt: MessageTable.created_at
            });
        return res.status(201).send(newMessage);
    } catch (error) {
        console.error("Error inserting message:", error);
        res.status(503).json({ error: "Service Unavailable" });
    }
} );

router.get("/groupMessage/:sender_id/:group_id", async (req, res) => {
    try {
        const GroupId = req.params.group_id;
        const messages = await db.select().from(MessageTable).innerJoin(UserTable, eq(MessageTable.sender_id, UserTable.id)).
        where(eq(MessageTable.composed_id, GroupId)).orderBy(asc(MessageTable.created_at));
        return res.status(200).send(messages);
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(503).json({ error: "Service Unavailable" });
    }
});

export const ChatController = router;