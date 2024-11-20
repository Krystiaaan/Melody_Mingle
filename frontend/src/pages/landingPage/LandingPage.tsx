import { BaseLayout } from "../../layout/BaseLayout"

// setup Link compatibility between links used by react and the link element of chakra
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, Flex } from "@chakra-ui/react"

import { Header } from "./components/Header"
import { ExplanationCard } from "./components/ExplanationCard"
import { SocialCard } from './components/SocialCard'
import { RegisterCard } from './components/RegisterCard'
import { LoginCard } from './components/LoginCard'
import { EventCard } from "./components/EventCard"
import { useAuth } from "../../providers/AuthProvider"
import { useEffect } from "react"


export const LandingPage = () => {

    // const { onLogout } = useAuth();

    // useEffect(() => {
    //     onLogout();
    // }, [onLogout]);

    return <>
        <BaseLayout>
            <Flex flexDirection="column" gap="2em" marginLeft="5em">
                <Header />
                <Flex gap="2em">
                    <ExplanationCard />
                    <SocialCard />
                </Flex>
                <Flex flexDirection="row" gap="12em">
                    <Flex flexDirection="column" gap="1em">
                        <ChakraLink as={ReactRouterLink} to="/register">
                            <RegisterCard />
                        </ChakraLink>
                        <ChakraLink as={ReactRouterLink} to="/login">
                            <LoginCard />
                        </ChakraLink>
                    </Flex>
                    <EventCard />
                </Flex>
            </Flex>
        </BaseLayout>
    </>
}