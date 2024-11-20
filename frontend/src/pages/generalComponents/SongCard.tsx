import { Box, Button, Flex, Img, Text } from "@chakra-ui/react"
import { ISpotifySong } from "../../interfaces/SpotifyTrack.Interface";

interface SongCardProps {
    topTrack: ISpotifySong
  }

  export const SongCard: React.FC<SongCardProps> = ({
    topTrack
  }) => {

    return (
        <Box
            bg="mingle.specialPurple"
            flex="1rem"
            width="30rem"
            height="7rem"
            p="0.8rem"
            borderColor="mingle.darkPurple" 
            borderRadius="0.5em"
            borderWidth="0.2em"
            color="mingle.darkPurple"
            textAlign="left"
        >
            <Flex flexDirection="row" gap="1rem">
                <Img src={topTrack.album.images[0].url} width="5rem" height="5rem"/>
                <Flex flexDirection="column" gap="0.2rem" width="14rem">
                    <Text>{topTrack.artists[0].name}</Text>
                    <Text>{topTrack.name}</Text>
                </Flex>
                <Flex flexDirection="column" gap="0.5rem" justifyContent="center" width="100%" align="center">
                    <Button bg="mingle.darkPurple" width="4rem">&#9654;</Button>
                    <Flex align="center" justify="center" flexDirection="row">
                        <Text padding="0.4rem" >0:00</Text>
                        <Box
                            height="0.2rem"
                            bg="mingle.darkPurple"
                            position="relative"
                            top={0}
                            left={0}
                            width="10rem"
                        />
                        <Text padding="0.4rem">2:16</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}