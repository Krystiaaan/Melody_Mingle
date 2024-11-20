import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
  } from "@chakra-ui/react";
import { GroupInfo, IGroup } from '../../../../interfaces/Group.interface';
import { useAuth } from '../../../../providers/AuthProvider';

export const GroupMemberViewModal = ({ isOpen, onCloseSave, onClose, groupInstance }: { isOpen: boolean, onCloseSave: () => void, onClose: () => void, groupInstance: IGroup }) => {

    const {user, accessToken} = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
    const [member, setMember] = useState<GroupInfo[]>([]);

    useEffect(() => {
        setSelectedGroup(groupInstance);
        fetchGroupMembers(groupInstance);
    }, [groupInstance])

    const handleKickUser = async (groupId: string, userId: string) => {
        try {
            const response = await fetch(`/api/groups/removeUserFromGroup/${groupId}/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? {Authorization: accessToken} : {}),
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove user from group');
            }

            // Update the members state to remove the kicked user
            setMember(member.filter(memberInstance => memberInstance.User.id !== userId));
            window.location.reload();
        } catch (error) {
            console.error('Error removing user from group:', error);
        }
    };

    const fetchGroupMembers = async (group: IGroup) => {
        try {
            const response = await fetch(`/api/groups/getUserFromGroup/${group.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? {Authorization: accessToken} : {}),
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch group members');
            }
            const data = await response.json();
            setMember(data);
        } catch (error) {
            console.error('Error fetching group members:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="mingle.purple">
                <ModalHeader fontSize="2xl" color="mingle.darkPurple">Group Members</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box bg="mingle.lightPurple" p="1rem" borderRadius="0.5rem">
                        {member.map(members => (
                           <Box key={members.User.id} height="4rem">
                           {members.User.username}
                           
                           {selectedGroup && members.User.id === selectedGroup.creator ? (
                             <Button m="1rem" colorScheme="green" pointerEvents="none">
                               Admin
                             </Button>
                           ) : (
                             <Button m="1rem" colorScheme="blue" pointerEvents="none">
                               Member
                             </Button>
                           )}
                            {selectedGroup &&
                             members.User.id !== user?.id &&
                             members.User.id !== selectedGroup.creator &&
                             user?.id === selectedGroup.creator && (
                               <Button
                                 m="1rem"
                                 colorScheme="red"
                                 onClick={() => handleKickUser(selectedGroup.id, members.User.id)}
                               >
                                 Kick User
                               </Button>
                             )}
                         </Box>
                        ))}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}