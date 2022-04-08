import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  CloseButton,
  Stack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { RecipeFromWeb, BuildersStack } from "../components";

const NewRecipe: NextPage = () => {
  const [createMethod, setCreateMethod] = useState("manual");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage !== "") {
      setTimeout(() => setErrorMessage(""), 10000);
    }
  }, [errorMessage]);

  return (
    <>
      {errorMessage && (
        <Alert
          className="fixed top-20 left-0 z-[1000]"
          status="error"
          variant="solid"
        >
          <AlertIcon />
          <AlertDescription className="flex-grow font-semibold ">
            {errorMessage}
          </AlertDescription>
          <CloseButton onClick={() => setErrorMessage("")} />
        </Alert>
      )}
      <div className="max-w-4xl mx-auto px-9 md:px-12 lg:px-5 py-10 sm:py-16">
        <Stack direction="row" spacing={5} align="center">
          {["manual", "webscrape"].map((method: string) => (
            <Button
              key={`${method}-button`}
              variant="ghost"
              _hover={{
                bg: `${createMethod === method ? "transparent" : "hoverGrey"}`,
              }}
              _focus={{ outline: "none" }}
              _active={{ bg: "transparent" }}
              onClick={() => setCreateMethod(method)}
              px="2"
            >
              <div className="font-bold relative">
                {method === "webscrape" ? "Copy from web" : "Create recipe"}
                <span
                  className={`absolute -bottom-2 left-0 w-full h-[3px] ${
                    createMethod === method
                      ? "transition-all translate-y-0 bg-black duration-[40ms] ease-out"
                      : "transition-none -translate-y-3 bg-transparent"
                  } `}
                ></span>
              </div>
            </Button>
          ))}
        </Stack>
        <div className="mt-6">
          {createMethod === "manual" ? (
            <BuildersStack showError={setErrorMessage} />
          ) : (
            <RecipeFromWeb showError={setErrorMessage} />
          )}
        </div>
      </div>
    </>
  );
};

export default NewRecipe;
