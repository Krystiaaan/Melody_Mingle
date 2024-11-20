import { BaseLayout } from "../../layout/BaseLayout"
import {Flex} from "@chakra-ui/react"

import { RegisterCard } from './components/RegisterCard'
import { UserDetails } from "./components/UserDetails"
import { UserGender } from "./components/UserGender"
import { useLoginStore } from "../../stores/login.store"
import { UserTaste } from "../generalComponents/UserTaste"
import { useEffect } from "react"



export const RegisterPage = () => {
    
    useEffect(() => {
        loginStore.setRegisterState("initRegister");
    }, [])

    const loginStore = useLoginStore()
    return <>
        <BaseLayout>
            <Flex flexDirection="column" margin="auto">
                {loginStore.registerState === "initRegister" && <RegisterCard />}   
                {loginStore.registerState === "userDetails" && <UserDetails />}  
                {loginStore.registerState === "userGender" && <UserGender />}  
                {loginStore.registerState === "userTaste" && <UserTaste showUserTaste={true} getCalledFrom="Register"/>}  
            </Flex>
        </BaseLayout>
    </>
}