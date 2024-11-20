import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { useAuth } from '../../../providers/AuthProvider';
import { ChatWindowProps, Message } from '../../../interfaces/Chat.interface';

const ChatWindowGroup: React.FC<ChatWindowProps> = ({ loggedInUser, selectedUser, selectedGroupForChat, onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { accessToken } = useAuth();


    useEffect(() => {
        // Fetch messages from the backend
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/chat/GroupMessage/${loggedInUser.id}/${selectedGroupForChat.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(accessToken ? { 'Authorization': accessToken } : {}),
                    },
                });
                if (!response.ok) {
                    // Log error status and response text
                    console.error(`Error fetching messages: ${response.status} ${response.statusText}`);
                    const errorText = await response.text();
                    console.error(`Response Text: ${errorText}`);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        const intervalId = setInterval(fetchMessages, 1000); // Fetch messages every 5 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, [loggedInUser.id, accessToken, selectedGroupForChat.id]);

    const sendMessage = async () => {
            const newMessage = {
                sender_id: loggedInUser.id,
                composed_id: selectedGroupForChat.id,
                text: message
            }

            try {
                const response = await fetch('/api/chat/groupMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(accessToken ? { 'Authorization': accessToken } : {}),
                    },
                    body: JSON.stringify(newMessage),
                });

                if (!response.ok) {
                    console.error(`Error sending message: ${response.status} ${response.statusText}`);
                    const errorText = await response.text();
                    console.error(`Response Text: ${errorText}`);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
            }

    };

    return (
        <Box 
            position="fixed" 
            bottom="0" 
            right="0" 
            width="40rem" 
            mr="40rem" 
            mb="18rem" 
            bg="mingle.purple" 
            p="4" 
            borderRadius="0.5rem"
        >
            <Button onClick={onClose} mb="4">Close</Button>
            <Box mb="4" color="mingle.darkPurple" fontSize="2xl" fontWeight="bold">
                <Text>Groupchat {selectedGroupForChat.name}</Text>
            </Box>
            <Box bg="mingle.lightPurple" borderRadius="0.5rem" mb="1rem" height="20rem" overflowY="scroll" p="0.5rem">
                {messages.map((msg, index) => (
                    <Box key={index} borderRadius="0.2rem"  p="0.4rem">
                        <Text fontWeight="bold" color="mingle.darkPurple">{msg.User.username}</Text>
                        <Text bg="mingle.message" p="0.3rem" borderRadius="0.3rem">{msg.Message.text}</Text>
                    </Box>
                ))}
            </Box>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                color="mingle.darkPurple"
                placeholder="Type a message"
                bg="mingle.lightPurple" 
                mb="1rem"
            />
            <Button bg="mingle.lightPurple" color="mingle.darkPurple" onClick={sendMessage}>Send</Button>
        </Box>
    );
};

export default ChatWindowGroup;