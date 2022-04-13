import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { client } from "../client";
import { v4 as uuidv4 } from "uuid";

interface SaveRecipeProps {
  recipeId: string;
  userId: string;
  saved: boolean;
}

const SaveRecipe: React.FC<SaveRecipeProps> = ({ recipeId, userId, saved }) => {
  const [savedByCurrentUser, setSavedByCurrentUser] = useState(saved);
  const toast = useToast();
  return (
    <>
      {savedByCurrentUser ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setSavedByCurrentUser(false);
            client
              .patch(recipeId)
              .unset([`save[userId=="${userId}"]`])
              .commit()
              .catch((err) => {
                setSavedByCurrentUser(true);
                toast({
                  title: "Something went wrong. Try again later!",
                  status: "error",
                  duration: 10000,
                  isClosable: true,
                });
                console.log(err);
              });
          }}
          bg="black"
          color="white"
          _hover={{ bg: "black", color: "white" }}
          _active={{ bg: "black", color: "white" }}
          borderRadius="3xl"
          py="6"
        >
          Saved
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setSavedByCurrentUser(true);
            client
              .patch(recipeId)
              .setIfMissing({ save: [] })
              .insert("after", "save[-1]", [
                {
                  _key: uuidv4(),
                  userId,
                  byUser: {
                    _type: "byUser",
                    _ref: userId,
                  },
                },
              ])
              .commit()
              .catch((err) => {
                setSavedByCurrentUser(false);
                toast({
                  title: "Something went wrong. Try again later!",
                  status: "error",
                  duration: 10000,
                  isClosable: true,
                });
                console.log(err);
              });
          }}
          variant="primary"
          borderRadius="3xl"
          py="6"
        >
          Save
        </Button>
      )}
    </>
  );
};

export default SaveRecipe;
