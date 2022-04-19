import { Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { client } from "../../client";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../../store/store";
import { updateSaveStatus } from "../../store/features/feedSlice";
import LoginModal from "../user/LoginModal";
import {
  selectUserPage,
  updateSaveStatusUserList,
} from "../../store/features/userPageSlice";
import { useSelector } from "react-redux";

interface SaveRecipeProps {
  recipeId: string;
  userId?: string;
  saved: boolean;
}

const SaveRecipe: React.FC<SaveRecipeProps> = ({ recipeId, userId, saved }) => {
  const [savedByCurrentUser, setSavedByCurrentUser] = useState(saved);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { userId: userPageId } = useSelector(selectUserPage);

  useEffect(() => {
    setSavedByCurrentUser(saved);
  }, [saved]);

  if (!userId) {
    return (
      <LoginModal
        btnProps={{
          variant: "primary",
          borderRadius: "3xl",
          py: "6",
        }}
        btnText="Save"
      />
    );
  }
  return (
    <>
      {savedByCurrentUser ? (
        <Button
          isLoading={loading}
          onClick={(e) => {
            e.stopPropagation();
            setLoading(true);
            client
              .transaction()
              .patch(recipeId, (p) => p.unset([`save[userId=="${userId}"]`]))
              .patch(userId, (p) =>
                p.unset([`saveList[recipeId=="${recipeId}"]`])
              )
              .commit()
              .then(() => {
                setLoading(false);
                setSavedByCurrentUser(false);
                dispatch(
                  updateSaveStatus({ _id: recipeId, userId, saved: false })
                );
                dispatch(
                  updateSaveStatusUserList({
                    _id: recipeId,
                    userId,
                    saved: false,
                    isOwnList: userId === userPageId,
                  })
                );
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
              .transaction()
              .patch(recipeId, (p) =>
                p.setIfMissing({ save: [] }).insert("after", "save[-1]", [
                  {
                    _key: uuidv4(),
                    userId,
                    byUser: {
                      _type: "byUser",
                      _ref: userId,
                    },
                  },
                ])
              )
              .patch(userId, (p) =>
                p
                  .setIfMissing({ saveList: [] })
                  .insert("after", "saveList[-1]", [
                    {
                      _key: uuidv4(),
                      recipeId,
                      recipeRef: {
                        _type: "recipeRef",
                        _ref: recipeId,
                        _weak: true,
                      },
                    },
                  ])
              )
              .commit()
              .then(() => {
                setLoading(false);
                setSavedByCurrentUser(true);
                dispatch(
                  updateSaveStatus({ _id: recipeId, userId, saved: true })
                );
                dispatch(
                  updateSaveStatusUserList({
                    _id: recipeId,
                    userId,
                    saved: true,
                    isOwnList: userId === userPageId,
                  })
                );
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
