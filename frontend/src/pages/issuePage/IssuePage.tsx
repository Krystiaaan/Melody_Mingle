import { Text, Flex } from "@chakra-ui/react";
import { Navbar } from "../generalComponents/Navbar";
import { BaseLayout } from "../../layout/BaseLayout";

export const IssuePage = () => {
  return (
    <BaseLayout>
      <Navbar></Navbar>
      <Flex mt={"auto"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Text color={"white"}>Have You tried restarting the application? (͡• ͜ʖ ͡•)</Text>
      </Flex>
      </BaseLayout>

  );
};
