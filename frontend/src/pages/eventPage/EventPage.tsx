import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { BaseLayout } from '../../layout/BaseLayout';
import { Navbar } from '../generalComponents/Navbar';
import { EventCard } from './components/EventCard';
import { Box, Spinner, Text } from '@chakra-ui/react';

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

export const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, accessToken } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!user || !accessToken) {
        console.error("User or accessToken missing");
        return;
      }

      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized');
          } else if (response.status === 404) {
            setError('Event not found');
          } else {
            setError('Failed to fetch event data');
          }
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setEvent(data[0]); 
        } else if (typeof data === 'object') {
          setEvent(data);
        } else {
          setError('Invalid event data structure');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, user, accessToken]);

  if (loading) {
    return (
      <BaseLayout>
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout>
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="xl">{error}</Text>
        </Box>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Navbar />
      {event && <EventCard event={event} />}
    </BaseLayout>
  );
};