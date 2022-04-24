import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { DuplicateRecipeBuilderData } from "../../utils/data";
import RecipeBuilder from "./RecipeBuilder";
import { v4 as uuidv4 } from "uuid";

interface RecipeFromWebProps {
  showError: (text: string) => void;
}

const isValidList = (list: any) => {
  if (!Array.isArray(list)) {
    return false;
  }
  for (const item of list) {
    if (!item) return false;
  }
  return true;
};

const RecipeFromWeb: React.FC<RecipeFromWebProps> = ({ showError }) => {
  const [url, setUrl] = useState("");
  const [recipeInfo, setRecipeInfo] =
    useState<DuplicateRecipeBuilderData | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecipeData = async () => {
    setLoading(true);

    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    setLoading(false);

    if (data?.message) {
      showError(data.message);
    } else if (data?.recipe) {
      showError("");

      const {
        name,
        recipeIngredients,
        recipeInstructions,
        recipeCategories,
        recipeYield,
        image,
      } = data.recipe;

      setRecipeInfo({
        name: name?.trim() || "",
        ingredients: isValidList(recipeIngredients) ? recipeIngredients : [],
        instructions: isValidList(recipeInstructions) ? recipeInstructions : [],
        categories: isValidList(recipeCategories) ? recipeCategories : [],
        servings: recipeYield?.toString().trim() || "",
        image2: image?.trim() || "",
        destination: url,
      });

      setUrl("");
    }
  };

  return (
    <div>
      {!recipeInfo ? (
        <div className="w-full relative bg-white px-5 py-8 md:py-12 md:px-9 rounded-xl shadow-sm">
          <div className="px-3">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                children={
                  <AiOutlineSearch className="text-xl text-grey-icon" />
                }
              />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                variant="outline"
                type="text"
                placeholder="Enter recipe link"
                borderRadius="3xl"
                py="5"
                borderColor="borderGrey"
                borderWidth="2px"
                onKeyUp={(e) => {
                  if (e.key === "Enter") getRecipeData();
                }}
              />
            </InputGroup>
            <div className="mx-3">
              <p className="text-sm text-grey-muted mt-2">
                Results may vary depending on the website, as this{" "}
                <a
                  href="https://www.npmjs.com/package/recipe-data-scraper"
                  target="_blank"
                  className="font-bold"
                >
                  library{" "}
                </a>
                works best with those that utilize either microdata or JSON-LD.
                Example:
                https://www.bbcgoodfood.com/recipes/steaks-goulash-sauce-sweet-potato-fries
              </p>
              <Button
                isLoading={loading}
                className="text-sm text-black mt-3"
                px="6"
                onClick={() => getRecipeData()}
                disabled={url === ""}
              >
                Get recipe
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <RecipeBuilder
          id={uuidv4()}
          builderData={recipeInfo}
          deleteFn={() => setRecipeInfo(null)}
          showError={showError}
        />
      )}
    </div>
  );
};

export default RecipeFromWeb;
