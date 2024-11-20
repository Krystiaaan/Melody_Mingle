import React,  {useState} from 'react';
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
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useAuth  } from '../../../../providers/AuthProvider';
import { EventProps } from '../../../../interfaces/Event.Interface';

const eventTypes = ["Concert", "Party", "Festival"];

export const CreateEventModal: React.FC<EventProps> = ({ isOpen, onClose }) => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: '',
    eventType: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    isPrivate: "true",
  });
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
      const eventDataWithCreator = {
        ...eventData,
        creator: user.id, 
        isPrivate: eventData.isPrivate === 'true',
      };
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': accessToken } : {}),
          
        },
        body: JSON.stringify(eventDataWithCreator),

      });
      if(!response.ok){
        throw new Error('Failed to create event');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const createdEvent = data[0];
        onClose();
        navigate(`/events/${createdEvent.id}`);
      } else if (data && data.id) {
        const createdEvent = data;;
        onClose();
        navigate(`/events/${createdEvent.id}`);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error creating event:', error);
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
          Create Event
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
              value={eventData.startDate}
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
              value={eventData.endDate}
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
        <ModalFooter justifyContent="center">
          <Button
            bg="mingle.darkPurple"
            color="white"
            _hover={{ bg: 'mingle.hoverDarkPurple' }}
            onClick={handleSubmit}
            borderRadius="md"
            px={8}
          >
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};