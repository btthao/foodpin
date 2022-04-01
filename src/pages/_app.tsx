import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Layout } from "../components";

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        primary: {
          fontWeight: "bold",
          bg: "primary",
          color: "white",
          _hover: {
            bg: "#e22749",
          },
        },
        solid: {
          fontWeight: "bold",
          bg: "bgGrey",
          color: "black",
          _hover: {
            bg: "hoverGrey",
          },
        },
        dark: {
          fontWeight: "bold",
          bg: "gray.900",
          color: "white",
          border: "2px",
          borderColor: "gray.900",
          _hover: {
            bg: "gray.900",
          },
          _active: {
            bg: "gray.900",
          },
        },
        ghost: {
          _hover: {
            bg: "bgGrey",
          },
        },
      },
    },
  },
  semanticTokens: {
    colors: {
      error: "red.500",
      success: "green.500",
      primary: {
        default: "#da415d",
      },
      secondary: {
        default: "#FFE535",
      },
      hoverGrey: "#e1e1e1",
      bgGrey: "#efefef",
      borderGrey: "#CDCDCD",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
