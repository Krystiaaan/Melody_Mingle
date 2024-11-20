import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, VStack, HStack, Button, Divider, useToast } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isWithinInterval, parseISO } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { EventUpdateModal } from './EventUpdateModal';
import { useAuth } from '../../../providers/AuthProvider';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface Event {
  id: string;
  creator: string;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isPrivate: boolean;
}
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}
export interface Participant {
  userId: string;
  eventId: string;
}

interface EventCardProps {
  event: { event: Event; participants: Participant[] };
}

const highlightedStyles = `
.react-datepicker__day--highlighted-custom {
  background-color: #7D86CE !important; 
  color: white !important;
}
.react-datepicker__day--highlighted-start {
  background-color: #424874 !important; 
  color: white !important;
}
.react-datepicker__day--highlighted-end {
  background-color: #424874 !important; 
  color: white !important;
}
.react-datepicker {
  pointer-events: none;
  border-radius: 0.5rem;
  border:  0.3rem solid #424874;
}
`;

type User = {
  id: string;
  username: string;
  url: string;
  genrePreferences: string;
  bio: string;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { event: eventData, participants } = event;
  const toast = useToast();
  const { user, accessToken } = useAuth();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [matches, setMatches] = useState<User[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);
  useEffect(() => {
    const fetchUsersAndCheckMatches = async () => {
      try {
        if (!accessToken || !user) {
          return;
        }

        const usersResponse = await fetch(`/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        });

        let fetchedUsers = await usersResponse.json();
        fetchedUsers = fetchedUsers.filter((u: User) => u.id !== user.id);

        const matchedUsers: User[] = [];

        for (const userB of fetchedUsers) {
          const matchResponse = await fetch(
            `/api/matches/checkMatch?userA=${encodeURIComponent(user.id)}&userB=${encodeURIComponent(userB.id)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: accessToken,
              },
            }
          );

          if (matchResponse.ok) {
            const matchData = await matchResponse.json();
            if (matchData.AhasMatchedB.length > 0 && matchData.BhasMatchedA.length > 0) {
              matchedUsers.push(userB);
            }
          }
        }

        setMatches(matchedUsers);

      } catch (error) {
        console.error("Failed to fetch users or check matches:", error);
      }
    };

    if (eventData.isPrivate) {
      fetchUsersAndCheckMatches();
    }
  }, [user, accessToken, eventData.isPrivate]);
  useEffect(() => {
    if (eventData.location) {
      axios.get<NominatimResult[]>(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: eventData.location,
          format: 'json',
        },
      })
        .then((response) => {
          const results = response.data;
          if (results && results.length > 0) {
            const { lat, lon } = results[0];
            setCoordinates([parseFloat(lat), parseFloat(lon)]);
            setMapKey(prevKey => prevKey + 1);
          } else {
            console.error("No results found for location", eventData.location);
          }
        })
        .catch((error: Error) => {
          console.error("Error fetching coordinates for location", error);
        });
    }
  }, [eventData.location]);

  const inviteUserToEvent = async (invitedUserId: string) => {
    if (!accessToken || !user) {
      console.error('No access token found');
      return;
    }

    try {

      const response = await fetch(`/api/events/invite/${eventData.id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({ userId: user.id, invitedUserId }),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        console.error('Failed to invite user to event:', responseBody.error);
        throw new Error('Failed to invite user to event');
      }

      const data = await response.json();
      toast({
        title: 'Invited user to event',
        description: `User ${user.username} has been invited to the event`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== invitedUserId));
    } catch (error) {
      console.error("Error inviting user to event:", error);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user || !accessToken) {
      console.error('User is not authenticated');
      return;
    }
    try {
      const response = await fetch(`/api/events/join/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to join event');
      }

      const data = await response.json();

      // Optionally, navigate or provide feedback to the user
      setHasJoined(true);
      toast({
        title: 'Successfully joined event',
        description: `You have successfully joined the event "${eventData.eventName}"`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };
  const handleLeaveEvent = async (eventId: string) => {
    if (!user || !accessToken) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const response = await fetch(`/api/events/leave/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to leave event');
      }

      const data = await response.json();

      setHasLeft(true);
      setHasJoined(false);
      toast({
        title: 'Successfully left event',
        description: `You have successfully left the event "${eventData.eventName}"`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate("/melodymingle");
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };
  if (!eventData || !eventData.startDate || !eventData.endDate) {
    console.error("Invalid event data", eventData);
    return <div>Error: Invalid event data</div>;
  }

  let startDate, endDate;

  try {
    startDate = parseISO(eventData.startDate);
    endDate = parseISO(eventData.endDate);
  } catch (error) {
    console.error("Error parsing dates", error);
    return <div>Error: Invalid date format</div>;
  }

  const highlightWithRange = (date: Date) => {
    return isWithinInterval(date, { start: startDate, end: endDate });
  };

  const isStartDate = (date: Date) => date.getTime() === startDate.getTime();
  const isEndDate = (date: Date) => date.getTime() === endDate.getTime();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const isUserParticipant = participants.some(participant => participant.userId === user?.id);

  return (
    <>
      <Box
        borderRadius="lg"
        boxShadow="lg"
        padding="8"
        backgroundColor="mingle.purple"
        margin="auto"
        position="relative"
        width="auto"
        height="auto"
        top="3%"
        
      >
        <style>{highlightedStyles}</style>
        <HStack justifyContent="space-between" marginBottom="4">
        {
            user &&
            user.id !== eventData.creator &&
            isUserParticipant &&
            !hasLeft && (
              <Button
                bg="mingle.darkPurple"
                color="white"
                onClick={() => handleLeaveEvent(eventData.id)}
              >
                Leave Event
              </Button>
            )}
          {user && user.id === eventData.creator && (
            <Button colorScheme="gray" onClick={openModal}>
              Options
            </Button>
          )}
          
          <Button colorScheme="gray" onClick={() => navigate("/melodymingle")}>
            Go back
          </Button>
        </HStack>
        <Divider marginBottom="6" />
        <Heading
          color="mingle.lightPurple"
          size="lg"
          textAlign="center"
          marginBottom="6"
        >
          {eventData.eventName}
        </Heading>

        <VStack spacing="4" color="mingle.lightPurple" textAlign="center">
          <Box width="100%">
            <Text fontSize="md" fontWeight="bold">
              Event Type
            </Text>
            <Text fontSize="md" paddingLeft="4">
              {eventData.eventType}
            </Text>
          </Box>

          <Box textAlign="center">
            <Text fontSize="md" fontWeight="bold">
              Event Date
            </Text>
            <DatePicker
              selected={startDate}
              onChange={() => {}}
              readOnly
              inline
              highlightDates={[
                { "react-datepicker__day--highlighted-start": [startDate] },
                { "react-datepicker__day--highlighted-end": [endDate] },
                {
                  "react-datepicker__day--highlighted-custom": Array.from(
                    {
                      length:
                        (endDate.getTime() - startDate.getTime()) /
                          (1000 * 3600 * 24) +
                        1,
                    },
                    (_, i) =>
                      new Date(startDate.getTime() + i * 1000 * 3600 * 24)
                  ).filter((date) => !isStartDate(date) && !isEndDate(date)),
                },
              ]}
              dayClassName={(date) =>
                isStartDate(date)
                  ? "react-datepicker__day--highlighted-start"
                  : isEndDate(date)
                    ? "react-datepicker__day--highlighted-end"
                    : highlightWithRange(date)
                      ? "react-datepicker__day--highlighted-custom"
                      : ""
              }
            />
          </Box>

          <Box width="100%">
            <Text fontSize="md" fontWeight="bold">
              Location
            </Text>
            {coordinates ? (
              <MapContainer
                key={mapKey}
                center={coordinates}
                zoom={13}
                style={{ height: "10rem", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={coordinates} icon={defaultIcon}>
                  <Popup>
                    {eventData.eventName} - {eventData.location}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <Text>Loading map...</Text>
            )}
          </Box>

          <Box width="100%">
            <Text fontSize="md" fontWeight="bold">
              Description
            </Text>
            <Text fontSize="md" paddingLeft="4">
              {eventData.description}
            </Text>
          </Box>
          <Box width="100%">
            <Text fontSize="md" fontWeight="bold">
              Privacy
            </Text>
            <Text fontSize="md" paddingLeft="4">
              {eventData.isPrivate ? "Private" : "Public"}
            </Text>
          </Box>

          {!eventData.isPrivate &&
            user &&
            user.id !== eventData.creator &&
            !isUserParticipant &&
            !hasJoined && (
              <Button
                bg="mingle.darkPurple"
                color="white"
                onClick={() => handleJoinEvent(eventData.id)}
              >
                Join Event
              </Button>
            )}

          {eventData.isPrivate && user && user.id === eventData.creator && (
            <Box width="100%">
              <Text fontSize="md" fontWeight="bold">
                Invite Matches
              </Text>
              {matches.length > 0 ? (
                matches
                  .filter(
                    (match) =>
                      !participants.some(
                        (participant) => participant.userId === match.id
                      )
                  )
                  .map((match) => (
                    <HStack
                      key={match.id}
                      spacing="4"
                      paddingLeft="4"
                      paddingRight="4"
                    >
                      <Text>{match.username}</Text>
                      <Button onClick={() => inviteUserToEvent(match.id)}>
                        Invite
                      </Button>
                    </HStack>
                  ))
              ) : (
                <Text>No matches found to invite</Text>
              )}
            </Box>
          )}
        </VStack>
      </Box>
      <EventUpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={eventData}
      />
    </>
  );
};
