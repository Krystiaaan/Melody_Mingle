import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useLoginStore } from "../../../stores/login.store";
import { useApiClient } from "../../../adapter/api/useApiClient";

import { InputControl, SelectControl } from "formik-chakra-ui";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import { useAuth } from "../../../providers/AuthProvider";

const UserDetailsSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  city: z.string(),
  state: z.string(),
});

export type UserDetailsData = z.infer<typeof UserDetailsSchema>;

const initialFormValues: UserDetailsData = {
  firstname: "",
  lastname: "",
  city: "",
  state: "",
};

export const UserDetails = () => {
  const loginStore = useLoginStore();
  const client = useApiClient();
  const { accessToken } = useAuth();


  const onSubmitRegisterForm = async (values: UserDetailsData) => {
    const body = {
      firstname: values.firstname,
      lastname: values.lastname,
      city: values.city,
      state: values.state,
    };
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    try {
      await client.putUsersUserId(loginStore.userID, accessToken, {data: body});
    } catch (error) {
      console.error("Error adding user details", error);
      return;
    }
    loginStore.setRegisterState("userGender");
  };

  return (
    <>
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="lg">
        <Flex flexDirection="column" gap="2em" marginTop="1em">
          <ArrowBackIcon
            fontSize="2em"
            onClick={() => {
              loginStore.setRegisterState("initRegister");
            }}
            style={{ cursor: "pointer" }}
          />
          <Flex justifyContent="center">
            <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
              Tell us about you
            </Text>
          </Flex>
          <Formik<UserDetailsData>
            initialValues={initialFormValues}
            onSubmit={onSubmitRegisterForm}
            validationSchema={toFormikValidationSchema(UserDetailsSchema)}
          >
            {(formik) => (
              <Form>
                <Flex flexDirection="column" justifyContent="center" gap="1em">
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl label="Firstname" name="firstname" bg="mingle.lightPurple" borderRadius="0.3em"/>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <InputControl label="Lastname" name="lastname" bg="mingle.lightPurple" borderRadius="0.3em"/>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <SelectControl name="city" selectProps={{ placeholder: "Select city" }} bg="mingle.lightPurple" borderRadius="0.3em">
                      <option value="Darmstadt">Darmstadt</option>
                      <option value="Frankfurt">Frankfurt</option>
                    </SelectControl>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center">
                    <SelectControl name="state" selectProps={{ placeholder: "Select state" }} bg="mingle.lightPurple" borderRadius="0.3em">
                      <option value="Hessen">Hessen</option>
                    </SelectControl>
                  </Flex>
                </Flex>
                <Flex paddingTop="1em" justifyContent="center">
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
          <Flex flexDirection="column" alignItems="center">
            <Flex gap="1rem">
              <Text
                fontSize="4xl"
                color="mingle.lightPurple"
                onClick={() => {
                  loginStore.setRegisterState("initRegister");
                }}
                style={{ cursor: "pointer" }}
              >
                ⬤
              </Text>
              <Text fontSize="4xl" color="mingle.darkPurple">
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
