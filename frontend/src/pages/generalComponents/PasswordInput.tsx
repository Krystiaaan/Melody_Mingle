import { Button, InputGroup, InputRightElement } from "@chakra-ui/react"
import { InputControl } from "formik-chakra-ui";
import { useState } from "react"

export const PasswordInput = () => 
    {
        const [show, setShow] = useState(false)
        const handleClick = () => setShow(!show)
    
        return <>
            <InputGroup size="md">
                <InputControl
                    name="password"
                    label="Password"
                    inputProps={{type: show ? "text" : "password"}}
                    bg="mingle.lightPurple"
                />
                <InputRightElement width='4.5rem'>
                    <Button 
                        h="1.75rem"
                        size="sm"
                        onClick={handleClick} 
                        _hover={{ bg: "mingle.specialPurple"}}
                        bg="mingle.darkPurple" 
                        color="mingle.lightPurple"
                    >
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </>
    }