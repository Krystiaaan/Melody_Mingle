import { useState } from "react";
import { Flex, Text, Spacer, Image, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { ProfileDrawer } from "../profilePage/components/ProfileDrawer";
// Images
import melodyMinglePNG from "../../assets/melodyMingleWithBG.png";
import messengerPNG from "../../assets/icons/messengerIcon.png";
import userPNG from "../../assets/icons/userIcon.png";

import { EventsDrawer } from "../mainPage/components/EventsDrawer";
import { FriendsDrawer } from "../mainPage/components/FriendsDrawer";
import { CreateEventModal } from "../mainPage/components/modals/CreateEventModal";

export const Navbar = () => {
  const [_, setActiveDrawer] = useState<"events" | "friends" | "profile" | null>(null);
  const navigate = useNavigate();
  const { isOpen: isEventsOpen, onOpen: onEventsOpen, onClose: onEventsClose } = useDisclosure();

  const { isOpen: isFriendsOpen, onOpen: onFriendsOpen, onClose: onFriendsClose } = useDisclosure();

  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const handleDrawerToggle = (drawer: "events" | "friends" | "profile") => {
    if (drawer === "events") {
      if (isEventsOpen) {
        onEventsClose();
        setActiveDrawer(null);
      } else {
        if (isFriendsOpen) onFriendsClose();
        onEventsOpen();
        setActiveDrawer("events");
      }
    } else if (drawer === "friends") {
      if (isFriendsOpen) {
        onFriendsClose();
        setActiveDrawer(null);
      } else {
        if (isEventsOpen) onEventsClose();
        onFriendsOpen();
        setActiveDrawer("friends");
      }
    } else if (drawer === "profile") {
      if (isProfileOpen) {
        onProfileClose();
        setActiveDrawer(null);
      } else {
        if (isProfileOpen) onProfileClose();
        onProfileOpen();
        setActiveDrawer("profile");
      }
    }
  };

  return (
    <Flex
      position={"fixed"}
      width={"100%"}
      as="nav"
      color="white"
      align="center"
      justify="space-between"
      backgroundColor={"#424874"}
      padding="0"
      margin="0"
    >
      <Image
        src={melodyMinglePNG}
        alt="Melody Mingle Logo"
        height="50px"
        cursor={"pointer"}
        onClick={() => navigate("/melodymingle")}
      />
      <Text fontSize="xl" fontWeight="bold" ml="2rem" cursor={"pointer"} onClick={() => navigate("/melodymingle") }>
        Discover
      </Text>
      <Text
        fontSize="xl"
        fontWeight="bold"
        ml="2rem"
        cursor="pointer"
        onClick={() => handleDrawerToggle("events")}
      >
        Events
      </Text>
      <Spacer />
      <Flex align="center">
        <Image
          src={messengerPNG}
          alt="Messenger"
          height="30px"
          mr="1rem"
          cursor="pointer"
          onClick={() => handleDrawerToggle("friends")}
        />
        <Image
          src={userPNG}
          alt="User"
          height="30px"
          mr="2rem"
          cursor={"pointer"}
          onClick={() => handleDrawerToggle("profile")}
        />
      </Flex>
      <EventsDrawer isOpen={isEventsOpen} onClose={onEventsClose} onOpenModal={onModalOpen} />
      <FriendsDrawer isOpen={isFriendsOpen} onClose={onFriendsClose} />
      <ProfileDrawer isOpen={isProfileOpen} onClose={onProfileClose} />
      <CreateEventModal isOpen={isModalOpen} onClose={onModalClose} />
    </Flex>
  );
};
