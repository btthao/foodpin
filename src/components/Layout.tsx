import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Header } from ".";

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <Container
      maxW="none"
      p="0"
      m="0"
      bg={`${router.asPath.includes("new-recipe") ? "bgGrey" : "white"}`}
      className="min-h-screen flex flex-col"
    >
      <Header />
      <div className="flex-grow">{children}</div>
    </Container>
  );
};

export default Layout;
