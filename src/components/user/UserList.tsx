import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { urlFor } from "../../client";
import { RecipeData } from "../../utils/data";
import Feed from "../Feed";
import ImageBox from "./ImageBox";

interface UserListProps {
  recipes: RecipeData[];
}

const UserList: React.FC<UserListProps> = ({ recipes }) => {
  const [display, setDisplay] = useState("stack");

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
                  <ImageBox key={recipe._id} zIndex={20 - idx}>
                    <img
                      className="w-full h-full object-cover"
                      src={
                        recipe.image1
                          ? urlFor(recipe.image1).url()
                          : recipe.image2
                      }
                      alt={recipe.name}
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
          <Feed data={recipes} />
        </div>
      )}
    </>
  );
};

export default UserList;
