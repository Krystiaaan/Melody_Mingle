import { Box, Button, Text } from "@chakra-ui/react";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";

export const TopArtists = ({ spotifyBearerToken }: { spotifyBearerToken: string }) => {
  const [topArtists, setTopArtists] = useState([]);
  const { accessToken } = useAuth();

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get(`/api/spotify/get-top-artists/${spotifyBearerToken}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      const topArtists = response.data;
      setTopArtists(topArtists);
    } catch (error) {
      console.error("couldn't fetch top artists", error);
    }
  };

  useEffect(() => {
    if (spotifyBearerToken === "") {
      return;
    }
    fetchTopArtists();
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
        Top Artists
      </Button>
      <Text>- {topArtists[0] || ""}</Text>
      <Text>- {topArtists[1]}</Text>
      <Text>- {topArtists[2]}</Text>
    </Box>
  );
};
