import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { client } from "../../client";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../../store/store";
import { updateSaveStatus } from "../../store/features/feedSlice";

interface SaveRecipeProps {
  recipeId: string;
  userId: string;
  saved: boolean;
}

const SaveRecipe: React.FC<SaveRecipeProps> = ({ recipeId, userId, saved }) => {
  const [savedByCurrentUser, setSavedByCurrentUser] = useState(saved);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {savedByCurrentUser ? (
        <Button
          isLoading={loading}
          onClick={(e) => {
            e.stopPropagation();
            setLoading(true);
            client
              .patch(recipeId)
              .unset([`save[userId=="${userId}"]`])
              .commit()
              .then((doc) => {
                setLoading(false);
                setSavedByCurrentUser(false);
                dispatch(updateSaveStatus({ _id: recipeId, save: doc.save }));
              })
              .catch((err) => {
                setLoading(false);
                setSavedByCurrentUser(true);
                toast.closeAll();
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
          _loading={{ opacity: "100" }}
          borderRadius="3xl"
          py="6"
        >
          Saved
        </Button>
      ) : (
        <Button
          isLoading={loading}
          onClick={(e) => {
            e.stopPropagation();
            setLoading(true);
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
              .then((doc) => {
                setLoading(false);
                setSavedByCurrentUser(true);
                dispatch(updateSaveStatus({ _id: recipeId, save: doc.save }));
              })
              .catch((err) => {
                setLoading(false);
                setSavedByCurrentUser(false);
                toast.closeAll();
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
