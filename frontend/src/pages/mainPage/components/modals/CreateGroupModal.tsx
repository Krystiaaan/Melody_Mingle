import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Button,
  } from "@chakra-ui/react";
import { useAuth } from '../../../../providers/AuthProvider';

export const CreateGroupModal = ({ isOpen, onCloseSave, onClose }: { isOpen: boolean, onCloseSave: () => void, onClose: () => void }) => {
    
    const [newGroupName, setNewGroupName] = useState('');
    const { user, accessToken } = useAuth();

    const createGroup = async () => {
        if (!user) {
            console.error("User is not logged in");
            return;
        }

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? {Authorization: accessToken} : {}),
                },
                body: JSON.stringify({
                    name: newGroupName,
                    creator: user.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create group');
            }

            const data = await response.json();

            const groupId = data[0].id;

            const responseInvite = await fetch('/api/groups/inviteUsers', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? {Authorization: accessToken} : {}),
                },
                body: JSON.stringify({
                    userId: user.id,
                    groupId: groupId,
                }),
            });
            if (!responseInvite.ok) {
                throw new Error('Failed to add user to group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
        window.location.reload();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="mingle.purple">
                <ModalHeader color="mingle.lightPurple">Choose a group name</ModalHeader>
                <ModalCloseButton />

                <ModalBody bg="mingle.lightPurple">
                    <Input type="text" value={newGroupName} placeholder="Enter group name" onChange={(e) => setNewGroupName(e.target.value)} bg="mingle.darkPurple" color="mingle.lightPurple"/>
                </ModalBody>
        
                <ModalFooter>
                    <Button bg="mingle.lightPurple" mr={3} onClick={createGroup}>
                        Create Group
                    </Button>
                    <Button bg="mingle.darkPurple" color="mingle.lightPurple" _hover={{ bg: "mingle.specialPurple" }} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
      );
};