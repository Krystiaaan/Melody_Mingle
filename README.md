# MelodyMingle - Your Soundtrack to New Connections

Melody Mingle is a social network focusing on connecting people through music. Create and customize your profile, import your favorite music with Spotify and <i>mingle</i> with people whose taste inspires you!

<hr>

![](documentation/img/TutorialMM.png)


## Project setup

1. Create `.env` for backend
2. run `docker compose up`
3. run `docker exec -it backend npm run db:generate` in a second Console to generate the db migrations
4. run `docker exec -it backend npm run db:migrate` to create the db schema
5. The Application can now be accessed on http://localhost:5173


## Spotify Integration

- Create Spotify Account and Login on https://developer.spotify.com/
- Create App
- Fill fields
- Add `http://localhost:3000/auth/spotify/redirect` to Redirect URIs
![](documentation/img/redirectURI.png)
- Create Project
- Go to Project settings
![](documentation/img/SettingsSpotify.png)
- Copy Client ID & Client Tokens and insert into backend .env
![](documentation/img/ClientTokens.png)

## Features

### Edit and Customize Profile
![](documentation/img/CustomizeProfile.png)
### Connect your Spotify Account
![](documentation/img/ConnectSpotify.png)

### Chose and Show your Favorite Song

![](documentation/img/FavSong.png)

### Match Profiles by Liking or Disliking (Tinder Style)
![](documentation/img/MingleCard.png)
### Listen to a preview to their favorite Song within MelodyMingle
![](documentation/img/SongPreview.png)

### Chat with Mutual Connections

![](documentation/img/Chat.png)

### Create Groups and Chat with Everybody

![](documentation/img/GroupChat.png)

### Create, Show and Find Events

![](documentation/img/CreateEvent.png)
![](documentation/img/EventDetails.png)
![](documentation/img/ListEvents.png)


## CI Pipeline
The implemented CI/CD Pipeline automatically runs tests for the backend to ensure stability and maintain functionality of the application during development.

## Frontend Tests

To run the frontend tests 
1. Open a Console 
2. cd into frontend/
3. run `npm install` 
4. run `npm run test`  (on error / if cypress isn't found run `npx cypress install` before)

NOTE: The application must be up and running via `docker compose up` with finished database migrations.

NOTE: After the tests have been run the database has to be rebuild since users which are created during the test process are not deleted afterwards
(In the future the tests should be run inside the CI Pipeline inside a disposable docker container)
