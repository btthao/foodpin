import ProgressBar from "@badrap/bar-of-progress";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaLink } from "react-icons/fa";
import { ImSpoonKnife } from "react-icons/im";
import { client, urlFor } from "../../client";
import {
  Categories,
  Collapses,
  EditRecipe,
  SaveRecipe,
  DeleteRecipe,
} from "../../components";
import { selectUser } from "../../store/features/userSlice";
import { useAppSelector } from "../../store/store";
import { RecipeData, recipeQuery } from "../../utils/data";
import { copyUrlToClipboard } from "../../utils/helpers";

const RecipePage: NextPage = () => {
  const router = useRouter();
  const recipeId = router.query?.id ? (router.query.id as string) : null;
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const { currentUser } = useAppSelector(selectUser);
  const progress = new ProgressBar({
    size: 4,
    color: "#87ce7e",
    delay: 0,
  });

  const toast = useToast();
  const [editFinished, setEditFinished] = useState(false);
  const [deleteFinished, setDeleteFinished] = useState(false);
  const [recipeNotExist, setRecipeNotExist] = useState(false);

  const fetchRecipe = () => {
    if (recipeId) {
      // no need to show loading bar when refetch after edit
      if (!editFinished) {
        progress.start();
      }

      const query = recipeQuery(recipeId);

      client
        .fetch(query)
        .then((data) => {
          if (!data.length) {
            setRecipeNotExist(true);
          }
          setRecipeData(data[0]);
          if (!editFinished) {
            progress.finish();
          } else {
            setEditFinished(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (!editFinished) {
            progress.finish();
          } else {
            setEditFinished(false);
          }
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
    fetchRecipe();
  }, [recipeId]);

  // fetch again after edit
  useEffect(() => {
    if (editFinished) {
      fetchRecipe();
    }
  }, [editFinished]);

  useEffect(() => {
    if (deleteFinished) {
      setRecipeData(null);
    }
  }, [deleteFinished]);

  return (
    <>
      {recipeData && (
        <div className=" max-w-xl lg:max-w-5xl mx-auto py-4">
          <div className="flex flex-col lg:flex-row lg:p-4 bg-white shadow-elevated rounded-3xl overflow-hidden">
            <div className="lg:flex-1 bg-grey1 rounded-3xl overflow-hidden h-fit">
              <img
                className="w-full rounded-3xl"
                src={
                  recipeData.image1
                    ? urlFor(recipeData.image1).url()
                    : recipeData.image2
                }
                alt={recipeData.name}
              />
            </div>
            <div className="lg:flex-1 p-5 flex flex-col gap-2">
              <div className="flex justify-between items-center ">
                <div className="flex gap-2">
                  <Menu autoSelect={false}>
                    <MenuButton
                      p="0"
                      width="44px"
                      height="44px"
                      borderRadius="full"
                      variant="ghost"
                      className="grid place-items-center"
                      ml="-2"
                      as={Button}
                    >
                      <BiDotsHorizontalRounded className=" text-2xl" />
                    </MenuButton>
                    <MenuList
                      className="shadow-elevated "
                      border="none"
                      minWidth="none"
                    >
                      {recipeData.destination && (
                        <MenuItem
                          fontWeight="bold"
                          _hover={{ bg: "bgGrey" }}
                          _focus={{ bg: "transparent" }}
                        >
                          <a
                            target="_blank"
                            href={recipeData.destination}
                            className="w-full"
                          >
                            View destination
                          </a>
                        </MenuItem>
                      )}
                      <MenuItem
                        fontWeight="bold"
                        _hover={{ bg: "bgGrey" }}
                        _focus={{ bg: "transparent" }}
                      >
                        <a
                          target="_blank"
                          href={
                            recipeData.image1
                              ? urlFor(recipeData.image1).url()
                              : recipeData.image2
                          }
                          className="w-full"
                        >
                          View image
                        </a>
                      </MenuItem>
                      {recipeData.byUser._id === currentUser?._id && (
                        <>
                          <EditRecipe
                            data={recipeData}
                            editFinished={editFinished}
                            finishEditExistingRecipe={() =>
                              setEditFinished(true)
                            }
                          />
                          <DeleteRecipe
                            id={recipeData._id}
                            finishDeleteExistingRecipe={() =>
                              setDeleteFinished(true)
                            }
                          />
                        </>
                      )}
                    </MenuList>
                  </Menu>
                  <Button
                    p="0"
                    width="44px"
                    height="44px"
                    borderRadius="full"
                    variant="ghost"
                    onClick={() => {
                      copyUrlToClipboard(recipeData._id);
                      toast.closeAll();
                      toast({
                        title: "Copied to clipboard",
                        status: "success",
                        duration: 1200,
                        isClosable: true,
                      });
                    }}
                  >
                    <FaLink className="text-lg transform rotate-45" />
                  </Button>
                </div>
                <SaveRecipe
                  userId={currentUser?._id}
                  recipeId={recipeData._id}
                  saved={
                    recipeData.save && recipeData.save.length > 0
                      ? recipeData.save.filter(
                          (savedBy) => savedBy.userId === currentUser?._id
                        ).length === 1
                      : false
                  }
                />
              </div>
              <div className="text-lg sm:text-xl">
                <span>Uploaded by </span>
                <span className="font-bold">
                  <Link href={`/${recipeData?.byUser._id}`}>
                    <a>
                      {recipeData.byUser._id === currentUser?._id
                        ? "you"
                        : recipeData.byUser.userName}
                    </a>
                  </Link>
                </span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
                {recipeData.name}
              </h1>

              {recipeData.categories && recipeData.categories.length > 0 && (
                <div className="mt-1">
                  <Categories
                    id={recipeData._id}
                    categories={recipeData.categories}
                  />
                </div>
              )}
              {recipeData.servings && (
                <div className="flex items-center mt-4">
                  <span className="mr-2 bg-gray-800 p-[0.4rem] rounded-full text-sm  text-white">
                    <ImSpoonKnife />
                  </span>
                  Servings: {recipeData.servings}
                </div>
              )}
              {recipeData.ingredients && recipeData.ingredients.length > 0 && (
                <div className="mt-2">
                  <Collapses
                    title="Ingredients"
                    content={
                      <ul className="text-sm">
                        {recipeData.ingredients.map((ingredient, idx) => (
                          <li key={`${recipeData._id}-${ingredient}-${idx}`}>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                </div>
              )}
              {recipeData.instructions && recipeData.instructions.length > 0 && (
                <div className="mt-2">
                  <Collapses
                    title="Instructions"
                    content={
                      <ul className="text-sm">
                        {recipeData.instructions.map((instruction, idx) => (
                          <li
                            className="mb-3"
                            key={`${recipeData._id}-${instruction}-${idx}`}
                          >
                            <h6 className="font-bold">Step {idx + 1}</h6>
                            <p>{instruction}</p>
                          </li>
                        ))}
                      </ul>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {recipeNotExist && (
        <div className="text-center mt-36 font-bold text-lg">
          Recipe not found.
        </div>
      )}
      {deleteFinished && (
        <div className="text-center mt-36 font-bold text-lg">
          This recipe has been deleted.
        </div>
      )}
    </>
  );
};

export default RecipePage;
