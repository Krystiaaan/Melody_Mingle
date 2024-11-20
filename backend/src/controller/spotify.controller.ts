import axios from "axios";
import { AccessTokenResponse } from "../interfaces/spotify.interfaces";
import { Router, Request, Response } from "express";
import { db } from "../drizzle/db";
import { SpotifyAuthInfoTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { NextFunction } from "express";
import { Auth } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export const checkSpotifyAccessTokenExpiration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  try {
    const result = await db
      .select()
      .from(SpotifyAuthInfoTable)
      .where(eq(SpotifyAuthInfoTable.userId, user.id))
      .execute();

    if (result.length === 0) {
      res.status(404).send("No Spotify account linked to this user");
      return;
    }

    const expires_timestamp = result[0].expires_timestamp;
    const current_timestamp = Date.now();

    if (expires_timestamp < current_timestamp) {
      // Refresh token with Spotify API
      const refresh_token = result[0].refresh_token;
      const url = "https://accounts.spotify.com/api/token";
      const data = {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret,
      };

      try {
        const response = await axios.post<AccessTokenResponse>(
          url,
          new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: client_id || "",
            client_secret: client_secret || "",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const { access_token, expires_in } = response.data;
        const new_expires_timestamp = Date.now() + expires_in * 1000;

        await db
          .update(SpotifyAuthInfoTable)
          .set({
            access_token: access_token,
            expires_timestamp: new_expires_timestamp,
          })
          .where(eq(SpotifyAuthInfoTable.userId, user.id))
          .execute();

        res.status(200).send("Access token refreshed");
      } catch (error) {
        console.error("Error refreshing access token", error);
        res.status(500).send("Error refreshing access token");
      }
    } else {
      res.status(200).send("Access token not expired");
    }
  } catch (error) {
    console.error("Error querying SpotifyAuthInfoTable", error);
    res.status(500).send("Internal server error");
  }
};

// If requests to spotify are not successful call this to refresh the token
router.get("/refresh", Auth.prepareAuthentication, checkSpotifyAccessTokenExpiration);

router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db
      .select()
      .from(SpotifyAuthInfoTable)
      .where(eq(SpotifyAuthInfoTable.userId, userId))
      .execute();

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.delete(SpotifyAuthInfoTable).where(eq(SpotifyAuthInfoTable.userId, userId)).execute();

    res.status(200).json({ message: "Spotify account unlinked" });
  } catch (error) {
    console.error("Error deleting SpotifyAuthInfo", error);
    res.status(503).json({ error: "Service Unavailable" });
  }
});

router.get("/get-top-artists/:bearerToken", Auth.prepareAuthentication, async (req, res) => {
  const bearerToken = req.params.bearerToken;
  const topArtistsUrl = "https://api.spotify.com/v1/me/top/artists";
  try {
    const response = await axios.get(topArtistsUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const topArtists = response.data.items;
    //@ts-expect-error because very big spotify object
    const topArtistsNames = topArtists.map((artist) => artist.name);
    res.status(200).json(topArtistsNames);
  } catch (error) {
    console.error("Error getting top artists", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-top-tracks/:bearerToken", Auth.prepareAuthentication, async (req, res) => {
  const bearerToken = req.params.bearerToken;
  const topTracksUrl = "https://api.spotify.com/v1/me/top/tracks";
  try {
    const response = await axios.get(topTracksUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const topTracks = response.data.items;
    //@ts-expect-error because very big spotify object
    const topTracksNames = topTracks.map((track) => track.name);
    res.status(200).json(topTracksNames);
  } catch (error) {
    console.error("Error getting top tracks", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const SpotifyController = router;
