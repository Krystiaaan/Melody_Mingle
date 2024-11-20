import "dotenv/config";
import express from "express";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { GroupController } from "./controller/group.controller";
import { EventController } from "./controller/event.controller";
import { MatchController } from "./controller/match.controller";
import { ChatController } from "./controller/chat.controller";
import { Auth } from "./middleware/auth.middleware";
import path from "path";
import http from "http";
import { SpotifyController } from "./controller/spotify.controller";

// import { insertUser } from "./drizzle/seeders/testSeeders";

const PORT = 3000;
const app = express();
const PICTURE_FOLDER = process.env.PICTURE_FOLDER || "/app/profile_pictures";

export const DI = {} as {
  server: http.Server;
};

export const initializeServer = async () => {
  // routes
  app.use(express.json()); // for parsing application/json
  app.use(Auth.prepareAuthentication);

  // Serve uploaded pictures
  app.use("/profile_pictures", express.static(PICTURE_FOLDER));


  app.use("/auth", AuthController);
  app.use("/users", Auth.verifyAccess, UserController); 
  app.use("/groups", Auth.verifyAccess, GroupController);
  app.use("/events", Auth.verifyAccess, EventController);
  app.use("/matches", Auth.verifyAccess, MatchController);
  app.use("/chat", Auth.verifyAccess, ChatController);
  app.use("/spotify", Auth.verifyAccess, SpotifyController);

  ;

   DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

};

export const closeServer = async () => {
  DI.server.close();
};


if (process.env.environment !== "test") {
  initializeServer();
}
