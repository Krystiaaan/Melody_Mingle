import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl } from "formik-chakra-ui";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useLoginStore } from "../../../stores/login.store.ts";

import z from "zod";
import { useApiClient } from "../../../adapter/api/useApiClient.ts";
import { AxiosError } from "axios";
import { useAuth } from "../../../providers/AuthProvider.tsx";

const RegisterUserSchema = z
  .object({
    eMail: z.string().email({
      message: "Invalid email format",
    }),
    username: z.string(),
    dateOfBirth: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long")
  })
  .refine(
    (data) => data.password == data.confirmPassword,
    { message: "Passwords do not match", 
      path: ["confirmPassword"]
    }
  );

export type RegisterUserData = {
  eMail: string;
  username: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
};

const initialFormValues: RegisterUserData = {
  eMail: "",
  username: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
};

interface ErrorDetail {
  errors: string;
}

export const RegisterCard = () => {
  const loginStore = useLoginStore();

  const client = useApiClient();
  const { onLogin } = useAuth();

  const onSubmitRegisterForm = async (
    values: RegisterUserData,
    formikHelpers: FormikHelpers<RegisterUserData>
  ) => {
    const body = {
      eMail: values.eMail,
      username: values.username,
      dateOfBirth: values.dateOfBirth,
      password: values.password,
    };

    try {
      const resp = await client.postAuthRegister(body);
      if (resp.status === 201) {
        const userID = resp.data[0].id;
        loginStore.setUserID(userID ?? "no id received");
        loginStore.setRegisterState("userDetails");
        onLogin({ eMail: values.eMail, password: values.password });
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        const errorMsg = (err.response.data as ErrorDetail).errors[0];
        if (errorMsg === "User with this username already exists")
          formikHelpers.setErrors({ username: errorMsg });
        else if (errorMsg === "User with this email already exists")
          formikHelpers.setErrors({ eMail: errorMsg });
        else console.error("Error:", errorMsg);
      }
    }
  };

  return (
    <>
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="lg">
        <Flex flexDirection="column" gap="2em" marginTop="1em">
          <Flex justifyContent="center">
            <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
              Register
            </Text>
          </Flex>
          <Formik<RegisterUserData>
            initialValues={initialFormValues}
            onSubmit={onSubmitRegisterForm}
            validationSchema={toFormikValidationSchema(RegisterUserSchema)}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <Flex flexDirection="column" gap="1em">
                  <Flex flexDirection="column" justifyContent="center" gap="1em">
                    <InputControl name="username" label="Username" bg="mingle.lightPurple" borderRadius="0.3em"/>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl
                      name={"eMail"}
                      label="Email address"
                      inputProps={{ type: "email" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl
                      name={"dateOfBirth"}
                      label="Date of Birth"
                      inputProps={{ type: "date" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    {/* TODO: Replace with passwordinput */}
                    <InputControl
                      name={"password"}
                      label="Password"
                      inputProps={{ type: "password" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl
                      name={"confirmPassword"}
                      label="Confirm Password"
                      inputProps={{ type: "password" }}
                      bg="mingle.lightPurple"
                      borderRadius="0.3em"
                    />
                  </Flex>
                </Flex>
                <Flex flexDirection="column" gap="1em" alignItems="center" paddingTop="1em">
                  <Button
                    type={"submit"}
                    bg="mingle.darkPurple"
                    color="mingle.lightPurple"
                    width="5em"
                    _hover={{ bg: "mingle.specialPurple" }}
                  >
                    Continue 
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Flex flexDirection="column" margin="auto">
            <Text color="mingle.lightPurple">
              Already have an account?{" "}
              <ChakraLink as={ReactRouterLink} to="/login" color="mingle.darkPurple">
                Login now!
              </ChakraLink>
            </Text>
            <Flex gap="1rem" justifyContent="center">
              <Text fontSize="4xl" color="mingle.darkPurple">
                ⬤
              </Text>
              <Text fontSize="4xl" color="mingle.lightPurple">
                ⬤
              </Text>
              <Text fontSize="4xl" color="mingle.lightPurple">
                ⬤
              </Text>
              <Text fontSize="4xl" color="mingle.lightPurple">
                ⬤
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
