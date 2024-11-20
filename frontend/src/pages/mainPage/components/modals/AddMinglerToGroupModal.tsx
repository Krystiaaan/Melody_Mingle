import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
  } from "@chakra-ui/react";
import { IUser } from '../../../../interfaces/User.interface';
import { IGroup } from "../../../../interfaces/Group.interface.ts";
import { useAuth } from '../../../../providers/AuthProvider';

export const AddMinglerToGroupModal = ({ isOpen, onCloseSave, onClose, userToAdd }: { isOpen: boolean, onCloseSave: () => void, onClose: () => void, userToAdd: IUser }) => {

    const { user, accessToken } = useAuth();

    // State to manage the visibility of the add to group modal and the selected group
    const [selectedUserToAdd, setSelectedUserToAdd] = useState<IUser>();
    const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);

    useEffect(() => {
        setSelectedUserToAdd(userToAdd);
        getFilteredGroup(userToAdd.id);
    }, [userToAdd])

    const handleAddUserToGroup = async (groupId: string) => {
        if (!selectedUserToAdd) {
          console.error("No user selected to add to group");
          return;
        }
        try {
          const response = await fetch('/api/groups/inviteUsers', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: accessToken } : {}),
            },
            body: JSON.stringify({
              userId: selectedUserToAdd.id,
              groupId: groupId,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to add user to group');
          }

          window.location.reload();
          onClose()
        } catch (error) {
          console.error('Error adding user to group:', error);
        }
      };

      async function getFilteredGroup (userParameterId: string) {
        if (!user) {
          console.error("User is not logged in");
          return;
        }
        try {
          // Fetch own groups
          if(userParameterId) {
            const filteredGroupsResponse = await fetch(`/api/groups/getGroupAndCheckIfUserInGroup/${user.id}/${userParameterId}`, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                ...(accessToken ? {Authorization: accessToken} : {}),
              },
            });
  
          if (filteredGroupsResponse.ok) {
            const filteredGroupsData = await filteredGroupsResponse.json();
            setFilteredGroups(Array.isArray(filteredGroupsData) ? filteredGroupsData : []);
          } else {
            setFilteredGroups([]);
          }
          }
        } catch (error) {
          console.error("Error fetching filtered groups:", error);
        }
  }

    return (

        <>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="mingle.darkPurple">
                <ModalHeader color="mingle.lightPurple">Add { userToAdd.username } to a group</ModalHeader>
                <ModalCloseButton />

                <ModalBody bg="mingle.lightPurple">
                {filteredGroups.length === 0 ? (
                    <Text>
                        There are no groups... or you invited { userToAdd.username } to every single one. How about you create a new one?
                    </Text>
                ) : (
                    filteredGroups.map(group => (
                        <Button key={group.id} bg="mingle.purple" color="mingle.darkPurple" mr={3} onClick={() => handleAddUserToGroup(group.id)}>
                            {group.name}
                        </Button>
                    ))
                )}
                </ModalBody>

                <ModalFooter>
                    <Button bg="mingle.darkPurple" color="mingle.lightPurple" _hover={{ bg: "mingle.specialPurple" }} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    );
}