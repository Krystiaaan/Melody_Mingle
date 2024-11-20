import React, { useState, useEffect } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Center,
  Image,
  Box,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import ChatWindow from "./ChatWindow";
import ShowGroups from "./ShowGroups";
import { CreateGroupModal } from "./modals/CreateGroupModal.tsx";

// Images
import arrowRightPNG from "../../../assets/icons/right.png";
import { IUser } from "../../../interfaces/User.interface.ts";
import { IGroup } from "../../../interfaces/Group.interface.ts";
import { AddMinglerToGroupModal } from "./modals/AddMinglerToGroupModal.tsx";

interface FriendsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsDrawer: React.FC<FriendsDrawerProps> = ({ isOpen, onClose }) => {
  const [matches, setMatches] = useState<IUser[]>([]);
  const {user} = useAuth();
  const {accessToken} = useAuth();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [ownGroups, setOwnGroups] = useState<IGroup[]>([]);
  const [userToAdd, setUserToAdd] = useState<IUser | null>(null);

  const {
    onOpen: onOpenAddToGroupModal,
    isOpen: isAddToGroupModalOpen,
    onClose: onCloseAddToGroupModal,
  } = useDisclosure();
  
  const {
    onOpen: onOpenGroupModal,
    isOpen: isGroupModalOpen,
    onClose: onCloseGroupModal,
  } = useDisclosure();

  async function undoSwipe(targetUserId: string) {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    try {
      const response = await fetch("/api/matches", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? {Authorization: accessToken} : {}),
        },
        body: JSON.stringify({
          userA: user.id,
          userB: targetUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to undo swipe");
      }

      const data = await response.json();
      window.location.reload();

    } catch (error) {
      console.error("Error undoing swipe:", error);
    }
  }

  useEffect(() => {
    const fetchOwnGroups = async () => {
      if (!user) {
        return;
      }
    try {
      // Fetch own groups
      const ownGroupsResponse = await fetch(`/api/groups/findGroup/${user.id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? {Authorization: accessToken} : {}),
        },
      });
      if (ownGroupsResponse.ok) {
        const ownGroupsData = await ownGroupsResponse.json();
        setOwnGroups(Array.isArray(ownGroupsData) ? ownGroupsData : []);
      } else {
        setOwnGroups([]);
      }
    } catch (error) {
      console.error("Error fetching own groups:", error);
      setOwnGroups([]);
    }
  };
    fetchOwnGroups();
  }, [user, accessToken]);

  useEffect(() => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    const fetchUsersAndCheckMatches = async () => {
      try {
        if (!accessToken) {
          return;
        }
        const usersResponse = await fetch(`/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        });
        let fetchedUsers = await usersResponse.json();
        if (user) {
          fetchedUsers = fetchedUsers.filter((u: IUser) => u.id !== user.id);
        }

        for (const userB of fetchedUsers) {
          const matchResponse = await fetch(
            `/api/matches/checkMatch?userA=${encodeURIComponent(user.id)}&userB=${encodeURIComponent(userB.id)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: accessToken } : {}),
              },
            }
          );
          if (matchResponse.ok) {
            const matchData = await matchResponse.json();
            if (matchData.AhasMatchedB.length > 0 && matchData.BhasMatchedA.length > 0) {
              // Check if userB is already in matches to avoid duplicates
              setMatches((prevMatches) => {
                const isUserAlreadyMatched = prevMatches.find((match) => match.id === userB.id);
                if (!isUserAlreadyMatched) {
                  return [...prevMatches, userB];
                }
                return prevMatches;
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch users or check matches:", error);
      }
    };

    if (isOpen) {
      fetchUsersAndCheckMatches();
    }
  }, [user, isOpen, accessToken]);

  const [view, setView] = useState<"minglers" | "groups">("minglers");
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerContent
          mt="4rem"
          position="absolute"
          maxWidth="25%"
          width="25%"
          bg="mingle.purple"
          color="black"
          borderRadius="1rem"
          mb="2rem"
        >
          <DrawerHeader textAlign={"center"} p={"15px"}>
            <Button
              onClick={() => setView("minglers")}
              width="25%"
              bg={view === "minglers" ? "mingle.lightPurple" : "mingle.darkPurple"}
              color={view === "minglers" ? "mingle.darkPurple" : "mingle.lightPurple"}
              m="0.4rem"
              textAlign={"center"}
            >
              Minglers
            </Button>
            <Button
              onClick={() => {
                setView("groups")
                onCloseAddToGroupModal()
                setSelectedUser(null)
              }}
              width="25%"
              bg={view === "groups" ? "mingle.lightPurple" : "mingle.darkPurple"}
              color={view === "groups" ? "mingle.darkPurple" : "mingle.lightPurple"}
              m="0.4rem"
              textAlign={"center"}
            >
              Groups
            </Button>
          </DrawerHeader>
          <DrawerBody>
            {view === "minglers" ? (
              <>
                {/* Minglers view content */}
                <Flex margin="auto" justifyContent="center">
                  <Text fontSize="2xl" fontWeight="bold" mb="1rem" color="mingle.darkPurple">
                    Mingler List
                  </Text>
                </Flex>
                {matches.map((userB) => (
                  <Center key={userB.id}>
                    <Button
                        onClick={() => {
                          setUserToAdd(userB);
                          onOpenAddToGroupModal();
                        }}
                        bg="mingle.lightPurple"
                        color="mingle.darkPurple"
                        m="0.4rem"
                        _hover={{ bg: "mingle.hoverLight" }}
                        borderRadius="5px"
                        borderStyle={"none"}
                    >
                      Add To Group
                    </Button>
                    <Button
                      width="50%"
                      bg="mingle.lightPurple"
                      color="mingle.darkPurple"
                      m="0.4rem"
                      _hover={{ bg: "mingle.hoverLight" }}
                      onClick={() => setSelectedUser(userB)}
                    >
                      {userB.username} {}
                    </Button>
                    <Button
                      width="25%"
                      bg="red.300"
                      color="black"
                      m="0.4rem"
                      _hover={{ bg: "red.700" }}
                      onClick={() => undoSwipe(userB.id)}
                    >
                      Undo Like
                    </Button>
                  </Center>
                ))}
              </>
            ) : (
              <>
                {user && <ShowGroups
                    user={user}
                    accessToken={accessToken}
                    ownGroups={ownGroups}
                />}
                <Flex justifyContent="center" mt="10%">
                  <Button
                      onClick={() => onOpenGroupModal()}
                      width="50%"
                      bg="mingle.darkPurple"
                      color="mingle.hoverLight"
                      mb="0.3rem"
                      pb="0.3rem"
                      pt="0.3rem"
                      _hover={{ bg: "mingle.specialPurple" }}
                      borderRadius="0.3rem"
                      borderStyle={"none"}
                  >
                      New Group
                  </Button>
                </Flex>
              </>
            )}
            
          <Flex position="relative" alignContent="center">
            {selectedUser != null && user != null ? (
              <ChatWindow
                loggedInUser={user}
                selectedUser={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            ) : null}
          </Flex>
          {userToAdd && (
            <AddMinglerToGroupModal
              isOpen={isAddToGroupModalOpen}
              onClose={onCloseAddToGroupModal}
              onCloseSave={onCloseAddToGroupModal}
              userToAdd={userToAdd}
            />
          )}
          </DrawerBody>
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
              <Image src={arrowRightPNG} boxSize="1.25rem" />
            </Button>
          </Center>
        </DrawerContent>
        <CreateGroupModal isOpen={isGroupModalOpen} onCloseSave={onCloseGroupModal} onClose={onCloseGroupModal} />
      </Drawer>
    </>
  );
};

