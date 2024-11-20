import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Textarea,
  Select,
  useToast,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useAuth } from '../../../providers/AuthProvider';
import { Event } from './EventCard';
import { set } from 'date-fns';

interface EventUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const eventTypes = ["Concert", "Party", "Festival"];

export const EventUpdateModal: React.FC<EventUpdateModalProps> = ({ isOpen, onClose, event }) => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [eventData, setEventData] = useState({ ...event, isPrivate: event.isPrivate ? 'true' : 'false' });

  useEffect(() => {
    setEventData({ ...event, isPrivate: event.isPrivate ? 'true' : 'false' });
  }, [event]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleRadioChange = (value: string) => {
    setEventData({ ...eventData, isPrivate: value });
  };

  const handleSubmit = async () => {
    if (!user || !accessToken) {
      console.error('User is not authenticated');
      return;
    }
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': accessToken } : {}),
        },
        body: JSON.stringify({ ...eventData, isPrivate: eventData.isPrivate === 'true' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      const data = await response.json();
      if (data && data.id) {
        window.location.reload();
        onClose();
        navigate(`/events/${data.id}`);
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error updating event',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!user || !accessToken) {
      console.error('User is not authenticated');
      return;
    }
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': accessToken } : {}),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      toast({
        title: 'Event deleted',
        description: `Event "${event.eventName}" has been deleted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      navigate('/melodymingle');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error deleting event',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="mingle.purple"
        color="white"
        borderRadius="2xl"
        boxShadow="lg"
        p={6}
      >
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Update Event
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <Input
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="Event Name"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            />
          </FormControl>
          <FormControl mb={4}>
            <Select
              name="eventType"
              value={eventData.eventType}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="Select event type"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            >
              {eventTypes.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <Input
              name="startDate"
              value={eventData.startDate.split('T')[0]}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="Start Date"
              type="date"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            />
          </FormControl>
          <FormControl mb={4}>
            <Input
              name="endDate"
              value={eventData.endDate.split('T')[0]}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="End Date"
              type="date"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            />
          </FormControl>
          <FormControl mb={4}>
            <Input
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="Event Location"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            />
          </FormControl>
          <FormControl mb={4}>
            <Textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              bg="white"
              color="black"
              placeholder="Event Description"
              _placeholder={{ color: '#E0E0E0' }}
              borderRadius="md"
            />
          </FormControl>
          <FormControl as="fieldset" mb={4}>
            <RadioGroup
              name="isPrivate"
              value={eventData.isPrivate}
              onChange={handleRadioChange}
            >
              <Stack direction="row" spacing={5}>
                <Radio value="true" bg="mingle.darkPurple" colorScheme="purple">
                  Private
                </Radio>
                <Radio value="false" bg="mingle.darkPurple" colorScheme="purple">
                  Public
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button
            bg="mingle.darkPurple"
            color="white"
            onClick={handleDelete}
            borderRadius="md"
            px={8}
          >
            Delete Event
          </Button>
          <Button
            bg="mingle.darkPurple"
            color="white"
            onClick={handleSubmit}
            borderRadius="md"
            px={8}
          >
            Update Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
