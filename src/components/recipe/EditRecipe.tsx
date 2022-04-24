import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  MenuItem,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RecipeData } from "../../utils/data";
import RecipeBuilder from "./RecipeBuilder";

interface EditRecipeProps {
  data: RecipeData;
  editFinished: boolean;
  finishEditExistingRecipe: () => void;
}

const EditRecipe: React.FC<EditRecipeProps> = ({
  data,
  editFinished,
  finishEditExistingRecipe,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editFinished) {
      onClose();
    }
  }, [editFinished]);

  return (
    <>
      <MenuItem
        onClick={onOpen}
        fontWeight="bold"
        _hover={{ bg: "bgGrey" }}
        _focus={{ bg: "transparent" }}
      >
        Edit recipe
      </MenuItem>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCloseComplete={() => setErrorMessage("")}
      >
        <ModalOverlay />
        <ModalContent maxW="none" width="fit-content" p="0">
          <div className="max-w-4xl mx-auto w-full">
            {errorMessage && (
              <Alert
                className="fixed top-0 left-0 z-[1000]"
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
            <RecipeBuilder
              id={data._id}
              builderData={data}
              showError={setErrorMessage}
              finishEditExistingRecipe={finishEditExistingRecipe}
            />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditRecipe;
