import {Box, Flex, Text, Card, CardHeader, CardBody} from "@chakra-ui/react"

export const EventCard = () => {
    return <>
        <Card className="SocialCard"
            bg="mingle.purple"
            width="20em"
        >
            <CardHeader>
                <Flex gap="1em" justifyContent="center">
                    <Box bg="mingle.darkPurple" color="mingle.lightPurple" padding="2" paddingBottom="1" paddingTop="1" borderRadius="0.3em">
                        Events
                    </Box>
                </Flex>
            </CardHeader>
            <CardBody>
                <Text color="mingle.lightPurple">Find Events in your surroundings that were planned by people with your music taste! If they share your taste, there is probably a lot more to discover!</Text>
            </CardBody>
        </Card> 
    </> 
}