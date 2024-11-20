import { Router } from "express";
import { db } from "../drizzle/db";
import { UserTable, SpotifyAuthInfoTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router({ mergeParams: true });

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userAndSpotifyAuthInfo = await db.select().from(UserTable).innerJoin(SpotifyAuthInfoTable, eq(UserTable.id, SpotifyAuthInfoTable.userId)).where(eq(UserTable.id, userId)).execute();

    // Merge the the user info and Spotify Auth info into one object
    const userWithSpotifyAuthInfo = userAndSpotifyAuthInfo.map((content) => {
      const { User, SpotifyAuthInfo } = content;
      return {
        ...User,
        SpotifyAuthInfo: SpotifyAuthInfo,
      };
    });
    if (userWithSpotifyAuthInfo.length === 0) {
      const user = await db.select().from(UserTable).where(eq(UserTable.id, req.params.userId));
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    }
    return res.status(200).json(userWithSpotifyAuthInfo);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Get users with their Spotify auth info from db
    const userAndSpotifyAuthInfo = await db.select().from(UserTable).innerJoin(SpotifyAuthInfoTable, eq(UserTable.id, SpotifyAuthInfoTable.userId)).execute();

    // Merge user info and Spotify auth info into one object
    const userWithSpotifyAuthInfo = userAndSpotifyAuthInfo.map((content) => {
      const { User, SpotifyAuthInfo } = content;
      return {
        ...User,
        SpotifyAuthInfo: SpotifyAuthInfo,
      };
    });

    // Get users without Spotify auth info from db
    const allUsers = await db.select().from(UserTable).execute();

    // Create a map to merge the lists and remove duplicates
    const usersMap = new Map();

    // Add users without Spotify auth info to the map
    allUsers.forEach((user) => {
      usersMap.set(user.id, { ...user, SpotifyAuthInfo: null });
    });

    // Add users with Spotify auth info to the map (will overwrite duplicates)
    userWithSpotifyAuthInfo.forEach((userWithAuth) => {
      usersMap.set(userWithAuth.id, userWithAuth);
    });

    // Convert the map to an array
    const mergedUsers = Array.from(usersMap.values());

    // Check if the merged list is empty
    if (mergedUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the merged list
    return res.status(200).json(mergedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

});

router.delete("/:userId", async (req, res) => {
  try {
    const user = await db.select().from(UserTable).where(eq(UserTable.id, req.params.userId));
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = await db.delete(UserTable).where(eq(UserTable.id, req.params.userId)).returning({
      id: UserTable.id,
      firstname: UserTable.firstname,
      lastname: UserTable.lastname,
      eMail: UserTable.eMail,
      dateOfBirth: UserTable.dateOfBirth,
      created_at: UserTable.created_at,
      username: UserTable.username,
      passwordHash: UserTable.passwordHash,
    });
    res.status(204).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await db.select().from(UserTable).where(eq(UserTable.id, req.params.userId));
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateUser = await db
      .update(UserTable)
      .set({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        city: req.body.city,
        state: req.body.state,
        eMail: req.body.eMail,
        gender: req.body.gender,
        username: req.body.username,
        bio: req.body.bio,
        passwordHash: req.body.passwordHash,
        genrePreferences: req.body.genrePreferences,
        topTrackID: req.body.topTrackID,
      })
      .where(eq(UserTable.id, req.params.userId))
      .returning({
        id: UserTable.id,
        firstname: UserTable.firstname,
        lastname: UserTable.lastname,
        city: UserTable.city,
        state: UserTable.state,
        eMail: UserTable.eMail,
        gender: UserTable.gender,
        dateOfBirth: UserTable.dateOfBirth,
        created_at: UserTable.created_at,
        username: UserTable.username,
        bio: UserTable.bio,
        passwordHash: UserTable.passwordHash,
        genrePreferences: UserTable.genrePreferences,
        topTrackID: UserTable.topTrackID,
      });
    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(503).json({ error: `Service Unavailable: ${error} ` });
  }
});

//
// profile pic handling
//
const PICTURE_FOLDER = process.env.PICTURE_FOLDER || "profile_pictures";

// Ensure the upload folder exists
if (!fs.existsSync(PICTURE_FOLDER)) {
  fs.mkdirSync(PICTURE_FOLDER, { recursive: true });
}

// Custom storage for multer to have more control over the file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PICTURE_FOLDER);
  },
  filename: (req, file, cb) => {
    const userId = req.params.userId;
    if (!userId || typeof userId != "string") {
      return cb(new Error("User ID is required"), "");
    }
    const extension = path.extname(file.originalname); // Get the file extension
    if (extension != ".png" && extension != ".jpg" && extension != ".jpeg") {
      return cb(new Error("image format not supported"), "");
    }
    cb(null, `${userId}${extension}`); // Set the filename to user ID with the original file extension
  },
});

const upload = multer({ dest: PICTURE_FOLDER, storage: storage });

router.post("/upload/:userId", upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.userId;
  if (!userId || typeof userId != "string") {
    return res.status(400).send("User ID is required.");
  }
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  await db.update(UserTable).set({ image: req.file.filename }).where(eq(UserTable.id, userId)).returning({ image: UserTable.image });
  res.send(`File uploaded successfully: ${req.file.filename} for user ${userId}`);
});

export const UserController = router;
