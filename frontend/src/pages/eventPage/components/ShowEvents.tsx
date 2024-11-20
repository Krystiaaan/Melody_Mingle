import React, { useEffect, useState } from 'react';
import { Center, Spinner, Button, Box, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { BaseLayout } from '../../../layout/BaseLayout';
import { Navbar } from '../../generalComponents/Navbar';

interface Event {
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

interface Participant {
  userId: string;
  eventId: string;
}

interface EventWithParticipants {
  event: Event;
  participants: Participant[];
}

export const ShowEvents: React.FC = () => {
  const [eventsWithParticipants, setEventsWithParticipants] = useState<EventWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchPublicEventsAndParticipants = async () => {
      if (!user || !accessToken) {
        console.error('User is not authenticated');
        return;
      }
      try {
        const response = await fetch('/api/events/public', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: accessToken } : {}),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch public events');
        }

        const { events, participants }: { events: Event[]; participants: Participant[] } = await response.json();

        // Merge events with their participants
        const mergedEvents = events.map(event => ({
          event,
          participants: participants.filter(participant => participant.eventId === event.id)
        }));

        // Filter out events where the current user is a participant
        const filteredEvents = mergedEvents.filter(eventData => {
          const isUserParticipant = eventData.participants.some(
            participant => participant.userId === user.id
          );
          return !isUserParticipant;
        });

        setEventsWithParticipants(filteredEvents);
      } catch (error) {
        console.error('Error fetching public events and participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEventsAndParticipants();
  }, [user, accessToken]);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
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
      
      toast({
        title: 'Successfully joined event',
        description: `You have successfully joined the event."`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Update state to remove the event from the list after joining
      setEventsWithParticipants(prevEvents => 
        prevEvents.filter(eventData => eventData.event.id !== eventId)
      );
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  if (loading) {
    return (
      <BaseLayout>
        <Navbar />
        <Center mt="5rem">
          <Spinner size="xl" />
        </Center>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Navbar />
      <Box p="4rem">
        <Center>
          <Button onClick={() => navigate(-1)} mb="4">
            Back
          </Button>
        </Center>
        {eventsWithParticipants.length > 0 ? (
          eventsWithParticipants.map(eventData => (
            <Box
              key={eventData.event.id}
              mb="4"
              p="4"
              borderWidth="1px"
              borderRadius="lg"
              borderStyle="none"
              width="70%"
              mx="auto"
              bg="mingle.purple"
              textAlign="center"
            >
              <Text fontSize="xl" fontWeight="bold" color="mingle.darkPurple">
                {eventData.event.eventName}
              </Text>
              <Text mt="2" color="black">
                Type: {eventData.event.eventType}
              </Text>
              <Text color="black">Location: {eventData.event.location}</Text>
              <Button
                mt="4"
                width="100%"
                bg="mingle.darkPurple"
                color="white"
                onClick={() => handleEventClick(eventData.event.id)}
              >
                View Details
              </Button>
              <Button
                mt="2"
                width="100%"
                bg="mingle.darkPurple"
                color="white"
                onClick={() => handleJoinEvent(eventData.event.id)}
              >
                Join Event
              </Button>
            </Box>
          ))
        ) : (
          <Center>No public events found</Center>
        )}
      </Box>
    </BaseLayout>
  );
};
