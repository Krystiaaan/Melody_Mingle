import {Text, ListItem, OrderedList, Card, CardHeader, CardBody } from "@chakra-ui/react"

export const ExplanationCard = () => {
    return <>
        <Card className="ExplanationCard"
            bg="mingle.purple"
            width="30em"
        >
            <CardHeader>
                <Text color="mingle.darkPurple" fontSize="1.8em" fontWeight="700">How does it work?</Text>
            </CardHeader>
            <CardBody>
                <OrderedList
                    color="mingle.lightPurple" 
                >
                    <ListItem>Create a Profile: Sign up and create your personal music profile. Share your favorite artists, albums, and genres!</ListItem>    
                    <ListItem>Discover Music: Browse other users' profiles, discover new music, and find people who share your taste!</ListItem>
                    <ListItem>Mingle & Connect: Start conversations, exchange playlists, and form musical friendships!</ListItem>
                </OrderedList>   
            </CardBody>
        </Card> 
    </>
}