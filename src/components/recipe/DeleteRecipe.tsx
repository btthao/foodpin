import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  CloseButton,
  MenuItem,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { client } from "../../client";
import { resetFeed } from "../../store/features/feedSlice";

interface DeleteRecipeProps {
  id: string;
  finishDeleteExistingRecipe: () => void;
}

const DeleteRecipe: React.FC<DeleteRecipeProps> = ({
  id,
  finishDeleteExistingRecipe,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const deleteRecipe = () => {
    setIsDeleting(true);
    client
      .delete(id)
      .then(() => {
        finishDeleteExistingRecipe();
        dispatch(resetFeed());
        setIsDeleting(false);
      })
      .catch((err) => {
        console.log(err);
        setIsDeleting(false);
        setErrorMessage(
          "There was a problem deleting your recipe. Try again later."
        );
      });
  };

  return (
    <>
      <MenuItem
        onClick={onOpen}
        fontWeight="bold"
        _hover={{ bg: "bgGrey" }}
        _focus={{ bg: "transparent" }}
      >
        Delete recipe
      </MenuItem>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => setErrorMessage("")}
      >
        <ModalOverlay />
        <ModalContent p="0">
          <div>
            {errorMessage && (
              <Alert
                className="fixed top-0 left-0"
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
            <div className="text-center py-8">
              <div>
                <p className="font-bold mb-6">
                  Are you sure you want to delete this recipe?
                </p>
                <div className="flex justify-center gap-6">
                  <Button
                    width="80px"
                    variant="primary"
                    isLoading={isDeleting}
                    onClick={() => deleteRecipe()}
                  >
                    Yes
                  </Button>
                  <Button width="80px" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteRecipe;
