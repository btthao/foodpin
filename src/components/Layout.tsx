import { Container, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Header } from ".";

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    toast.closeAll();
  }, [router.pathname]);

  return (
    <Container
      maxW="none"
      minW="350px"
      p="0"
      m="0"
      bg={`${router.asPath.includes("new-recipe") ? "bgGrey" : "white"}`}
      className=" min-h-screen h-full "
    >
      <Header />
      <div className="relative mt-20">{children}</div>
    </Container>
  );
};

export default Layout;
