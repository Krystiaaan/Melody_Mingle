import {Box, Flex, Text, Card, CardHeader, CardBody} from "@chakra-ui/react"

export const SocialCard = () => {
    return <>
        <Card className="SocialCard"
            bg="mingle.purple"
            width="20em"
        >
            <CardHeader>
                <Flex gap="1em" justifyContent="center">
                    <Box bg="mingle.darkPurple" color="mingle.lightPurple" padding="2" paddingBottom="1" paddingTop="1" borderRadius="0.3em">
                        Friends
                    </Box>
                    <Box bg="mingle.lightPurple" color="mingle.darkPurple" padding="2" paddingBottom="1" paddingTop="1" borderRadius="0.3em">
                        Groups
                    </Box>
                </Flex>
            </CardHeader>
            <CardBody>
                <Text color="mingle.lightPurple">Make friends and form groups who revolve around your audible interests! How does that sound?</Text>
            </CardBody>
        </Card> 
    </>
}