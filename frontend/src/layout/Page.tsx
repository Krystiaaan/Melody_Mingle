import { chakra, HTMLChakraProps } from "@chakra-ui/react";

export interface PageProps extends HTMLChakraProps<"main"> {}

export const Page = ({ children, ...boxProps }: PageProps) => (
  <chakra.main
    flex={1}
    overflowX="hidden"
    display="flex"
    flexDirection="column"
    ml="auto"
    bg={"#1B1E2D"}
    mr="auto"
    width="100%"
    height="100vh"
    {...boxProps}
  >
    {children}
  </chakra.main>
);

<Page flex={2} />;
