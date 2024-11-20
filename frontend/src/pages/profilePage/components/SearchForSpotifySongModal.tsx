import { SearchIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    Grid,
    Text,
  } from "@chakra-ui/react";
import { useState } from "react";
import { ISpotifySong } from "../../../interfaces/Spotify.Interface";
import axios from "axios";
import { useApiClient } from "../../../adapter/api/useApiClient";
import { useAuth } from "../../../providers/AuthProvider";
  
export function SearchForSpotifySongModal({ isOpen, onCloseSave, onClose, spotifyAccessToken}: { isOpen: boolean, onCloseSave: () => void, onClose: () => void, spotifyAccessToken: string }) {
    const [searchInput, setSearchInput] = useState("");
    const [topTracks, setTopTracks] = useState<ISpotifySong[] | undefined>();

    const client = useApiClient();
    const { accessToken, user } = useAuth();

    const handleSearch = async () => {
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + spotifyAccessToken
            }
        }   

        try {
            const { data: artistData } = await axios.get('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
            const { data: tracksData } = await axios.get('https://api.spotify.com/v1/artists/' + artistData.artists.items[0].id + '/top-tracks', searchParameters)
            setTopTracks(tracksData.tracks);
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    const saveTopTrack = async (topTrack: ISpotifySong) => {
        try {
            if(!accessToken || !user) return
            await client.putUsersUserId(user.id, accessToken, { data: { topTrackID: topTrack.id } });
          } catch (error) {
            console.error("Error adding top track", error);
        }
        onClose()
        window.location.reload();
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="0rem">
                <ModalOverlay />
                <ModalContent bg="mingle.purple" width="70rem" h="40rem">
                    <ModalHeader color="mingle.lightPurple">Select your favorite Song to display on Melody Mingle</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody bg="mingle.lightPurple">
                    <Box width="100%" maxW="md" mx="auto" my={4}>
                        <InputGroup>
                            <Input 
                                placeholder="Search..." 
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)} 
                                onKeyDown={handleKeyDown}  />
                            <InputRightElement>
                            <IconButton
                                aria-label="Search"
                                icon={<SearchIcon />}
                                onClick={() => { 
                                    handleSearch();
                                }}
                            />
                            </InputRightElement>
                        </InputGroup>
                        <Text bg="mingle.darkPurple" p="0.5rem" m="0.5rem" borderRadius="0.5rem" color="mingle.lightPurple">
                                The search only really works by searching an artist name. Keep that in mind!
                        </Text>
                    </Box>  
                    <Box overflow={'auto'} h="40rem" p="1rem" borderWidth="0.3rem" borderColor="mingle.darkPurple" borderRadius="1rem">
                        <Grid
                            templateRows='repeat(5, 1fr)'
                            templateColumns='repeat(2, 1fr)'
                            gap="1rem"
                        >
                            {topTracks && topTracks.map((topTrack) => {
                                return (
                                    <Box key={topTrack.id} bg="mingle.purple" p="1rem" borderRadius="0.5rem">
                                        <iframe key={topTrack.id} src={`https://open.spotify.com/embed/track/${topTrack.id}?utm_source=generator`} width="100%" height="150" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"></iframe>
                                        <Button 
                                            bg="mingle.lightPurple" 
                                            p="1rem" 
                                            borderRadius="0.5rem" 
                                            width="100%" 
                                            onClick={ async () => {
                                                await saveTopTrack(topTrack);
                                            }}
                                        >
                                            Select
                                        </Button>
                                    </Box>
                                )
                            })}
                        </Grid>
                    </Box>
                    </ModalBody>
                    {/* <ModalFooter bg="mingle.purple">
                        <Button bg="mingle.lightPurple" mr={3} onClick={onCloseSave}>
                        Save
                        </Button>
                        <Button bg="mingle.darkPurple" color="mingle.lightPurple" _hover={{ bg: "mingle.specialPurple" }} onClick={onClose}>Cancel</Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    );
}