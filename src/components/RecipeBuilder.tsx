import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { Oval } from "react-loader-spinner";
import { Categories, List } from ".";
import { client } from "../client";
import { selectUser } from "../store/features/userSlice";
import { useAppSelector } from "../store/store";
import { duplicateRecipeBuilderData, recipeBuilderData } from "../utils/data";
// pass down prop id to list and categories
interface RecipeBuilderProps {
  id: string;
  builderData: duplicateRecipeBuilderData;
  duplicateFn: (
    afterId: string | null,
    data: duplicateRecipeBuilderData
  ) => void;
  deleteFn: (id: string) => void;
  showError: () => void;
}

type RecipeDoc = recipeBuilderData & {
  _type: string;
  byUser: any;
};

export enum uploadState {
  NOT_UPLOADING,
  ATTEMPT_UPLOADING,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
}

const RecipeBuilder: React.FC<RecipeBuilderProps> = ({
  id,
  builderData,
  duplicateFn,
  deleteFn,
  showError,
}) => {
  // start recipe data state
  const [name, setName] = useState<string>(builderData?.name || "");
  const [ingredients, setIngredients] = useState<string[]>(
    builderData?.ingredients || []
  );
  const [instructions, setInstructions] = useState<string[]>(
    builderData?.instructions || []
  );
  const [categories, setCategories] = useState<string[]>(
    builderData?.categories || []
  );
  const [servings, setServings] = useState<string>(
    builderData?.servings || "1"
  );
  const [image1, setImage1] = useState<any>(builderData?.image1 || null);
  const [image2, setImage2] = useState<string>(builderData?.image2 || "");
  const [destination, setDestination] = useState<string>(
    builderData?.destination || ""
  );
  // end recipe data state
  const { id: userId } = useAppSelector(selectUser);
  const router = useRouter();
  const [upload, setUpload] = useState<number>(uploadState.NOT_UPLOADING);
  const [showSpinner, setShowSpinner] = useState(false);

  const acceptedImgType = ["image/jpeg", "image/png", "image/webp"];

  const createDoc = (image1?: any) => {
    const doc: RecipeDoc = {
      _type: "recipe",
      name,
      ingredients,
      instructions,
      categories,
      servings,
      destination,
      image2: image2 || "",
      byUser: {
        _type: "byUser",
        _ref: userId,
      },
    };

    if (image1) {
      doc.image1 = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: image1._id,
        },
      };
    }

    client
      .create(doc)
      .then(() => {
        alert("upload success");
        // router.push("/");
      })
      .catch((error: { message: any }) => {
        showError();
        setShowSpinner(false);
        console.log("Upload failed:", error.message);
      });
  };

  const uploadRecipe = () => {
    setUpload(uploadState.ATTEMPT_UPLOADING);

    if (
      name &&
      ingredients.length > 0 &&
      instructions.length > 0 &&
      (image1 || image2)
    ) {
      setShowSpinner(true);

      if (image1 && acceptedImgType.includes(image1.type)) {
        client.assets
          .upload("image", image1, {
            contentType: image1.type,
            filename: image1.name,
          })
          .then((documentImg) => {
            createDoc(documentImg);
          })
          .catch((error: { message: any }) => {
            console.log("Upload failed:", error.message);
            showError();
            setShowSpinner(false);
          });
      } else {
        createDoc();
      }
    }
  };

  return (
    <div className="w-full relative bg-white px-5 py-8 md:py-12 md:px-9 rounded-xl shadow-sm">
      {showSpinner && (
        <div className="absolute  top-0 left-0 w-full h-full bg-white z-50  opacity-90 flex justify-center pt-20">
          <Oval
            ariaLabel="loading-indicator"
            height={100}
            width={100}
            strokeWidth={5}
            color="#f1b0b0"
            secondaryColor="#d8d8d8"
          />
        </div>
      )}
      {/* edit and submit btn */}
      <div className="w-full flex justify-between items-center px-3 ">
        <Menu autoSelect={false}>
          <MenuButton
            p="1"
            className="grid place-items-center"
            ml="-2"
            borderRadius="full"
            variant="ghost"
            as={Button}
          >
            <BiDotsHorizontalRounded className="text-grey-icon text-2xl" />
          </MenuButton>
          <MenuList className="shadow-elevated " border="none" minWidth="none">
            <MenuItem
              onClick={() => {
                deleteFn(id);
              }}
              fontWeight="bold"
              _hover={{ bg: "bgGrey" }}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                duplicateFn(id, {
                  name,
                  ingredients,
                  instructions,
                  categories,
                  servings,
                  image1,
                  image2,
                  destination,
                });
              }}
              pr="16"
              fontWeight="bold"
              _hover={{ bg: "bgGrey" }}
            >
              Duplicate
            </MenuItem>
          </MenuList>
        </Menu>
        <Button variant="primary" onClick={() => uploadRecipe()}>
          Upload recipe
        </Button>
      </div>
      {/* recipe name */}
      <div className="px-3 mt-7">
        <Input
          isInvalid={upload === uploadState.ATTEMPT_UPLOADING && name == ""}
          variant="flushed"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe name"
          className="font-bold"
          fontSize="2xl"
          borderColor="borderGrey"
          _placeholder={{ color: "#757575" }}
        />
      </div>
      {/* recipe details */}
      <div className="max-h-[800px] overflow-scroll px-3 md:flex md:flex-row-reverse md:gap-8">
        <div className="md:flex-1">
          {/* servings */}
          <div className="mt-8 flex items-center">
            <span className="mr-2 font-bold">Serves</span>
            <NumberInput
              size="sm"
              maxW={16}
              defaultValue={servings}
              min={1}
              onChange={(valueAsString) => setServings(valueAsString)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper color="gray.500" />
                <NumberDecrementStepper color="gray.500" />
              </NumberInputStepper>
            </NumberInput>
          </div>
          {/* categories */}
          <div className="mt-7">
            <Categories
              id={id}
              categories={categories}
              setCategories={setCategories}
            />
          </div>
          {/* ingredients and instructions */}
          <div className="sm:flex md:flex-col sm:gap-8 md:gap-4">
            <div className="mt-8 flex-[0.6]">
              <List
                name={`${id}-ingredients`}
                list={ingredients}
                updateList={setIngredients}
                upload={upload}
              />
            </div>
            <div className="mt-8 flex-1">
              <List
                name={`${id}-instructions`}
                list={instructions}
                updateList={setInstructions}
                upload={upload}
              />
            </div>
          </div>
          {/* destination */}
          <div className="mt-10">
            <Input
              variant="flushed"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Add a destination link"
              borderColor="borderGrey"
              _placeholder={{ color: "#757575" }}
            />
          </div>
        </div>
        {/* img upload */}
        <div className="w-full mt-12 md:mt-8 md:flex-[0.8]">
          {!image1 && !image2 ? (
            <div>
              <Box
                bg="bgGrey"
                borderColor={
                  upload == uploadState.ATTEMPT_UPLOADING ? "error" : "bgGrey"
                }
                borderWidth="2px"
                className="relative rounded-md md:min-h-[380px] md:p-3 md:flex md:flex-col"
              >
                <div className="flex flex-row items-center justify-between px-4 py-4 md:flex-col-reverse md:justify-center md:gap-4 md:border md:border-dashed md:border-gray-400 md:rounded-md md:flex-1">
                  <p className="text-black font-bold ">Click to upload</p>
                  <IoIosImages className="text-3xl text-grey-icon" />
                </div>
                <Input
                  type="file"
                  accept={acceptedImgType.join(",")}
                  name="upload-recipe-image"
                  onChange={(e) => {
                    setImage2("");
                    setImage1(e.target.files?.[0]);
                  }}
                  className="cursor-pointer h-full w-full absolute top-0 left-0 opacity-0"
                />
              </Box>
              <p className="mt-3 text-[#757575] text-xs">
                Recommendation: Use high-quality JPG, JPEG, PNG.
              </p>
            </div>
          ) : (
            <Box
              border="1px"
              borderColor="borderGrey"
              className="relative p-2 rounded-lg"
            >
              <img
                src={image2 !== "" ? image2 : URL.createObjectURL(image1)}
                alt="uploaded-pic"
                className="h-full w-full object-contain rounded-lg"
              />
              <Button
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 shadow-2xl"
                width="40px"
                height="40px"
                onClick={() => {
                  setImage1(null);
                  setImage2("");
                }}
              >
                <FaTrash />
              </Button>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeBuilder;
