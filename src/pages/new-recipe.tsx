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
import { selectUser } from "../store/features/userSlice";
import { useAppSelector } from "../store/store";

const createMethods = ["Create recipe", "Copy from web"];

const NewRecipe: NextPage = () => {
  const [createMethod, setCreateMethod] = useState(createMethods[0]);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useAppSelector(selectUser);

  useEffect(() => {
    if (errorMessage !== "") {
      setTimeout(() => setErrorMessage(""), 10000);
    }
  }, [errorMessage]);

  if (!currentUser)
    return (
      <div className="text-center mt-36 font-bold text-lg">
        Only signed in users can create recipe!
      </div>
    );

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
      <div className="max-w-4xl w-screen mx-auto px-9 md:px-12 lg:px-5 py-10 sm:py-16">
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
