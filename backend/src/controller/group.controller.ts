import { Router } from 'express';
import {db} from "../drizzle/db";
import {GroupsTable, GroupsMemberTable, UserTable} from "../drizzle/schema";
import {and, eq, isNull} from "drizzle-orm";
import { GroupDTO, GroupSchema } from "../drizzle/zodValidationSchema";


const router = Router({ mergeParams: true });

router.get('/:groupId', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable).where((eq(GroupsTable.id, req.params.groupId)));
        if (group.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable);
        if (group.length === 0) {
            return res.status(404).json({ error: 'Groups not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.post('/', async (req, res) => {
    const validationResult = GroupSchema.safeParse(req.body);

    if(!validationResult.success) {
        return res.status(400).send({ errors: validationResult.error.errors });
    }

    const groupDto: GroupDTO = {
        ...validationResult.data
    };

    try {
        const insertedGroup = await db.insert(GroupsTable).values({
            ...groupDto
        }).returning({
            id: GroupsTable.id,
            creator: GroupsTable.creator,
            createdAt: GroupsTable.createdAt,
            name: GroupsTable.name
        });

        res.status(201).json(insertedGroup);

    } catch (error) {
        console.error('Error inserting group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.delete('/:groupId', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable).where((eq(GroupsTable.id, req.params.groupId)));
        if (group.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const deleteGroup = await db.delete(GroupsTable).where(eq(GroupsTable.id, req.params.groupId)).returning({
            id: GroupsTable.id,
            creator: GroupsTable.creator,
            createdAt: GroupsTable.createdAt,
            name: GroupsTable.name
        });
        res.status(204).json(deleteGroup);
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.put('/:groupId', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable).where((eq(GroupsTable.id, req.params.groupId)));
        if (group.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const updatedGroup = await db.update(GroupsTable).set({
            creator: req.body.creator,
            name: req.body.name,
        }).where(eq(GroupsTable.id, req.params.groupId)).returning(
            {
                id: GroupsTable.id,
                creator: GroupsTable.creator,
                createdAt: GroupsTable.createdAt,
                name: GroupsTable.name
            }
        );
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/findGroup/:userId', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable).where((eq(GroupsTable.creator, req.params.userId)));
        if (group.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.post('/inviteUsers', async (req, res) => {
    // if Groups is already a member abort
   const groupsMemeber = await db.select().from(GroupsMemberTable).where(and(eq(GroupsMemberTable.userId, req.body.userId), eq(GroupsMemberTable.groupId, req.body.groupId)));
        if (groupsMemeber.length !== 0) {
            return res.status(400).json({error: 'User is already a member of the group'});
        }

    try {
        const groupsMemeber = await db.insert(GroupsMemberTable).values({
            userId: req.body.userId,
            groupId: req.body.groupId
        }).returning({
            userId: GroupsMemberTable.userId,
            groupId: GroupsMemberTable.groupId
        });
        res.status(201).json(groupsMemeber);
        }
       catch (error) {
        console.error('Error inserting group member:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/getGroupAndCheckIfUserInGroup/:ownUserId/:userId', async (req, res) => {
    try {
        const ownUser = await db.select().from(UserTable).where(eq(UserTable.id, req.params.ownUserId));
        if (ownUser.length === 0) {
            return res.status(404).json({ error: 'Owner of Group not found' });
        }
        const otherUser = await db.select().from(UserTable).where(eq(UserTable.id, req.params.userId));
        if (otherUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const group = await db.select({id: GroupsTable.id, name: GroupsTable.name, creator: GroupsTable.creator })
            .from(GroupsTable)
            .leftJoin(GroupsMemberTable, and(eq(GroupsTable.id, GroupsMemberTable.groupId), eq(GroupsMemberTable.userId, req.params.userId)))
            .where(and(eq(GroupsTable.creator, req.params.ownUserId), isNull(GroupsMemberTable.userId)));

        if (group.length === 0) {
            return res.status(200).json({ error: 'Group not found' });
        }

        return res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
} );

router.get('/getGroup/:userId', async (req, res) => {
    try {
        const groups = await db.select().from(GroupsMemberTable).innerJoin(GroupsTable, eq(GroupsTable.id, GroupsMemberTable.groupId)).innerJoin(UserTable, eq(UserTable.id, GroupsMemberTable.userId))
            .where((eq(GroupsMemberTable.userId, req.params.userId)));
        if (groups.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
} );

router.get('/getUserFromGroup/:groupId', async (req, res) => {
    try {
        const groups = await db.select().from(GroupsMemberTable).innerJoin(GroupsTable, eq(GroupsTable.id, GroupsMemberTable.groupId)).innerJoin(UserTable, eq(UserTable.id, GroupsMemberTable.userId))
            .where((eq(GroupsMemberTable.groupId, req.params.groupId)));
        if (groups.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
} );

router.put('/removeUserFromGroup/:groupId/:userId', async (req, res) => {
    try {
        const group = await db.select().from(GroupsTable).where((eq(GroupsTable.id, req.params.groupId)));
        if (group.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const user = await db.select().from(UserTable).where(eq(UserTable.id, req.params.userId));
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userInGroup = await db.select().from(GroupsMemberTable).where(and(eq(GroupsMemberTable.userId, req.params.userId), eq(GroupsMemberTable.groupId, req.params.groupId)));
        if (userInGroup.length === 0) {
            return res.status(404).json({ error: 'User is not in the group' });
        }
        const removedUser = await db.delete(GroupsMemberTable).where(and(eq(GroupsMemberTable.userId, req.params.userId), eq(GroupsMemberTable.groupId, req.params.groupId))).returning({
            userId: GroupsMemberTable.userId,
            groupId: GroupsMemberTable.groupId
        });
        res.status(204).json(removedUser);
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

export const GroupController = router;