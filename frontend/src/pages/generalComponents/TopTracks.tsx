import { Box, Button, Text } from "@chakra-ui/react";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";

export const TopTracks = ({ spotifyBearerToken }: { spotifyBearerToken: string }) => {
    const [topTracks, setTopTracks] = useState([]);
    const { accessToken } = useAuth();

    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(`/api/spotify/get-top-tracks/${spotifyBearerToken}`, {
          headers: {
            Authorization: accessToken,
          },
        });
        const topTracks = response.data;
        setTopTracks(topTracks);
      } catch (error) {
        console.error("couldn't fetch top tracks", error);
      }
    };

  useEffect(() => {
    if (spotifyBearerToken === "") {
      return;
    }
    fetchTopTracks();
  }, []);

  return (
    <Box
      flex={1}
      p="0.5em"
      bg="mingle.lightPurple"
      color="mingle.darkPurple"
      pointerEvents="none"
      borderColor="mingle.darkPurple"
      borderRadius="0.5em"
      borderWidth="0.2em"
    >
      <Button bg="mingle.darkPurple" color="white" margin="0.2rem">
        Top Songs
      </Button>
      <Text>- {topTracks[0] || ""}</Text>
      <Text>- {topTracks[1]}</Text>
      <Text>- {topTracks[2]}</Text>
    </Box>
  );
};
