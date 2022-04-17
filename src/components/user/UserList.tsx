import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { urlFor } from "../../client";
import { RecipeData, RecipeRef } from "../../utils/data";
import Feed from "../Feed";
import ImageBox from "./ImageBox";

interface UserListProps {
  recipes: RecipeRef[] | null;
}

const UserList: React.FC<UserListProps> = ({ recipes }) => {
  console.log(recipes);
  const [display, setDisplay] = useState("stack");
  const [pins, setPins] = useState<RecipeData[]>([]);

  useEffect(() => {
    setPins(
      recipes && recipes.length ? recipes.map((recipe) => recipe.recipeRef) : []
    );
  }, [recipes]);

  if (!recipes || !recipes.length) {
    return (
      <div className="font-bold text-xl text-center">
        No recipe in this list.
      </div>
    );
  }
  return (
    <>
      {display === "stack" ? (
        <div className="mx-auto flex items-center justify-center">
          <button
            onClick={() => setTimeout(() => setDisplay("grid"), 100)}
            className="cursor-pointer hover:brightness-75 hover:underline transition-all text-left transform focus:scale-[90%]"
          >
            <div>
              <Stack direction="row" spacing="-70px">
                {recipes.slice(0, 5).map((recipe, idx) => (
                  <ImageBox key={recipe.recipeId} zIndex={20 - idx}>
                    <img
                      className="w-full h-full object-cover"
                      src={
                        recipe.recipeRef.image1
                          ? urlFor(recipe.recipeRef.image1).url()
                          : recipe.recipeRef.image2
                      }
                      alt={recipe.recipeRef.name}
                    />
                  </ImageBox>
                ))}
                {recipes.length < 5 &&
                  new Array(5 - recipes.length)
                    .fill(1)
                    .map((_, idx) => (
                      <ImageBox
                        key={"placeholder" + idx}
                        zIndex={10 - idx}
                      ></ImageBox>
                    ))}
              </Stack>
              <div className="mt-2 ml-2 ">{recipes.length} recipes</div>
            </div>
          </button>
        </div>
      ) : (
        <div>
          <Feed data={pins} />
        </div>
      )}
    </>
  );
};

export default UserList;
