import { Router } from 'express';
import {db} from "../drizzle/db";
import {MatchTable} from "../drizzle/schema";
import {and, eq} from "drizzle-orm";
import { MatchDTO, MatchSchema } from "../drizzle/zodValidationSchema";


const router = Router({ mergeParams: true });


router.post('/', async (req, res) => {
    const validationResult = MatchSchema.safeParse(req.body);

    if(!validationResult.success) {
        return res.status(400).send({ errors: validationResult.error.errors });
    }

    const matchDto: MatchDTO = {
        ...validationResult.data
    };

    try {
        // Check if the match already exists
        const existingMatch = await db.select().from(MatchTable)
            .where(and(eq(MatchTable.userA, matchDto.userA), eq(MatchTable.userB, matchDto.userB)));

        if (existingMatch.length > 0) {
            return res.status(409).json({ error: 'Match already exists' });
        }

        // Insert new match if it doesn't exist
        const insertMatch = await db.insert(MatchTable).values({
            ...matchDto
        }).returning({
            userA: MatchTable.userA,
            userB: MatchTable.userB,
            date: MatchTable.matchDate,
        });

        res.status(201).json(insertMatch);
    } catch (error) {
        console.error('Error inserting match:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/', async (req, res) => {
    try {
        const AhasMatchedB = await db.select().from(MatchTable).
        where(and(eq(MatchTable.userA, req.body.userA), eq(MatchTable.userB, req.body.userB)));
        if (AhasMatchedB.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const BhasMatchedA = await db.select().from(MatchTable).
        where(and(eq(MatchTable.userA, req.body.userB), eq(MatchTable.userB, req.body.userA)));
        if (BhasMatchedA.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.status(200).json({ AhasMatchedB, BhasMatchedA });
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const match = await db.select().from(MatchTable).
        where(and(eq(MatchTable.userA, req.body.userA), eq(MatchTable.userB, req.body.userB)));
        if (match.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        const deletedMatch = await db.delete(MatchTable).
        where(and(eq(MatchTable.userA, req.body.userA), eq(MatchTable.userB, req.body.userB))).
        returning({
            userA: MatchTable.userA,
            userB: MatchTable.userB,
            date: MatchTable.matchDate,
        });
        res.status(200).json(deletedMatch);

    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/checkMatch', async (req, res) => {
    try {
        const userA = req.query.userA as string;
        const userB = req.query.userB as string;
        const AhasMatchedB = await db.select().from(MatchTable)
            .where(and(eq(MatchTable.userA, userA), eq(MatchTable.userB, userB)));
        const BhasMatchedA = await db.select().from(MatchTable)
            .where(and(eq(MatchTable.userA, userB), eq(MatchTable.userB, userA)));
        res.status(200).json({ AhasMatchedB, BhasMatchedA });
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/getMatchesOfAnUser', async (req, res) => {
    try {
        const user = req.query.user as string;
        const matches = await db.select().from(MatchTable)
            .where((eq(MatchTable.userA, user)));
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

export const MatchController = router;