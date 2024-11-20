import { Router } from "express";
import { db } from "../drizzle/db";
import { LoginSchema, RegisterUserDTO, RegisterUserSchema } from "../drizzle/zodValidationSchema";
import { Auth } from "../middleware/auth.middleware";
import { eq } from "drizzle-orm";
import { SpotifyAuthInfoTable, UserTable } from "../drizzle/schema";
import axios from "axios";
import { AccessTokenResponse, UserProfile } from "../interfaces/spotify.interfaces";
import * as dotenv from "dotenv";
dotenv.config();

const router = Router({ mergeParams: true });

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

router.post("/register", async (req, res) => {
  const validationResult = RegisterUserSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).send({ errors: validationResult.error.errors });
  }
  const registerUserDto: RegisterUserDTO = {
    ...validationResult.data,
    passwordHash: await Auth.hashPassword(validationResult.data.password),
  };

  // check if user already exists with this email
  const existingUserByMail = await db.query.UserTable.findFirst({
    where: eq(UserTable.eMail, registerUserDto.eMail),
  });
  if (existingUserByMail) {
    return res.status(400).send({ errors: ["User with this email already exists"] });
  }
  // or username
  const existingUserByUsername = await db.query.UserTable.findFirst({
    where: eq(UserTable.username, registerUserDto.username),
  });
  if (existingUserByUsername) {
    return res.status(400).send({ errors: ["User with this username already exists"] });
  }
  try {
    const newUser = await db
      .insert(UserTable)
      .values({
        ...registerUserDto,
      })
      .returning({
        id: UserTable.id,
        eMail: UserTable.eMail,
        username: UserTable.username,
        dateOfBirth: UserTable.dateOfBirth,
        passwordHash: UserTable.passwordHash,
      });
    return res.status(201).send(newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.post("/login", async (req, res) => {
  const validationResult = LoginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).send({ errors: validationResult.error.errors });
  }
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.eMail, validationResult.data.eMail),
  });

  if (!user) {
    return res.status(400).json({ errors: ["User does not exist"] });
  }
  const matchingPassword = await Auth.comparePasswordWithHash(validationResult.data.password, user.passwordHash);
  if (!matchingPassword) {
    return res.status(401).send({ errors: ["Incorrect password"] });
  }

  const jwt = Auth.generateToken({
    id: user.id,
    eMail: user.eMail,
    username: user.username,
  });

  res.status(200).send({ accessToken: jwt });
});

//
// Spotify
//
// Conctructing spotify authorization url
router.get("/spotify/redirect", async (req, res) => {
  const originalQueryParams = req.query;
  const searchParams = new URLSearchParams(originalQueryParams as Record<string, string>);
  const queryString = searchParams.toString();
  const frontendUrl = `http://localhost:5173/spotify-redirect?${queryString}`;
  res.redirect(frontendUrl);
});

router.get("/spotify/authorize", async (req, res) => {
  const state = Math.random().toString(36).slice(2);
  const scope = "user-top-read user-read-private";
  const show_dialog = "true";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: process.env.CALLBACK_REDIRECT_URL!,
    state: state,
    show_dialog: show_dialog,
  }).toString();
  res.redirect("https://accounts.spotify.com/authorize?" + params);
});

// link Spotify Account with Client Id And Client_Secret Callback
// receive token
router.get("/spotify/callback", Auth.prepareAuthentication, async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const userId = req.query.userId;

  if (!code) {
    return res.status(400).json({ message: "code not provided!" });
  }
  if (!state) {
    return res.status(400).json({ message: "state not provided!" });
  }
  if (!userId) {
    return res.status(400).json({ message: "user not authenticated!" });
  }

  const base64credentials = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const { data: authInfo }: { data: AccessTokenResponse } = await axios.post(
    "https://accounts.spotify.com/api/token?",
    {
      grant_type: "authorization_code",
      code: code as string,
      redirect_uri: process.env.CALLBACK_REDIRECT_URL,
      client_id: client_id,
      client_secret: client_secret,
      state: state, // not neccessary but good practice for security
    },
    {
      headers: {
        Authorization: "Basic " + base64credentials,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  await db
    .insert(SpotifyAuthInfoTable)
    .values({
      access_token: authInfo.access_token,
      refresh_token: authInfo.refresh_token,
      userId: userId as string,
      expires_in: authInfo.expires_in,
      expires_timestamp: Math.floor(Date.now() / 1000) + authInfo.expires_in,
      scope: authInfo.scope,
      token_type: authInfo.token_type,
    })
    .execute();

  res.status(201).redirect("http://localhost:5173/profile");
});

export const AuthController = router;
