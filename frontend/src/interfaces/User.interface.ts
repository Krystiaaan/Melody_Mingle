export type IUser = {
  id: string;
  username: string;
  url: string;
  genrePreferences: string;
  bio: string;
  topTrackID: string;
  SpotifyAuthInfo: {
    access_token: string;
  };
  city: string;
  image: string;
};
