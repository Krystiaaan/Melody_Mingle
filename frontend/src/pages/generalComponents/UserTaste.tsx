import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

import { GenreButton } from "./GenreButton.tsx";
import { useLoginStore } from "../../stores/login.store.ts";

// Images
import PopIcon from "../../assets/genres/genreIcons/Pop_Icon.png";
import EightiesIcon from "../../assets/genres/genreIcons/80s_Icon.png";
import NinetiesIcon from "../../assets/genres/genreIcons/90s_Icon.png";
import ClassicalIcon from "../../assets/genres/genreIcons/Classical_Icon.png";
import DrumAndBassIcon from "../../assets/genres/genreIcons/DrumAndBass_Icon.png";
import CountryIcon from "../../assets/genres/genreIcons/Country_Icon.png";
import ElectronicIcon from "../../assets/genres/genreIcons/Electronic_Icon.png";
import HipHopIcon from "../../assets/genres/genreIcons/HipHop_Icon.png";
import JazzIcon from "../../assets/genres/genreIcons/Jazz_Icon.png";
import K_PopIcon from "../../assets/genres/genreIcons/K-Pop_Icon.png";
import RnBIcon from "../../assets/genres/genreIcons/R&B_Icon.png";
import ReggaeIcon from "../../assets/genres/genreIcons/Reggae_Icon.png";
import SoulIcon from "../../assets/genres/genreIcons/Soul_Icon.png";
import TechnoIcon from "../../assets/genres/genreIcons/Techno_Icon.png";

import z from "zod";
import { useApiClient } from "../../adapter/api/useApiClient.ts";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const UserTasteSchema = z.object({
  genrePreferences: z.array(z.string()),
});

export type UserTasteData = {
  genrePreferences: string[];
};

const initialFormValues: UserTasteData = {
  genrePreferences: [],
};

type UserTasteProps = {
  showUserTaste: boolean;
  setShowUserTaste: (value: boolean) => void;
  getCalledFrom: string;
};

export const UserTaste = ({ showUserTaste, setShowUserTaste, getCalledFrom }: UserTasteProps) => {
  const loginStore = useLoginStore();
  const client = useApiClient();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const onSubmitRegisterForm = async () => {
    const body = {
      genrePreferences: selectedGenres,
    };
    const userID = getCalledFrom == "Register" ? loginStore.userID : user?.id || "No user found";
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    try {
      await client.putUsersUserId(userID, accessToken, { data: body });
    } catch (error) {
      console.error("Error adding user taste", error);
      return;
    }
    if (getCalledFrom == "Register") {
      navigate("/melodymingle");
    }
    setShowUserTaste(false);
  };

  const MIN_GENRES = 3; // Minimum amount of genres user has to pick
  const MAX_GENRES = 10; // Maximum amount of genres user can pick

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleGenreClick = (genreName: string) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter((name) => name !== genreName));
    } else if (selectedGenres.length < MAX_GENRES) {
      setSelectedGenres([...selectedGenres, genreName]);
    }
  };

  const genreButtons = [
    { icon: PopIcon, genreName: "Pop" },
    { icon: HipHopIcon, genreName: "Hip Hop" },
    { icon: RnBIcon, genreName: "RnB" },
    { icon: JazzIcon, genreName: "Jazz" },
    { icon: K_PopIcon, genreName: "K-Pop" },
    { icon: EightiesIcon, genreName: "80s" },
    { icon: NinetiesIcon, genreName: "90s" },
    { icon: ClassicalIcon, genreName: "Classical" },
    { icon: TechnoIcon, genreName: "Techno" },
    { icon: SoulIcon, genreName: "Soul" },
    { icon: ReggaeIcon, genreName: "Reggae" },
    { icon: ElectronicIcon, genreName: "Electronic" },
    { icon: DrumAndBassIcon, genreName: "Drum 'n Bass" },
    { icon: CountryIcon, genreName: "Country" },
  ];

  const getInvisible = () => {
    window.location.reload();
    showUserTaste = false;
  };

  if (!showUserTaste) {
    return null; // Return null if showUserTaste is false
  }

  if (getCalledFrom == "Register") {
    return (
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="50em">
        <Flex flexDirection="column" gap="2em" marginTop="1em">
          <ArrowBackIcon
            fontSize="2em"
            onClick={() => {
              loginStore.setRegisterState("userGender");
            }}
            style={{ cursor: "pointer" }}
          />
          <Flex justifyContent="center">
            <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
              What do you listen to?
            </Text>
          </Flex>
          <Formik<UserTasteData>
            initialValues={initialFormValues}
            onSubmit={onSubmitRegisterForm}
            validationSchema={toFormikValidationSchema(UserTasteSchema)}
          >
            {(formik) => (
              <Form>
                <Box
                  height="16em"
                  overflowY="auto"
                  borderColor="mingle.darkPurple"
                  borderWidth="0.2em"
                  borderRadius="1em"
                  padding="1em"
                  bg={"mingle.lightPurple"}
                >
                  <Flex gap="1em" justifyContent="center" wrap="wrap">
                    {genreButtons.map((genre, index) => (
                      <GenreButton
                        key={index}
                        icon={genre.icon}
                        genreName={genre.genreName}
                        isSelected={selectedGenres.includes(genre.genreName)}
                        onClick={() => handleGenreClick(genre.genreName)}
                        data-cy={genre.genreName}
                      />
                    ))}
                  </Flex>
                </Box>
                <Flex paddingTop="1em" justifyContent="center">
                  <Button
                    type={"submit"}
                    bg="mingle.darkPurple"
                    color="mingle.lightPurple"
                    width="8em"
                    _hover={{ bg: "mingle.specialPurple" }}
                    isDisabled={selectedGenres.length < MIN_GENRES}
                  >
                    {selectedGenres.length < MIN_GENRES
                      ? `Pick ${MIN_GENRES - selectedGenres.length} more`
                      : "Finish"}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Flex flexDirection="column" alignItems="center">
            <Flex gap="1rem">
              <Text
                fontSize="4xl"
                color="mingle.lightPurple"
                onClick={() => {
                  loginStore.setRegisterState("initRegister");
                }}
                style={{ cursor: "pointer" }}
              >
                ⬤
              </Text>
              <Text
                fontSize="4xl"
                color="mingle.lightPurple"
                onClick={() => {
                  loginStore.setRegisterState("userDetails");
                }}
                style={{ cursor: "pointer" }}
              >
                ⬤
              </Text>
              <Text
                fontSize="4xl"
                color="mingle.lightPurple"
                onClick={() => {
                  loginStore.setRegisterState("userGender");
                }}
                style={{ cursor: "pointer" }}
              >
                ⬤
              </Text>
              <Text fontSize="4xl" color="mingle.darkPurple">
                ⬤
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    );
  }

  if (getCalledFrom == "Profile") {
    return (
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="34em">
        <Flex flexDirection="column" gap="2em" marginTop="1em">
          <Flex justifyContent="center">
            <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
              What do you listen to?
            </Text>
          </Flex>
          <Formik<UserTasteData>
            initialValues={initialFormValues}
            onSubmit={onSubmitRegisterForm}
            validationSchema={toFormikValidationSchema(UserTasteSchema)}
          >
            {(formik) => (
              <Form>
                <Box
                  height="16em"
                  overflowY="auto"
                  borderColor="mingle.darkPurple"
                  borderWidth="0.2em"
                  borderRadius="1em"
                  padding="1em"
                  bg={"mingle.lightPurple"}
                >
                  <Flex gap="1em" justifyContent="center" wrap="wrap">
                    {genreButtons.map((genre, index) => (
                      <GenreButton
                        key={index}
                        icon={genre.icon}
                        genreName={genre.genreName}
                        isSelected={selectedGenres.includes(genre.genreName)}
                        onClick={() => handleGenreClick(genre.genreName)}
                      />
                    ))}
                  </Flex>
                </Box>
                <Flex paddingTop="1em" justifyContent="center">
                  <Button
                    type={"submit"}
                    bg="mingle.darkPurple"
                    color="mingle.lightPurple"
                    width="8em"
                    _hover={{ bg: "mingle.specialPurple" }}
                    isDisabled={selectedGenres.length < MIN_GENRES}
                    onClick={() => getInvisible()}
                  >
                    {selectedGenres.length < MIN_GENRES
                      ? `Pick ${MIN_GENRES - selectedGenres.length} more`
                      : "Finish"}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      </Box>
    );
  }
};
