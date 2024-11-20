import { Text, Flex, Image } from "@chakra-ui/react"
import melodyPNG from "../../../assets/melodyMingleWithBG.png"

export const Header = () => {
    return <>
        <Flex flexDirection="row" alignItems="center">
            <Text
                color='mingle.darkPurple'
                fontSize="3em"
                fontWeight="700"
            >
                Melody Mingle
            </Text>
            <Image src={melodyPNG} alt="Melody Mingle" width="10em" height="auto"/>
        </Flex>
        <Text 
            color="mingle.lightPurple"
            fontSize="2em"
            fontWeight="500"
        >
            Your Soundtrack to New Connections
        </Text>
    </>
} //test