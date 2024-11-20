import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";

import { TopArtists } from "../../generalComponents/TopArtists";
import { TopTracks } from "../../generalComponents/TopTracks";
import { useAuth } from "../../../providers/AuthProvider";
import { useEffect, useState } from "react";

interface ShowCardProps {
  firstname: string;
  age: number;
  profilePicture: string;
  genres: string;
  bio: string;
  spotifyBearerToken: string;
  topTrackID: string;
}

const HeaderBox: React.FC = () => {
  return (
    <Box
      textAlign="center"
      p="0.9rem"
      bg="mingle.purple"
      color="white"
      mb="1rem"
      borderRadius="0.9rem"
      width="15rem"
    >
      <Heading as="h1" size="lg" color="mingle.darkPurple">
        Mingle Card
      </Heading>
      <Text>This is the first thing Minglers will see and hear about you on Melody Mingle!</Text>
    </Box>
  );
};

export const ShowCard: React.FC<ShowCardProps> = ({
  firstname,
  age,
  profilePicture,
  genres,
  bio,
  spotifyBearerToken,
  topTrackID,
}) => {
  
  return (
    <Flex
      p="1.8rem"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="4rem"
      width="55rem"
      gap="1rem"
    >
      <Card bg="mingle.purple" borderRadius="0.9rem" p="0.9rem" position="relative" width="50rem">
        <CardHeader textAlign="center" p="0.9rem" bg="mingle.purple" color="white">
          <Heading as="h2" size="md">
            {firstname}, {age}
          </Heading>
        </CardHeader>
        <CardBody textAlign="center" p="0.9rem" bg="mingle.purple" color="white">
          <Flex justifyContent="center" alignItems="center" mb="0.9rem">
            <Image
              src={`/profile_pictures/${profilePicture}`}
              alt="Profile Picture"
              boxSize="7.2rem"
              borderRadius="full"
              bg="gray.300"
            />
          </Flex>
          <Flex w="100%" my="0.45rem">
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
              <Flex flexDirection="column">
                <Button bg="mingle.darkPurple" color="white" margin="0.2rem">
                  Genre Preferences
                </Button>
                <Text>{genres}</Text>
              </Flex>
            </Box>
          </Flex>
          <Flex gap="1rem" mt="1rem">
            <TopArtists spotifyBearerToken={spotifyBearerToken} />
            <TopTracks spotifyBearerToken={spotifyBearerToken} />
          </Flex>
          <Box
            p="0.5rem"
            bg="mingle.lightPurple"
            color="mingle.darkPurple"
            pointerEvents="none"
            borderColor="mingle.darkPurple"
            borderRadius="0.5em"
            borderWidth="0.2em"
            mt="1rem"
          >
            <Flex flexDirection="column">
              <Button bg="mingle.darkPurple" color="mingle.lightPurple" mb={2}>
                About me
              </Button>
              <Text>{bio}</Text>
            </Flex>
          </Box>
        </CardBody>
        <CardFooter textAlign="center" p="0.9rem" bg="mingle.purple" color="white">
        {topTrackID ? (
          <iframe src={`https://open.spotify.com/embed/track/${topTrackID}?utm_source=generator`} width="100%" height="180" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"></iframe>
        ) :
        <Flex margin="auto">
          <Box 
            p="0.5rem"
            bg="mingle.lightPurple"
            color="mingle.darkPurple"
            pointerEvents="none"
            borderColor="mingle.darkPurple"
            borderRadius="0.5em"
            borderWidth="0.2em"
          >
            You have not selected a favorite song yet (Connect to Spotify)
          </Box>
        </Flex>
        }
        </CardFooter>
      </Card>
      <Flex mb="30rem">
        <HeaderBox />
      </Flex>
    </Flex>
  );
};
