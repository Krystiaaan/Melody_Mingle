import {
  Box,
  Button,
  Flex,
  Text,
  Radio,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useLoginStore } from "../../../stores/login.store";
import { RadioGroupControl } from "formik-chakra-ui";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Form, Formik } from "formik";
import { useApiClient } from "../../../adapter/api/useApiClient";
import { useAuth } from "../../../providers/AuthProvider";

const UserGenderSchema = z.object({
  gender: z.string(),
});

export type UserGenderData = z.infer<typeof UserGenderSchema>;

const initialFormValues: UserGenderData = {
  gender: "",
};

export const UserGender = () => {
  const loginStore = useLoginStore();
  const client = useApiClient();
  const { accessToken } = useAuth();

  const onSubmitRegisterForm = async (values: UserGenderData) => {
    const body = {
      gender: values.gender,
    };

    if (!accessToken) {
      console.error("No access token found");
      return;
    }
        try {
          await client.putUsersUserId(loginStore.userID, accessToken, { data: body });
        } catch (error) {
          console.error("Error adding user gender", error);
          return;
        }

    loginStore.setRegisterState("userTaste");
  };
  return (
    <>
      <Box bg="mingle.purple" borderRadius="1em" padding="1em" width="lg">
        <Flex flexDirection="column" gap="2em" marginTop="1em">
          <ArrowBackIcon
            fontSize="2em"
            onClick={() => {
              loginStore.setRegisterState("userDetails");
            }}
            style={{ cursor: "pointer" }}
          />
          <Flex justifyContent="center">
            <Text color="mingle.darkPurple" fontSize="4xl" fontWeight="bold">
              What is your Gender?
            </Text>
          </Flex>
          <Formik<UserGenderData>
            initialValues={initialFormValues}
            onSubmit={onSubmitRegisterForm}
            validationSchema={toFormikValidationSchema(UserGenderSchema)}
          >
            {(formik) => (
              <Form>
                <Flex flexDirection="column" gap="1em" alignItems="center">
                  <RadioGroupControl name="gender" bg="mingle.lightPurple" borderRadius="0.3em" padding="1em">
                    <Flex flexDirection="column" gap="1.5em">
                      <Radio value="male" bg="mingle.darkPurple">Male</Radio>
                      <Radio value="female" bg="mingle.darkPurple">Female</Radio>
                      <Radio value="divers" bg="mingle.darkPurple">Divers</Radio>
                    </Flex>
                  </RadioGroupControl>
                  <Button
                    bg="mingle.darkPurple"
                    color="mingle.lightPurple"
                    width="5em"
                    _hover={{ bg: "mingle.hoverColor" }}
                    type={"submit"}
                  >
                    Continue
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Flex flexDirection="column" gap="1em" alignItems="center">
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
              <Text
                fontSize="4xl"
                color="mingle.lightPurple"
                onClick={() => {
                  loginStore.setRegisterState("userDetails");
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
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
