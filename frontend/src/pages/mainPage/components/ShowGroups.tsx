import React, { useState, useEffect } from 'react';
import {
    Button,
    Center,
    useDisclosure,
    Text,
    Flex
} from '@chakra-ui/react';
import ChatWindowGroup  from './ChatWindowGroup';
import { IGroup, GroupInfo, IShowGroupsProps } from '../../../interfaces/Group.interface';
import { GroupMemberViewModal } from './modals/GroupMemberViewModal';

const ShowGroups: React.FC<IShowGroupsProps> = ({user, accessToken, ownGroups }) => {
    const [otherGroups, setOtherGroups] = useState<IGroup[] | null>([]);
    const [selectedGroupForChat, setSelectedGroupForChat] = useState<IGroup | null>(null);
    const [selectedGroupForModal, setSelectedGroupForModal] = useState<IGroup | null>(null);

    const {
        onOpen: onMemberViewOpen,
        isOpen:  isMemberViewOpen,
        onClose: onMemberViewClose,
      } = useDisclosure();


    const handleChatOpen = (group: IGroup) => {
        setSelectedGroupForChat(group);
    };

    const handleMemberViewOpen = (group: IGroup) => {
        setSelectedGroupForModal(group);
        onMemberViewOpen();
    };

    const handleLeaveGroup = async (groupId: string) => {
        try {
            const response = await fetch(`/api/groups/removeUserFromGroup/${groupId}/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: accessToken } : {}),
                }
            });

            if (!response.ok) {
                throw new Error('Failed to leave group');
            }

            // Update the otherGroups state to remove the left group
            if(otherGroups) {
                setOtherGroups(otherGroups.filter(group => group.id !== groupId));
            }
            window.location.reload();

        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        try {
            const response = await fetch(`/api/groups/${groupId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: accessToken } : {}),
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete group');
            }

            // Update the ownGroups state to remove the deleted group
            if(otherGroups) {
            setOtherGroups(otherGroups.filter(group => group.id !== groupId));
            }
            window.location.reload();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user) {
                console.error("User is not logged in");
                return;
            }
            // Fetch other groups
            try {
                const otherGroupsResponse = await fetch(`/api/groups/getGroup/${user.id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        ...(accessToken ? { Authorization: accessToken } : {}),
                    },
                });
                if (otherGroupsResponse.ok) {
                    const otherGroupsData = await otherGroupsResponse.json();
                    let groupArray = otherGroupsData.map((g: GroupInfo) => g.Group);
                    groupArray = groupArray.filter((g: IGroup) => g.creator !== user.id);
                    setOtherGroups(Array.isArray(groupArray) ? groupArray: []);
                } else {
                    setOtherGroups([]);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
                setOtherGroups([]);
            }
    }
        fetchGroups();
    }, [user, accessToken]);

    return (
        <>
        <Flex margin="auto" justifyContent="center">
            <Text fontSize="2xl" fontWeight="bold" mb="1rem" color="mingle.darkPurple">
                Own Groups
            </Text>
        </Flex>
        <Flex flexDirection="column">
            {Array.isArray(ownGroups) && ownGroups.map(group => (
                <Center key={group.id}>
                    <Button onClick={() => handleMemberViewOpen(group)}
                        width="25%"
                        bg="mingle.lightPurple"
                        color="mingle.darkPurple"
                        m="0.4rem"
                        _hover={{ bg: "mingle.hoverLight" }}
                    >
                        Members
                    </Button>
                    <Button
                        onClick={() => handleChatOpen(group)}
                        width="50%"
                        bg="mingle.lightPurple"
                        color="mingle.darkPurple"
                        m="0.4rem"
                        _hover={{ bg: "mingle.hoverLight" }}
                    >
                        {group.name}
                    </Button>
                    <Button
                        onClick={() => handleDeleteGroup(group.id)}
                        width="25%"
                        bg="red.300"
                        color="black"
                        m="0.4rem"
                        _hover={{ bg: "red.700" }}
                    >
                        Delete
                    </Button>
                </Center>
            ))}
        </Flex>
        <Flex margin="auto" justifyContent="center">
            <Text fontSize="2xl" fontWeight="bold" mb="1rem" color="mingle.darkPurple" mt="2rem">
                Other Groups
            </Text>
        </Flex>
        {otherGroups && otherGroups.map(group => (
            <Center key={group.id}>
                <Button onClick={() => handleMemberViewOpen(group)}
                    width="25%"
                    bg="mingle.lightPurple"
                    color="mingle.darkPurple"
                    _hover={{ bg: "mingle.hoverLight" }}
                    m="0.4rem"
                >Members</Button>
                <Button
                    onClick={() => handleChatOpen(group)}
                    width="50%"
                    bg="mingle.lightPurple"
                    color="mingle.darkPurple"
                    _hover={{ bg: "mingle.hoverLight" }}
                    m="0.4rem"
                >
                    {group.name}
                </Button>
                <Button
                    onClick={() => handleLeaveGroup(group.id)}
                    width="25%"
                    bg="yellow.300"
                    color="black"
                    _hover={{ bg: "red.700" }}
                    m="0.4rem"
                >
                    Leave
                </Button>
            </Center>
        ))}
        {selectedGroupForModal && (
            <GroupMemberViewModal 
                isOpen={isMemberViewOpen} 
                onClose={onMemberViewClose} 
                onCloseSave={onMemberViewClose} 
                groupInstance={selectedGroupForModal} 
            />
        )}
        {selectedGroupForChat && (
            <ChatWindowGroup
                loggedInUser={user}
                selectedUser={user}
                selectedGroupForChat={selectedGroupForChat}
                onClose={() => setSelectedGroupForChat(null)}
            />
        )}
    </>
    );
};

export default ShowGroups;