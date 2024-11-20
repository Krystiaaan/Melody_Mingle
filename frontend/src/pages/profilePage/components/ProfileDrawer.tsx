import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Center,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";



// Images
import arrowRightPNG from "../../../assets/icons/right.png";
import userIconPNG from "../../../assets/icons/userIcon.png";

import { useAuth } from "../../../providers/AuthProvider";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
  
export const ProfileDrawer: React.FC<ProfileDrawerProps>= ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, onLogout } = useAuth();

  const handleSettingsClick = () => {
    navigate('/profile');
    onClose(); 
  };

  const handleIssueClick = () => {
    navigate('/issue');
    onClose(); 
  }

  const handleTacClick = () => {
    navigate('/toc');
    onClose(); 
  }
  
  const handleLogoutClick = () => {
    onLogout();
    onClose();
    navigate('/');
  };
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerContent
        mt="4rem"
        maxWidth="25rem"
        width="25rem"
        bg="mingle.purple"
        color="black"
        borderRadius="1rem"
        borderStyle="none"
        mb="20rem"
        ml="auto"
        mr="1rem"
      >
        <DrawerHeader display="flex" flexDirection="column" alignItems="center" p="1rem">
          <Image src={userIconPNG} borderRadius="full" boxSize="3.125rem" mb="0.625rem" />
          <Box
            bg="mingle.lightPurple"
            borderRadius="md"
            p="0.625rem"
            textAlign="center"
            mb="1.25rem"
            width="100%"
            color="mingle.darkPurple"
          >
            <Text fontWeight="bold">{`${user?.username}`}</Text>
            <Text>{user?.eMail}</Text>
          </Box>
        </DrawerHeader>
        <DrawerBody>
          <Center>
            <Button
              width="80%"
              bg="mingle.lightPurple"
              color="mingle.darkPurple"
              mb="0.9375rem"
              pb="0.625rem"
              pt="0.625rem"
              _hover={{ bg: "mingle.hoverLight" }}
              borderRadius="0.3125rem"
              onClick={handleSettingsClick}
            >
              Settings
            </Button>
          </Center>
          <Center>
            <Button
              width="80%"
              bg="mingle.lightPurple"
              color="mingle.darkPurple"
              mb="0.9375rem"
              pb="0.625rem"
              pt="0.625rem"
              _hover={{ bg: "mingle.hoverLight" }}
              borderRadius="0.3125rem"
              onClick={handleIssueClick}
            >
              Report an Issue
            </Button>
          </Center>
          <Center>
            <Button
              width="80%"
              bg="mingle.lightPurple"
              color="mingle.darkPurple"
              mb="0.9375rem"
              pb="0.625rem"
              pt="0.625rem"
              _hover={{ bg: "mingle.hoverLight" }}
              borderRadius="0.3125rem"
              onClick={handleTacClick}
            >
              Terms and Conditions
            </Button>
          </Center>
          <Center>
            <Button
              width="80%"
              bg="mingle.lightPurple"
              color="mingle.darkPurple"
              mb="0.9375rem"
              pb="0.625rem"
              pt="0.625rem"
              _hover={{ bg: "mingle.hoverLight" }}
              borderRadius="0.3125rem"
              onClick={handleLogoutClick}
            >
              Sign Out
            </Button>
          </Center>
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
    </Drawer>
  );
};


