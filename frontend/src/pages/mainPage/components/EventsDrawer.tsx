import React, {useEffect, useState} from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Center,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useAuth } from '../../../providers/AuthProvider';
import { useNavigate } from "react-router-dom";
import { IEvent, EventProps } from '../../../interfaces/Event.Interface';

// Images
import arrowLeftPNG from "../../../assets/icons/left.png";

export const EventsDrawer: React.FC<EventProps> = ({ isOpen, onClose, onOpenModal }) => {
  const { user, accessToken } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !accessToken) return;
      try {
        const response = await fetch(`/api/events?userId=${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': accessToken } : {}),
          },
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen, user, accessToken]);
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
    onClose();
  }
  const handleShowPublicEvents = () => {
    navigate('/show-events');
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
      <DrawerContent
        mt="4rem"
        position="absolute"
        maxWidth="22rem"
        width="22rem"
        bg="mingle.purple"
        color="black"
        borderRadius="1rem"
        borderStyle="none"
        mb="10rem"
        ml="1rem"
        mr="auto"
      >
        <DrawerHeader textAlign="center" p="0.75rem">
          <Button
            width="40%"
            bg="mingle.darkPurple"
            color="mingle.lightPurple"
            mb="0.5rem"
            pb="0.5rem"
            pt="0.5rem"
            borderRadius="0.3125rem"
          >
            Events
          </Button>
        </DrawerHeader>
        <DrawerBody>
          {events.length > 0 ? (
            events.map((event) => (
              <Center key={event.id}>
                <Button
                  width="70%"
                  bg="mingle.lightPurple"
                  color="mingle.darkPurple"
                  mb="1rem"
                  pb="0.5rem"
                  pt="0.5rem"
                  _hover={{ bg: "mingle.hoverLight" }}
                  borderRadius="0.3125rem"
                  borderStyle="none"
                  onClick={() => handleEventClick(event.id)}
                >
                  {event.eventName}
                </Button>
              </Center>
            ))
          ) : (
            <Center>
              <Button
                width="70%"
                bg="mingle.lightPurple"
                color="mingle.darkPurple"
                mb="1rem"
                pb="0.5rem"
                pt="0.5rem"
                borderRadius="0.3125rem"
                borderStyle="none"
                isDisabled
              >
                No Events Found
              </Button>
            </Center>
          )}
          <Center>
            <Button
              width="70%"
              bg="mingle.darkPurple"
              color="mingle.lightPurple"
              mb="1rem"
              pb="0.5rem"
              pt="0.5rem"
              _hover={{ bg: "mingle.specialPurple" }}
              borderRadius="0.3125rem"
              borderStyle="none"
              onClick={onOpenModal}
            >
              New Event
            </Button>
            
          </Center>
          <Divider marginTop={"20rem"}/>
          <Center>
            <Button
              width="70%"
              bg="mingle.darkPurple"
              color="mingle.lightPurple"
              mt="1rem"
              pb="0.5rem"
              pt="0.5rem"
              _hover={{ bg: "mingle.specialPurple" }}
              borderRadius="0.3125rem"
              borderStyle="none"
              onClick={handleShowPublicEvents}
            >
              Show All Public Events
            </Button>
          </Center>
          <Center>
            <Button
              width="20%"
              bg="mingle.lightPurple"
              color="mingle.darkPurple"
              mb="0.9375rem"
              pb="0.625rem"
              pt="0.625rem"
              _hover={{ bg: "mingle.hoverLight" }}
              borderRadius="full"
              position="absolute"
              bottom="-1.25rem"
              transform="translateY(50%)"
              onClick={onClose}
            >
              <Image src={arrowLeftPNG} boxSize="1.25rem" />
            </Button>
          </Center>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};