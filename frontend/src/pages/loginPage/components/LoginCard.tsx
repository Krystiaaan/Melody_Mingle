import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import { useEffect, useState } from "react";
import { LoginUserData, useAuth } from "../../../providers/AuthProvider.tsx";

import z from "zod";

import { toFormikValidationSchema } from "zod-formik-adapter";

const LoginSchema = z.object({
  eMail: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string(),
});

const initialFormValues: LoginUserData = {
  eMail: "",
  password: "",
};

export const LoginCard = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { onLogin, isAuthenticated } = useAuth();

  const onSubmitLoginForm = async (values: LoginUserData) => {
    setIsSubmitted(true);
    onLogin(values);
    setIsSubmitted(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/melodymingle");
    }
  });

    
  return (
    <>
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="lg">
        <Flex flexDirection="column" gap="2em" marginTop="1em" justifyContent="center">
          <Formik<LoginUserData>
            initialValues={initialFormValues}
            validationSchema={toFormikValidationSchema(LoginSchema)}
            onSubmit={onSubmitLoginForm}
          >
            {(formik) => (
              <Form>
                <Flex flexDirection="column" justifyContent="center" gap="1em">
                  <Flex justifyContent="center">
                    <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
                      Login
                    </Text>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl
                      name="eMail"
                      label="Email Adress"
                      inputProps={{ type: "email" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl
                      name={"password"}
                      label="Password"
                      inputProps={{ type: "password" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                  <Flex justifyContent="center">
                    <Button
                      type="submit"
                      bg="mingle.darkPurple"
                      color="mingle.lightPurple"
                      width="5em"
                      _hover={{ bg: "mingle.specialPurple" }}
                      isLoading={isSubmitted}
                    >
                      Submit
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            )}
          </Formik>
          <Flex flexDirection="column" gap="1em" alignItems="center">
            <Text color="mingle.lightPurple">
              Don't have an account?{" "}
              <ChakraLink as={ReactRouterLink} to="/register" color="mingle.darkPurple">
                Register now!
              </ChakraLink>
            </Text>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
