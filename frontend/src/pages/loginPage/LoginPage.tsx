import { BaseLayout } from "../../layout/BaseLayout"
import {Flex} from "@chakra-ui/react"

import { LoginCard } from './components/LoginCard';

export const LoginPage = () => {

    return <>
        <BaseLayout>
            <Flex margin="auto">
                <LoginCard />
            </Flex>
        </BaseLayout>
    </>
}