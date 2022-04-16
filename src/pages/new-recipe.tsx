import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { BuildersStack, RecipeFromWeb } from "../components";
import ButtonGroup from "../components/ButtonGroup";

const createMethods = ["Create recipe", "Copy from web"];

const NewRecipe: NextPage = () => {
  const [createMethod, setCreateMethod] = useState(createMethods[0]);
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
        <ButtonGroup
          options={createMethods}
          selected={createMethod}
          setOption={setCreateMethod}
        />
        <div className="mt-6">
          {createMethod === createMethods[0] ? (
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
