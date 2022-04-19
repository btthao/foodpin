import ProgressBar from "@badrap/bar-of-progress";
import { useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { client } from "../client";
import { Avatar } from "../components";
import ButtonGroup from "../components/ButtonGroup";
import UserList from "../components/user/UserList";
import {
  resetList,
  selectUserPage,
  setListData,
} from "../store/features/userPageSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { RecipeRef, User, userQuery } from "../utils/data";

const UserPage: NextPage = () => {
  const router = useRouter();
  const userId = router.query?.id ? (router.query.id as string) : null;
  const [userData, setUserData] = useState<User | null>(null);
  const [userNotExist, setUserNotExist] = useState(false);
  const [list, setList] = useState("Created");
  const { saveList, createdList } = useAppSelector(selectUserPage);
  const dispatch = useAppDispatch();
  const progress = new ProgressBar({
    size: 4,
    color: "#87ce7e",
    delay: 0,
  });
  const toast = useToast();
  const fetchUser = () => {
    if (userId) {
      progress.start();
      const query = userQuery(userId);
      client
        .fetch(query)
        .then((data) => {
          progress.finish();
          if (!data.length) {
            setUserNotExist(true);
          }

          dispatch(
            setListData({
              userId,
              saveList: data[0].saveList?.length
                ? data[0].saveList
                    .filter((recipe: RecipeRef) => recipe.recipeRef)
                    .map((recipe: RecipeRef) => recipe.recipeRef)
                : [],
              createdList: data[0].createdList?.length
                ? data[0].createdList
                    .filter((recipe: RecipeRef) => recipe.recipeRef)
                    .map((recipe: RecipeRef) => recipe.recipeRef)
                : [],
            })
          );
          setUserData(data[0]);
        })
        .catch((err) => {
          console.error(err);
          progress.finish();
          toast.closeAll();
          toast({
            title: "Something went wrong. Try again later.",
            status: "error",
            duration: null,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    setUserNotExist(false);
    setList("Created");
    dispatch(resetList());
    fetchUser();
  }, [userId]);

  return (
    <>
      {userData && (
        <div className="w-full grid place-items-center mt-16">
          <div>
            <Avatar name={userData.userName} src={userData.image} size="xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 sm:mt-4">
            {userData.userName}
          </h1>
          <div className="mt-7">
            <ButtonGroup
              options={["Created", "Saved"]}
              selected={list}
              setOption={setList}
            />
          </div>
          <div className="mt-12 w-full">
            {list === "Created" ? (
              <UserList key={userId + "-created"} recipes={createdList} />
            ) : (
              <UserList key={userId + "-saved"} recipes={saveList} />
            )}
          </div>
        </div>
      )}
      {userNotExist && (
        <div className="text-center mt-36 font-bold text-lg">
          User not found.
        </div>
      )}
    </>
  );
};

export default UserPage;
