import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Button,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import TinderCard from "react-tinder-card";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { TopArtists } from "../../generalComponents/TopArtists";
import { TopTracks } from "../../generalComponents/TopTracks";
import { IUser } from "../../../interfaces/User.interface";

type Direction = "left" | "right" | "up" | "down";

interface TinderCardElement extends HTMLDivElement {
  swipe: (dir: Direction) => Promise<void>;
  restoreCard: () => Promise<void>;
}

type Match = {
  userB: string;
};

export const MainCard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { user } = useAuth();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const handleSwipeLeft = async (targetUserId: string) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
        body: JSON.stringify({
          userA: user.id,
          userB: targetUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create match");
      }
      // Successful creation of match
      const data = await response.json();
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        });

        let data = await response.json();
        if (user) {
          // Fetch matches for the logged-in user
          const matchesResponse = await fetch(`/api/matches/getMatchesOfAnUser?user=${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: accessToken } : {}),
            },
          });

          const matchesData = await matchesResponse.json();

          // Extract matched user IDs
          const matchedUserIds = new Set(matchesData.map((match: Match) => match.userB));

          // Filter out the logged-in user and matched users
          const loggedInUser = data.find((u: IUser) => u.id === user.id);
          if (!loggedInUser) {
            throw new Error("Logged-in user not found in the fetched data");
          }
          const loggedInUserCity = loggedInUser.city;

          data = data.filter((u: IUser) => u.id !== user.id && !matchedUserIds.has(u.id) && u.city === loggedInUserCity);

        }
        setUsers(data);
        setCurrentIndex(data.length - 1); // Update currentIndex after users are fetched
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  const [currentIndex, setCurrentIndex] = useState(users.length - 1);
  const [lastDirection, setLastDirection] = useState<string | undefined>();

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(users.length)
        .fill(0)
        .map(() => React.createRef<TinderCardElement>()),
    [users.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };
  const canSwipe = currentIndex >= 0;

  const swiped = async (direction: string, _: string, index: number) => {
    if (direction === "left") await handleSwipeLeft(users[currentIndex].id);
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    if (currentIndexRef.current >= idx) {
      (childRefs[idx].current as TinderCardElement).restoreCard();
    }
  };

  const swipe = async (dir: Direction) => {
    if (canSwipe && currentIndex < users.length) {
      if (dir === "left") await handleSwipeLeft(users[currentIndex].id);
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  return (
    <Flex bg="#1B1E2D" p={4} alignItems="center" justifyContent="center" flexDirection="column">
      <Card
        margin="4em"
        bg="mingle.darkPurple"
        borderRadius="1.5em"
        borderColor="mingle.darkPurple"
        borderWidth="0.5em"
        position="relative"
      >
        <Flex direction="column" align="center">
          {users.map((user, index) => (
            <TinderCard
              ref={childRefs[index]}
              key={user.username}
              onSwipe={(dir) => swiped(dir, user.username, index)}
              onCardLeftScreen={() => outOfFrame(user.username, index)}
              preventSwipe={["up", "down"]}
            >
              {index === currentIndex && (
                <Box bg="#7D86CE" borderRadius="1.2rem" p={5}>
                  <CardHeader
                    textAlign="center"
                    p={4}
                    bg="#7D86CE"
                    color="white"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Heading as="h2">{user.username}</Heading>
                    <Avatar
                      size="xl"
                      bg="gray.300"
                      src={user ? `/profile_pictures/${user.id}.png` : ""}
                    ></Avatar>
                  </CardHeader>
                  <CardBody
                    textAlign="center"
                    bg="mingle.Purple"
                    color="white"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="1rem"
                  >
                    <Flex flexDirection="column" gap="1rem">
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
                          <Text>
                            {Array.isArray(user.genrePreferences)
                              ? user.genrePreferences.join(", ")
                              : ""}
                          </Text>
                        </Flex>
                      </Box>
                      <Flex gap="1rem">
                        {user.SpotifyAuthInfo?.access_token ? (
                          <>
                            <TopArtists spotifyBearerToken={user.SpotifyAuthInfo.access_token} />
                            <TopTracks spotifyBearerToken={user.SpotifyAuthInfo.access_token} />
                          </>
                        ) : (
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
                              User has not connected Spotify
                            </Button>
                            <Text>(Or not refreshed token recently?)</Text>
                          </Box>
                        )}
                      </Flex>
                      <Box
                        p="0.5rem"
                        bg="mingle.lightPurple"
                        color="mingle.darkPurple"
                        pointerEvents="none"
                        borderColor="mingle.darkPurple"
                        borderRadius="0.5em"
                        borderWidth="0.2em"
                      >
                        <Flex flexDirection="column">
                          <Button bg="mingle.darkPurple" color="mingle.lightPurple" mb={2}>
                            About me
                          </Button>
                          <Text>{user.bio}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </CardBody>
                  <CardFooter textAlign="center" bg="mingle.Purple" color="white">
                    {user.topTrackID ? (
                      <iframe src={`https://open.spotify.com/embed/track/${user.topTrackID}?utm_source=generator`} width="100%" height="180" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"></iframe>
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
                        User has no favorite song
                      </Box>
                    </Flex>
                    }
                  </CardFooter>
                </Box>
              )}
            </TinderCard>
          ))}
        </Flex>
        <Flex justifyContent="center">
          {lastDirection ? <Text color="mingle.lightPurple">You swiped {lastDirection}</Text> : <Text />}
        </Flex>
        <Flex gap="1em" justifyContent="center" bg="mingle.darkPurple" padding="0.5rem">
          <Button
            bg="green.500"
            borderRadius="0.5em"
            borderColor="mingle.specialPurple"
            borderWidth="0.15em"
            onClick={() => swipe("left")}
            isDisabled={!canSwipe}
          >
            LIKE
          </Button>
          <Button
            bg="red.500"
            borderRadius="0.5em"
            borderColor="mingle.specialPurple"
            borderWidth="0.15em"
            onClick={() => swipe("right")}
            isDisabled={!canSwipe}
          >
            SKIP
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};
