import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Input,
  Text,
  VStack,
  HStack,
  Textarea,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { ShowCard } from "./ShowCard";
import { useAuth } from "../../../providers/AuthProvider";
import { calculateAge } from "../../../utils/ageCalculator";
import { UserTaste } from "../../generalComponents/UserTaste.tsx";
import axios from "axios";
import ChangeProfileImgModal from "./ChangeProfileImgModal";
import { SearchForSpotifySongModal } from "./SearchForSpotifySongModal.tsx";

export const ProfileCard: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [showCard, setShowCard] = useState(false);
  const [showUserTaste, setShowUserTaste] = useState(false);
  // State for user profile data with default empty strings
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    gender: "",
    city: "",
    state: "",
    username: "",
    genrePreferences: "",
    image: "",
    dateOfBirth: "",
    spotifyBearerToken: "",
    topTrackID: "",
  });

  // Fetch user data on component mount
  const fetchUserData = async (userId: string) => {
    if (!user || !accessToken) {
      return;
    }
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      });
      if (!response.ok) {
        console.error("User not Found");
      }
      const data = await response.json();
      const userData = Array.isArray(data) ? data[0] : data;
      setProfileData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        bio: userData.bio || "",
        gender: userData.gender || "",
        city: userData.city || "",
        state: userData.state || "",
        username: userData.username || "",
        genrePreferences: userData.genrePreferences ? userData.genrePreferences.join(", ") : "",
        image: userData.image || "",
        dateOfBirth: userData.dateOfBirth || "",
        spotifyBearerToken: userData.SpotifyAuthInfo?.access_token || "",
        topTrackID: userData.topTrackID || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData(user.id);
    }
  }, [user]);

  const [selectedImgFile, setSelectedImgFile] = useState(null);

  const handleImgFileChange = (event: { target: { files: React.SetStateAction<null>[] } }) => {
    setSelectedImgFile(event.target.files[0]);
  };

  const { onOpen: onOpenImgModal, isOpen: isImgModalOpen, onClose: onCloseImgModal } = useDisclosure();

  const {
    onOpen: onOpenSpotifyModal,
    isOpen: isSpotifyModalOpen,
    onClose: onCloseSpotifyModal,
  } = useDisclosure();

  const handleSubmitImgFile = async () => {
    const formData = new FormData();
    if (!selectedImgFile) {
      return;
    }
    formData.append("profilePicture", selectedImgFile);
    if (!user) {
      console.error("No user passed to upload picture for");
      return;
    }
    try {
      await axios.post(`/api/users/upload/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken,
        },
      });
    } catch (error) {
      console.error("Error uploading file", error);
    }
    onCloseImgModal();
    window.location.reload();
  };

  const handleSpotify = async () => {
    if (!profileData.spotifyBearerToken) {
      window.location.href = "http://localhost:3000/auth/spotify/authorize?";
    } else {
      if (!user || !accessToken) {
        return;
      }
      await fetch(`/api/spotify/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      });
      window.location.reload();
    }
  };

  const handleGenres = () => {
    if (!showUserTaste) {
      setShowUserTaste(true);
    } else {
      setShowUserTaste(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user || !accessToken) {
      return;
    }
    try {
      // Convert genrePreferences to an array
      const updatedProfileData = {
        ...profileData,
        genrePreferences: profileData.genrePreferences
          ? profileData.genrePreferences.split(",").map((item) => item.trim())
          : [],
      };

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify(updatedProfileData),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const updatedData = await response.json();
      setProfileData(updatedData);

      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  const age = calculateAge(profileData.dateOfBirth);
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      minHeight="100vh"
      p="2rem"
      gap="1em"
    >
      <Box position="relative" minHeight="100vh" p="2rem">
        <Box
          position="fixed"
          bottom="2.5rem"
          left="25%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="center"
          transform="translateX(-50%)"
        >
          {showCard && (
            <Box mr="40rem" mt="50rem">
              <ShowCard
                firstname={profileData.firstname}
                age={age}
                profilePicture={profileData.image}
                genres={profileData.genrePreferences}
                bio={profileData.bio}
                spotifyBearerToken={profileData.spotifyBearerToken}
                topTrackID={profileData.topTrackID}
              />
            </Box>
          )}
          <Button
            bg="mingle.lightPurple"
            color="mingle.darkPurple"
            borderRadius="0.5rem"
            borderWidth="0.2rem"
            borderColor="mingle.darkPurple"
            onClick={() => setShowCard(!showCard)}
          >
            {showCard ? "Hide Card" : "Show Card"}
          </Button>
        </Box>
      </Box>
      <Box mt="18rem">
        {showUserTaste && (
          <Box>
            <UserTaste
              showUserTaste={showUserTaste}
              setShowUserTaste={setShowUserTaste}
              getCalledFrom="Profile"
            />
          </Box>
        )}
      </Box>
      <Box
        bg="mingle.purple"
        p="2rem"
        borderRadius="1rem"
        boxShadow="lg"
        width="50%"
        maxWidth="50vh"
        color="white"
      >
        <HStack mb="1rem" spacing="2rem" alignItems="flex-start">
          <VStack spacing="0.5rem">
            {/*  */}
            <Avatar
              size="xl"
              bg="gray.300"
              src={user ? `/profile_pictures/${profileData.image}` : ""}
            ></Avatar>
            <Button
              bg="white"
              cursor={"pointer"}
              borderRadius="0.5rem"
              border="2px solid"
              borderColor="mingle.darkPurple"
              onClick={onOpenImgModal}
            >
              Change
            </Button>
            <ChangeProfileImgModal
              isOpen={isImgModalOpen}
              selectedFile={selectedImgFile}
              onChangeImgFile={handleImgFileChange}
              onClose={onCloseImgModal}
              onCloseSave={handleSubmitImgFile}
            />
          </VStack>
          <VStack alignItems="flex-start" spacing="0.5rem">
            <Text fontSize="2xl" fontWeight="bold" color="mingle.darkPurple">
              Edit Profile
            </Text>
            <Text fontSize="sm">
              Keep your personal data private. Information you add here will be visible to all users who
              can view your profile.
            </Text>
          </VStack>
        </HStack>
        <VStack spacing="1rem">
          <HStack spacing="1rem" width="100%">
            <Input
              name="firstname"
              placeholder="Your First Name"
              value={profileData.firstname || ""}
              onChange={handleInputChange}
              bg="white"
              color="black"
              _placeholder={{ color: "#E0E0E0" }}
              borderRadius="0.5rem"
            />
            <Input
              name="lastname"
              placeholder="Your Last Name"
              value={profileData.lastname || ""}
              onChange={handleInputChange}
              bg="white"
              color="black"
              _placeholder={{ color: "#E0E0E0" }}
              borderRadius="0.5rem"
            />
          </HStack>
          <Textarea
            name="bio"
            placeholder="Your Description"
            value={profileData.bio || ""}
            onChange={handleInputChange}
            bg="white"
            color="black"
            _placeholder={{ color: "#E0E0E0" }}
            borderRadius="0.5rem"
          />
          <HStack spacing="1rem" width="100%">
            <Input
              name="city"
              placeholder="Your City"
              value={profileData.city || ""}
              onChange={handleInputChange}
              bg="white"
              color="black"
              _placeholder={{ color: "#E0E0E0" }}
              borderRadius="0.5rem"
            />
            <Input
              name="state"
              placeholder="Your State"
              value={profileData.state || ""}
              onChange={handleInputChange}
              bg="white"
              color="black"
              _placeholder={{ color: "#E0E0E0" }}
              borderRadius="0.5rem"
            />
          </HStack>
          <HStack spacing="1rem" width="100%">
            <Button
              width="100%"
              bg="mingle.lightPurple"
              color="black"
              border="2px solid"
              borderColor="mingle.darkPurple"
              borderRadius="0.5rem"
              onClick={() => handleGenres()}
            >
              Your Genres
            </Button>
            <Input
              name="genrePreferences"
              placeholder="Your Genre Preferences"
              value={profileData.genrePreferences || ""}
              onChange={handleInputChange}
              bg="white"
              color="black"
              borderRadius="0.5rem"
            />
          </HStack>
          <SearchForSpotifySongModal
            isOpen={isSpotifyModalOpen}
            onClose={onCloseSpotifyModal}
            onCloseSave={onCloseSpotifyModal}
            spotifyAccessToken={profileData.spotifyBearerToken}
          />
          <Button
            width="100%"
            bg="#212121"
            color="#1DB954"
            border="2px solid"
            borderColor="#1DB954"
            borderRadius="0.5rem"
            onClick={() => handleSpotify()}
          >
            {profileData.spotifyBearerToken === "" ? "Connect To Spotify" : "Connected ✓"} 
          </Button>
          <Text fontSize="sm" textAlign="center" color="whiteAlpha.700">
            Use your Spotify data to access your favorite artists and songs from the convenience of
            Melody Mingle and use it to fill your profile!
          </Text>
          {profileData.spotifyBearerToken && (
            <Button
              width="100%"
              bg="mingle.lightPurple"
              color="black"
              border="2px solid"
              borderColor="mingle.darkPurple"
              borderRadius="0.5rem"
              onClick={onOpenSpotifyModal}
            >
              Select Your Favorite Song
            </Button>
          )}
        </VStack>
        <Center mt="1rem">
          <Button
            bg="mingle.lightPurple"
            color="mingle.darkPurple"
            mr="1rem"
            border="2px solid"
            borderColor="mingle.darkPurple"
            borderRadius="0.5rem"
          >
            Reset Changes
          </Button>
          <Button
            bg="mingle.lightPurple"
            color="mingle.darkPurple"
            border="2px solid"
            borderColor="mingle.darkPurple"
            borderRadius="0.5rem"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Center>
      </Box>
    </Box>
  );
};
